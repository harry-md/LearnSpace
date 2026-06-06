package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.service.StripeService;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@RequiredArgsConstructor
@Service
public class StripeServiceImpl implements StripeService {
    @Value("${stripe.secret_key}")
    private String STRIPE_SECRET_KEY;

    @Value("${stripe.webhook_secret}")
    private String STRIPE_WEBHOOK_SECRET;

    @Value("${stripe.success_url}")
    private String STRIPE_SUCCESS_URL;

    @Value("${stripe.cancel_url}")
    private String STRIPE_CANCEL_URL;

    @Override
    public Session createCheckoutSession(BigDecimal amount, String description)
            throws StripeException {
        Stripe.apiKey = STRIPE_SECRET_KEY;
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(STRIPE_SUCCESS_URL)
                .setCancelUrl(STRIPE_CANCEL_URL)
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("vnd")
                                .setUnitAmount(amount.longValue())
                                .setProductData(
                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                .setName(description)
                                                .build())
                                .build())
                        .build())
                .build();
        return Session.create(params);
    }

    @Override
    public Event parseWebhookEvent(String payload, String signatureHeader)
            throws SignatureVerificationException {
        return Webhook.constructEvent(payload, signatureHeader, STRIPE_WEBHOOK_SECRET);
    }
}
