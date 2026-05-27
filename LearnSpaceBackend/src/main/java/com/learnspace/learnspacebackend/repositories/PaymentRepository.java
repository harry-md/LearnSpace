package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Payment;

import java.util.List;

public interface PaymentRepository {

    Payment getPaymentById(int id);

    Payment getPaymentByPaypalOrderId(String paypalOrderId);

    List<Payment> getPaymentsByPaypalOrderId(String paypalOrderId);

    Payment addOrUpdatePayment(Payment payment);
}
