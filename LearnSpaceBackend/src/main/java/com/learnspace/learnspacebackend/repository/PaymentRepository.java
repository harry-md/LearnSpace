package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.Payment;

import java.util.List;

public interface PaymentRepository {
    Payment getPaymentByEnrollmentId(int enrollmentId);

    List<Payment> getPaymentsByStripeSessionId(String stripeSessionId);

    Payment addOrUpdatePayment(Payment payment);
}
