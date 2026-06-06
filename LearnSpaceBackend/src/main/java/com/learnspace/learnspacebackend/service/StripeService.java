package com.learnspace.learnspacebackend.service;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;

import java.math.BigDecimal;

public interface StripeService {
    Session createCheckoutSession(BigDecimal amount, String description) throws StripeException;

    Event parseWebhookEvent(String payload, String signatureHeader)
            throws SignatureVerificationException;
}
