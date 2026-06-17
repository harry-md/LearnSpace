package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.dto.payment.*;
import com.learnspace.learnspacebackend.dto.security.CustomUserDetails;
import com.learnspace.learnspacebackend.entity.*;
import com.learnspace.learnspacebackend.exception.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mapper.PaymentMapper;
import com.learnspace.learnspacebackend.repository.CourseRepository;
import com.learnspace.learnspacebackend.repository.EnrollmentRepository;
import com.learnspace.learnspacebackend.repository.PaymentRepository;
import com.learnspace.learnspacebackend.repository.UserRepository;
import com.learnspace.learnspacebackend.service.PaymentService;
import com.learnspace.learnspacebackend.service.StripeService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final StripeService stripeService;
    private final PaymentMapper paymentMapper;

    private CustomUserDetails getPrincipal() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private void activatePayments(List<Payment> payments, String paymentIntentId) {
        payments.stream()
                .filter(payment -> payment.getStatus() != PaymentStatus.COMPLETED)
                .forEach(payment -> {
                    payment.setStatus(PaymentStatus.COMPLETED);
                    payment.setStripePaymentIntentId(paymentIntentId);
                    paymentRepository.save(payment);
                    Enrollment enrollment = payment.getEnrollment();
                    enrollment.setStatus(EnrollmentStatus.ACTIVE);
                    enrollmentRepository.save(enrollment);
                });
    }

    @Override
    public CheckoutDto checkout(List<CartDto> carts) throws StripeException {
        if (carts == null || carts.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống");
        }
        User student = userRepository
                .findById(getPrincipal().getId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("NOT_FOUND", "Không tìm thấy user"));
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Payment> payments = new ArrayList<>();

        for (CartDto c : carts) {
            Course course = courseRepository
                    .findById(c.courseId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("NOT_FOUND", "Không tìm thấy khóa học"));
            if (course.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                throw new RuntimeException("Khóa học miễn phí");
            }

            Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByStudentIdAndCourseId(
                    student.getId(), course.getId());
            Enrollment enrollment = null;
            Payment payment = null;
            if (enrollmentOpt.isPresent()) {
                enrollment = enrollmentOpt.get();
                if (enrollment.getStatus() == EnrollmentStatus.ACTIVE
                        || enrollment.getStatus() == EnrollmentStatus.COMPLETED) {
                    throw new RuntimeException("Đã đăng ký khóa học " + course.getName() + " rồi");
                }
                payment = paymentRepository
                        .findByEnrollmentId(enrollment.getId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "NOT_FOUND", "Không tìm thấy payment"));
            } else {
                enrollment = new Enrollment();
                enrollment.setStudent(student);
                enrollment.setCourse(course);
            }
            enrollment.setStatus(EnrollmentStatus.PENDING);
            enrollment = enrollmentRepository.save(enrollment);
            if (payment == null) {
                payment = new Payment();
                payment.setEnrollment(enrollment);
            }

            payment.setAmount(course.getPrice());
            payment.setStatus(PaymentStatus.PENDING);
            totalAmount = totalAmount.add(course.getPrice());
            payments.add(payment);
        }
        Session session =
                stripeService.createCheckoutSession(totalAmount, "Thanh toán khóa học LearnSpace");
        String sessionId = session.getId();

        List<PaymentDto> paymentDtos = payments.stream()
                .map(payment -> {
                    payment.setStripeSessionId(sessionId);
                    return paymentMapper.toDto(paymentRepository.save(payment));
                })
                .toList();
        return new CheckoutDto(sessionId, session.getUrl(), paymentDtos, totalAmount);
    }

    @Override
    public void handleWebhookEvent(String payload, String sigHeader)
            throws SignatureVerificationException {
        Event event = stripeService.parseWebhookEvent(payload, sigHeader);
        if (event.getType().equals("checkout.session.completed")) {
            Session session =
                    (Session) event.getDataObjectDeserializer().getObject().orElse(null);
            if (session != null && session.getPaymentStatus().equals("paid")) {
                List<Payment> payments = paymentRepository.findByStripeSessionId(session.getId());
                if (!payments.isEmpty()) {
                    activatePayments(payments, session.getPaymentIntent());
                }
            }
        }
    }
}
