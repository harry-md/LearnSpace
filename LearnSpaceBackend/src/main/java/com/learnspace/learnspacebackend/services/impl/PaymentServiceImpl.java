package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.payment.PaymentDto;
import com.learnspace.learnspacebackend.pojo.*;
import com.learnspace.learnspacebackend.services.PaymentService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {
    @Override
    public PaymentDto createPayment(int enrollmentId) {
        return null;
    }

    @Override
    public PaymentDto capturePayment(String paypalOrderId) {
        return null;
    }

    @Override
    public void handleWebhookEvent(String payload, Map<String, String> headers) {}
}
