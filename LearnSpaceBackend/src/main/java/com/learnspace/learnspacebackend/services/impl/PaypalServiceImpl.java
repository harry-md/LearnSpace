package com.learnspace.learnspacebackend.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnspace.learnspacebackend.services.ExternalApiClient;
import com.learnspace.learnspacebackend.services.PaypalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaypalServiceImpl implements PaypalService {

    @Value("${paypal.webhook_id}")
    private String PAYPAL_WEBHOOK_ID;

    @Value("${paypal.return_url}")
    private String PAYPAL_RETURN_URL;

    @Value("${paypal.cancel_url}")
    private String PAYPAL_CANCEL_URL;

    private final String PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ExternalApiClient externalApiClient;

    public Map<String, String> createOrder(BigDecimal usdAmount, String description) {
        String accessToken = externalApiClient.getPaypalAccessToken();
        String usdValue = usdAmount.setScale(2, RoundingMode.HALF_UP).toPlainString();
        Map<String, Object> request = Map.of(
                "intent", "CAPTURE",
                "purchase_units",
                        List.of(Map.of(
                                "amount",
                                Map.of("currency_code", "USD", "value", usdValue),
                                "description",
                                description)),
                "application_context",
                        Map.of(
                                "return_url",
                                PAYPAL_RETURN_URL,
                                "cancel_url",
                                PAYPAL_CANCEL_URL,
                                "user_action",
                                "PAY_NOW",
                                "brand_name",
                                "LearnSpace"));

        Map<String, Object> response = RestClient.create()
                .post()
                .uri(PAYPAL_BASE_URL + "/v2/checkout/orders")
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(Map.class);

        if (response == null || !response.containsKey("id")) {
            throw new RuntimeException("Lỗi tạo PayPal order");
        }

        String orderId = (String) response.get("id");
        String approvalUrl = null;
        List<Map<String, String>> links = (List<Map<String, String>>) response.get("links");

        for (Map<String, String> link : links) {
            if (link.get("rel").equals("approve")) {
                approvalUrl = link.get("href");
                break;
            }
        }
        return Map.of("orderId", orderId, "approvalUrl", approvalUrl != null ? approvalUrl : "");
    }

    public Map<String, String> captureOrder(String paypalOrderId) {
        String accessToken = externalApiClient.getPaypalAccessToken();
        Map<String, Object> response = RestClient.create()
                .post()
                .uri(PAYPAL_BASE_URL + "/v2/checkout/orders/" + paypalOrderId + "/capture")
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(Map.class);
        if (response == null) {
            throw new RuntimeException("Lỗi capture PayPal order");
        }
        String captureId = "";
        List<Map<String, Object>> purchaseUnits =
                (List<Map<String, Object>>) response.get("purchase_units");
        if (purchaseUnits != null && !purchaseUnits.isEmpty()) {
            Map<String, Object> payments =
                    (Map<String, Object>) purchaseUnits.get(0).get("payments");
            if (payments != null) {
                List<Map<String, Object>> captures =
                        (List<Map<String, Object>>) payments.get("captures");
                if (captures != null && !captures.isEmpty()) {
                    captureId = (String) captures.get(0).get("id");
                }
            }
        }
        return Map.of(
                "captureId", captureId, "status", (String) response.getOrDefault("status", ""));
    }

    public boolean verifyPaypalWebhook(String payload, Map<String, String> headers) {
        String accessToken = externalApiClient.getPaypalAccessToken();
        try {
            Map<String, Object> request = Map.of(
                    "auth_algo", headers.get("paypal-auth-algo"),
                    "cert_url", headers.get("paypal-cert-url"),
                    "transmission_id", headers.get("paypal-transmission-id"),
                    "transmission_sig", headers.get("paypal-transmission-sig"),
                    "transmission_time", headers.get("paypal-transmission-time"),
                    "webhook_id", PAYPAL_WEBHOOK_ID,
                    "webhook_event", objectMapper.readTree(payload));

            Map<String, Object> response = RestClient.create()
                    .post()
                    .uri(PAYPAL_BASE_URL + "/v1/notifications/verify-webhook-signature")
                    .header("Authorization", "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(Map.class);

            return response != null && response.get("verification_status").equals("SUCCESS");
        } catch (Exception ex) {
            System.err.println("Lỗi webhook paypal: " + ex.getMessage());
            return false;
        }
    }

    public Map<String, String> parseWebhookEvent(String payload) {
        try {
            Map<String, Object> event = objectMapper.readValue(payload, Map.class);
            String eventType = (String) event.get("event_type");
            String orderId = null;
            String captureId = null;
            Map<String, Object> resource = (Map<String, Object>) event.get("resource");
            if (resource != null) {
                captureId = (String) resource.get("id");
                Map<String, Object> supplementaryData =
                        (Map<String, Object>) resource.get("supplementary_data");
                if (supplementaryData != null) {
                    Map<String, Object> relatedIds =
                            (Map<String, Object>) supplementaryData.get("related_ids");
                    if (relatedIds != null) {
                        orderId = (String) relatedIds.get("order_id");
                    }
                }
            }
            Map<String, String> result = new HashMap<>();
            result.put("eventType", eventType);
            result.put("orderId", orderId);
            result.put("captureId", captureId);
            return result;
        } catch (Exception ex) {
            throw new RuntimeException("Lỗi webhook event");
        }
    }

    public BigDecimal convertVndToUsd(BigDecimal vndAmount) {
        BigDecimal rate = externalApiClient.getVndToUsdRate();
        return vndAmount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }
}
