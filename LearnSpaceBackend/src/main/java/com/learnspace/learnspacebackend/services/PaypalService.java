package com.learnspace.learnspacebackend.services;

import java.math.BigDecimal;
import java.util.Map;

public interface PaypalService {

    Map<String, String> createOrder(BigDecimal usdAmount, String description);

    Map<String, String> captureOrder(String paypalOrderId);

    boolean verifyPaypalWebhook(String payload, Map<String, String> headers);

    Map<String, String> parseWebhookEvent(String payload);

    BigDecimal convertVndToUsd(BigDecimal vndAmount);
}
