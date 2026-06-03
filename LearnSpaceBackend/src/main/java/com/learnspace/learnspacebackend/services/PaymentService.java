package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.payment.CartDto;
import com.learnspace.learnspacebackend.dtos.payment.CheckoutDto;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;

import java.util.List;

public interface PaymentService {
    CheckoutDto checkout(List<CartDto> cartItems) throws StripeException;

    void handleWebhookEvent(String payload, String signatureHeader)
            throws SignatureVerificationException;
}
