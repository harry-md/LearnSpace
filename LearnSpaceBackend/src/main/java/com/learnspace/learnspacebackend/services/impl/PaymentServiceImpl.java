package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.payment.*;
import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
import com.learnspace.learnspacebackend.mappers.PaymentMapper;
import com.learnspace.learnspacebackend.pojo.*;
import com.learnspace.learnspacebackend.repositories.CourseRepository;
import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;
import com.learnspace.learnspacebackend.repositories.PaymentRepository;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.PaymentService;
import com.learnspace.learnspacebackend.services.StripeService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StripeService stripeService;

    @Autowired
    private PaymentMapper paymentMapper;

    private CustomUserDetails getLoggedInPrincipal() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private void activatePayments(List<Payment> payments, String paymentIntentId) {
        payments.stream()
                .filter(payment -> payment.getStatus() != PaymentStatus.COMPLETED)
                .forEach(payment -> {
                    payment.setStatus(PaymentStatus.COMPLETED);
                    payment.setStripePaymentIntentId(paymentIntentId);
                    paymentRepository.addOrUpdatePayment(payment);
                    Enrollment enrollment = payment.getEnrollment();
                    enrollment.setStatus(EnrollmentStatus.ACTIVE);
                    enrollmentRepository.addOrUpdateEnrollment(enrollment);
                });
    }

    @Override
    public CheckoutDto checkout(List<CartDto> carts) throws StripeException {
        if (carts == null || carts.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống");
        }
        User student = userRepository.getUserById(getLoggedInPrincipal().getId());
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<Payment> payments = new ArrayList<>();

        for (CartDto c : carts) {
            Course course = courseRepository.getCourseById(c.courseId());
            if (course.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                throw new RuntimeException("Khóa học miễn phí");
            }

            Enrollment enrollment = enrollmentRepository.getEnrollmentByStudentAndCourse(
                    student.getId(), course.getId());
            Payment payment = null;
            if (enrollment != null) {
                if (enrollment.getStatus() == EnrollmentStatus.ACTIVE
                        || enrollment.getStatus() == EnrollmentStatus.COMPLETED) {
                    throw new RuntimeException("Đã đăng ký khóa học " + course.getName() + " rồi");
                }
                payment = paymentRepository.getPaymentByEnrollmentId(enrollment.getId());
            } else {
                enrollment = new Enrollment();
                enrollment.setStudent(student);
                enrollment.setCourse(course);
            }
            enrollment.setStatus(EnrollmentStatus.PENDING);
            enrollment = enrollmentRepository.addOrUpdateEnrollment(enrollment);
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
                    return paymentMapper.toDto(paymentRepository.addOrUpdatePayment(payment));
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
                List<Payment> payments =
                        paymentRepository.getPaymentsByStripeSessionId(session.getId());
                if (!payments.isEmpty()) {
                    activatePayments(payments, session.getPaymentIntent());
                }
            }
        }
    }
}
