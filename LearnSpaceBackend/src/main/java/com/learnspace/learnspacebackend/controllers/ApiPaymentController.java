package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.payment.CartDto;
import com.learnspace.learnspacebackend.services.PaymentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiPaymentController {
    @Autowired
    private PaymentService paymentService;

    @PostMapping("/payments/checkout")
    public ResponseEntity<?> checkout(@RequestBody @Valid List<CartDto> cartItems) {
        try {
            return new ResponseEntity<>(paymentService.checkout(cartItems), HttpStatus.CREATED);
        } catch (StripeException ex) {
            return new ResponseEntity<>(
                    Collections.singletonMap("stripe", "Lỗi thanh toán Stripe"), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException ex) {
            System.err.println(ex.getMessage());
            return new ResponseEntity<>(Collections.singletonMap("checkout", ex.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/payments/webhook")
    public ResponseEntity<?> webhook(
            @RequestBody String payload, @RequestHeader("Stripe-Signature") String signatureHeader) {
        try {
            paymentService.handleWebhookEvent(payload, signatureHeader);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (SignatureVerificationException ex) {
            return new ResponseEntity<>(
                    Collections.singletonMap("stripe", "Lỗi xác thực chữ ký Stripe"), HttpStatus.BAD_REQUEST);
        }
    }
}
