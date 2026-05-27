package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.payment.*;
import com.learnspace.learnspacebackend.services.PaymentService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    @Override
    public CheckoutResponseDto checkout(List<CartDto> cartItems) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'checkout'");
    }

    @Override
    public CaptureResponseDto capturePayment(String paypalOrderId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'capturePayment'");
    }

    @Override
    public void handleWebhookEvent(String payload, Map<String, String> headers) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'handleWebhookEvent'");
    }
}
