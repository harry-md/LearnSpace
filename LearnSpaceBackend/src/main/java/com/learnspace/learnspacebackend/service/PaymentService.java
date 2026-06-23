package com.learnspace.learnspacebackend.service;

import com.learnspace.learnspacebackend.dto.payment.CartDto;
import com.learnspace.learnspacebackend.dto.payment.CheckoutDto;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;

import java.util.List;

public interface PaymentService {
    CheckoutDto checkout(List<CartDto> cartItems) throws StripeException;

    void handleWebhookEvent(String payload, String signatureHeader)
            throws SignatureVerificationException;
}
