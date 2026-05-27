package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.mappers.PaymentMapper;
import com.learnspace.learnspacebackend.repositories.CourseRepository;
import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;
import com.learnspace.learnspacebackend.repositories.PaymentRepository;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.PaypalService;

import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.Map;

public class PaypalServiceImpl implements PaypalService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaypalService paypalService;

    @Autowired
    private PaymentMapper paymentMapper;

    @Override
    public Map<String, String> createOrder(BigDecimal usdAmount, String description) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createOrder'");
    }

    @Override
    public Map<String, String> captureOrder(String paypalOrderId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'captureOrder'");
    }

    @Override
    public boolean verifyWebhookSignature(String payload, Map<String, String> headers) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'verifyWebhookSignature'");
    }

    @Override
    public Map<String, String> parseWebhookEvent(String payload) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'parseWebhookEvent'");
    }

    @Override
    public BigDecimal convertVndToUsd(BigDecimal vndAmount) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'convertVndToUsd'");
    }
}
