package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.payment.CaptureResponseDto;
import com.learnspace.learnspacebackend.dtos.payment.CartDto;
import com.learnspace.learnspacebackend.dtos.payment.CheckoutResponseDto;

import java.util.List;
import java.util.Map;

public interface PaymentService {

    CheckoutResponseDto checkout(List<CartDto> cartItems);

    CaptureResponseDto capturePayment(String paypalOrderId);

    void handleWebhookEvent(String payload, Map<String, String> headers);
}
