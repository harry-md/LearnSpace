package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Payment;

import java.util.List;

public interface PaymentRepository {

    Payment getPaymentByEnrollmentId(int enrollmentId);

    List<Payment> getPaymentsByPaypalOrderId(String paypalOrderId);

    Payment addOrUpdatePayment(Payment payment);
}
