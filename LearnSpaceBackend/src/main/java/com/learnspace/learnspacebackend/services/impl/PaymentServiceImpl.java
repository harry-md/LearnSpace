package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.payment.*;
import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
import com.learnspace.learnspacebackend.exceptions.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mappers.PaymentMapper;
import com.learnspace.learnspacebackend.pojo.*;
import com.learnspace.learnspacebackend.repositories.CourseRepository;
import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;
import com.learnspace.learnspacebackend.repositories.PaymentRepository;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.PaymentService;
import com.learnspace.learnspacebackend.services.PaypalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
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
    private PaypalService paypalService;

    @Autowired
    private PaymentMapper paymentMapper;

    private CustomUserDetails getLoggedInPrincipal() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Override
    public CheckoutResponseDto checkout(List<CartDto> carts) {
        if (carts == null || carts.isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng trống");
        }

        CustomUserDetails principal = getLoggedInPrincipal();
        User student = userRepository.getUserById(principal.getId());
        if (student == null) {
            throw new ResourceNotFoundException("Không tìm thấy thông tin tài khoản");
        }

        BigDecimal totalVnd = BigDecimal.ZERO;
        List<Payment> payments = new ArrayList<>();

        for (CartDto c : carts) {
            Course course = courseRepository.getCourseById(c.courseId());
            if (course == null) {
                throw new ResourceNotFoundException("Không tìm thấy khóa học #" + c.courseId());
            }

            if (course.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                throw new IllegalArgumentException(
                        "Khóa học " + course.getName() + " miễn phí, không cần thanh toán");
            }

            Enrollment enrollment = enrollmentRepository.getEnrollmentByStudentAndCourse(
                    student.getId(), course.getId());

            Payment payment = null;

            if (enrollment != null) {
                if (enrollment.getStatus() == EnrollmentStatus.ACTIVE
                        || enrollment.getStatus() == EnrollmentStatus.COMPLETED) {
                    throw new IllegalArgumentException(
                            "Bạn đã đăng ký khóa học " + course.getName() + " rồi");
                }

                enrollment.setStatus(EnrollmentStatus.PENDING);
                enrollment = enrollmentRepository.addOrUpdateEnrollment(enrollment);

                payment = paymentRepository.getPaymentByEnrollmentId(enrollment.getId());
            } else {
                enrollment = new Enrollment();
                enrollment.setStudent(student);
                enrollment.setCourse(course);
                enrollment.setStatus(EnrollmentStatus.PENDING);
                enrollment = enrollmentRepository.addOrUpdateEnrollment(enrollment);
            }

            if (payment == null) {
                payment = new Payment();
                payment.setEnrollment(enrollment);
            }

            payment.setVndAmount(course.getPrice());
            payment.setStatus(PaymentStatus.PENDING);

            totalVnd = totalVnd.add(course.getPrice());
            payments.add(payment);
        }

        BigDecimal totalUsd = paypalService.convertVndToUsd(totalVnd);
        if (totalUsd.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền khóa học quá nhỏ");
        }

        for (Payment payment : payments) {
            BigDecimal ratio =
                    payment.getVndAmount().divide(totalVnd, 10, java.math.RoundingMode.HALF_UP);
            BigDecimal usdForThis =
                    totalUsd.multiply(ratio).setScale(2, java.math.RoundingMode.HALF_UP);
            payment.setUsdAmount(usdForThis);
        }

        String description = "Thanh toán " + carts.size() + " khóa học trên LearnSpace";
        Map<String, String> orderResponse = paypalService.createOrder(totalUsd, description);
        String orderId = orderResponse.get("orderId");
        String approvalUrl = orderResponse.get("approvalUrl");

        List<PaymentDto> paymentDtos = new ArrayList<>();
        for (Payment payment : payments) {
            payment.setPaypalOrderId(orderId);
            payment = paymentRepository.addOrUpdatePayment(payment);
            PaymentDto dto = paymentMapper.toDto(payment);
            paymentDtos.add(dto);
        }

        return new CheckoutResponseDto(orderId, approvalUrl, paymentDtos, totalVnd, totalUsd);
    }

    private void activatePayments(List<Payment> payments, String captureId) {
        for (Payment payment : payments) {
            if (payment.getStatus() == PaymentStatus.COMPLETED) {
                continue;
            }
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaypalCaptureId(captureId);
            paymentRepository.addOrUpdatePayment(payment);

            Enrollment enrollment = payment.getEnrollment();
            enrollment.setStatus(EnrollmentStatus.ACTIVE);
            enrollmentRepository.addOrUpdateEnrollment(enrollment);
        }
    }

    @Override
    public CaptureResponseDto capturePayment(String paypalOrderId) {
        List<Payment> payments = paymentRepository.getPaymentsByPaypalOrderId(paypalOrderId);
        if (payments.isEmpty()) {
            throw new ResourceNotFoundException(
                    "Không tìm thấy payment cho PayPal order: " + paypalOrderId);
        }

        CustomUserDetails principal = getLoggedInPrincipal();
        for (Payment payment : payments) {
            if (!payment.getEnrollment().getStudent().getId().equals(principal.getId())) {
                throw new org.springframework.security.access.AccessDeniedException(
                        "Payment này không thuộc về bạn");
            }
        }

        boolean allCompleted =
                payments.stream().allMatch(p -> p.getStatus() == PaymentStatus.COMPLETED);
        if (allCompleted) {
            throw new IllegalArgumentException("Đơn hàng này đã được thanh toán rồi");
        }

        Map<String, String> captureResponse = paypalService.captureOrder(paypalOrderId);
        String captureId = captureResponse.get("captureId");
        String status = captureResponse.get("status");

        if ("COMPLETED".equals(status)) {
            activatePayments(payments, captureId);
        }

        List<PaymentDto> paymentDtos =
                payments.stream().map(paymentMapper::toDto).collect(Collectors.toList());

        return new CaptureResponseDto(paypalOrderId, captureId, status, paymentDtos);
    }

    @Override
    public void handleWebhookEvent(String payload, Map<String, String> headers) {
        if (!paypalService.verifyPaypalWebhook(payload, headers)) {
            System.err.println("Không xác thực được webhook từ PayPal");
            return;
        }

        Map<String, String> event = paypalService.parseWebhookEvent(payload);
        String eventType = event.get("eventType");
        String orderId = event.get("orderId");

        if (orderId == null) {
            return;
        }

        List<Payment> payments = paymentRepository.getPaymentsByPaypalOrderId(orderId);
        if (payments.isEmpty()) {
            return;
        }

        switch (eventType) {
            case "PAYMENT.CAPTURE.COMPLETED" -> {
                String captureId = event.get("captureId");
                activatePayments(payments, captureId);
            }
            case "PAYMENT.CAPTURE.DENIED", "PAYMENT.CAPTURE.REFUNDED" -> {
                for (Payment payment : payments) {
                    payment.setStatus(PaymentStatus.CANCELLED);
                    paymentRepository.addOrUpdatePayment(payment);

                    Enrollment enrollment = payment.getEnrollment();
                    enrollment.setStatus(EnrollmentStatus.DISABLED);
                    enrollmentRepository.addOrUpdateEnrollment(enrollment);
                }
            }
        }
    }
}
