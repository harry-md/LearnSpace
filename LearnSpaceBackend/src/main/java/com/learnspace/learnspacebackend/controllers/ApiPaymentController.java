package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.payment.CartDto;
import com.learnspace.learnspacebackend.dtos.payment.CheckoutDto;
import com.learnspace.learnspacebackend.services.PaymentService;

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
    public ResponseEntity<?> checkout(@RequestBody @Valid List<CartDto> cartItems) {
        try {
            CheckoutDto checkout = paymentService.checkout(cartItems);
            return new ResponseEntity<>(checkout, HttpStatus.CREATED);
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @PostMapping("/payments/webhook")
    public ResponseEntity<?> webhook(
            @RequestBody String payload, @RequestHeader("Stripe-Signature") String signatureHeader) {
        try {
            paymentService.handleWebhookEvent(payload, signatureHeader);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
