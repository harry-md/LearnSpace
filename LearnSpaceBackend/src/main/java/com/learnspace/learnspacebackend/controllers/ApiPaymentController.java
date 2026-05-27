package com.learnspace.learnspacebackend.controllers;

import com.learnspace.learnspacebackend.services.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiPaymentController {

    @Autowired
    private PaymentService paymentService;
}
