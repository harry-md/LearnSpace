package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Payment;

public interface PaymentRepository {

    Payment getPaymentById(int id);

    Payment getPaymentByPaypalOrderId(String paypalOrderId);

    Payment addOrUpdatePayment(Payment payment);
}
