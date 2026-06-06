package com.learnspace.learnspacebackend.controller;

import com.learnspace.learnspacebackend.dto.payment.CartDto;
import com.learnspace.learnspacebackend.dto.payment.CheckoutDto;
import com.learnspace.learnspacebackend.service.PaymentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class ApiPaymentController {
    private final PaymentService paymentService;

    @PostMapping("/payments/checkout")
    public ResponseEntity<CheckoutDto> checkout(@RequestBody @Valid List<CartDto> cartItems)
            throws StripeException {
        CheckoutDto checkout = paymentService.checkout(cartItems);
        return new ResponseEntity<>(checkout, HttpStatus.CREATED);
    }

    @PostMapping("/payments/webhook")
    public ResponseEntity<Void> webhook(
            @RequestBody String payload, @RequestHeader("Stripe-Signature") String signatureHeader)
            throws SignatureVerificationException {
        paymentService.handleWebhookEvent(payload, signatureHeader);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
