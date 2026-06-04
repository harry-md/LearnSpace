package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Payment;

import java.util.List;

public interface PaymentRepository {
    Payment getPaymentByEnrollmentId(int enrollmentId);

    List<Payment> getPaymentsByStripeSessionId(String stripeSessionId);

    Payment addOrUpdatePayment(Payment payment);
}
