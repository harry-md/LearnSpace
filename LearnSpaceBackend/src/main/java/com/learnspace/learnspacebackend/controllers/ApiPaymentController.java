package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.payment.CartDto;
import com.learnspace.learnspacebackend.dtos.payment.CheckoutDto;
import com.learnspace.learnspacebackend.services.PaymentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiPaymentController {
    @Autowired
    private PaymentService paymentService;

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
