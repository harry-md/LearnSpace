package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.dtos.payment.CaptureResponseDto;
import com.learnspace.learnspacebackend.dtos.payment.CartDto;
import com.learnspace.learnspacebackend.dtos.payment.CheckoutResponseDto;
import com.learnspace.learnspacebackend.services.PaymentService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiPaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/payments/checkout")
    public ResponseEntity<CheckoutResponseDto> checkout(
            @RequestBody @Valid List<CartDto> cartItems) {
        return new ResponseEntity<>(paymentService.checkout(cartItems), HttpStatus.CREATED);
    }

    @PostMapping("/payments/{paypalOrderId}/capture")
    public ResponseEntity<CaptureResponseDto> capture(
            @PathVariable("paypalOrderId") String paypalOrderId) {
        return ResponseEntity.ok(paymentService.capturePayment(paypalOrderId));
    }

    @PostMapping("/payments/webhook")
    public ResponseEntity<Void> webhook(
            @RequestBody String payload, @RequestHeader Map<String, String> headers) {
        paymentService.handleWebhookEvent(payload, headers);
        return ResponseEntity.ok().build();
    }
}
