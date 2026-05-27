package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.payment.PaymentDto;

import java.util.Map;

public interface PaymentService {
    PaymentDto createPayment(int enrollmentId);

    PaymentDto capturePayment(String paypalOrderId);

    void handleWebhookEvent(String payload, Map<String, String> headers);
}
