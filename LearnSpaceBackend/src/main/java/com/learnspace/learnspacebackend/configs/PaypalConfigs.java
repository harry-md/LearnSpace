package com.learnspace.learnspacebackend.configs;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Base64;
import java.util.Map;

@Configuration
public class PaypalConfigs {
    @Value("${paypal.client_id}")
    private String PAYPAL_CLIENT_ID;

    @Value("${paypal.client_secret}")
    private String PAYPAL_CLIENT_SECRET;

    private String PAYPAL_API_BASE_URL = "https://api-m.sandbox.paypal.com";

    @Value("${paypal.webhook_id}")
    private String PAYPAL_WEBHOOK_ID;

    @Value("${paypal.return_url}")
    private String PAYPAL_RETURN_URL;

    @Value("${paypal.cancel_url}")
    private String PAYPAL_CANCEL_URL;

    @Value("${exhangerate_api.api_key}")
    private String EXCHANGE_RATE_API_KEY;

    @Autowired
    private ObjectMapper objectMapper;

    public String getAccessToken() {
        String credentials = PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET;
        String encoded = Base64.getEncoder().encodeToString(credentials.getBytes());

        RestClient client = RestClient.create();
        String response = client.post()
                .uri(PAYPAL_API_BASE_URL + "/v1/oauth2/token")
                .header("Authorization", "Basic " + encoded)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body("grant_type=client_credentials")
                .retrieve()
                .body(String.class);

        try {
            JsonNode json = objectMapper.readTree(response);
            return json.get("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("Không lấy được access token của Paypal");
        }
    }

    public Map<String, String> createOrder(BigDecimal usdAmount, String description) {
        String accessToken = getAccessToken();
        String usdValue = usdAmount.setScale(2, RoundingMode.HALF_UP).toPlainString();

        try {
            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("intent", "CAPTURE");

            ArrayNode purchaseUnits = objectMapper.createArrayNode();
            ObjectNode unit = objectMapper.createObjectNode();
            ObjectNode amount = objectMapper.createObjectNode();

            amount.put("currency_code", "USD");
            amount.put("value", usdValue);
            unit.set("amount", amount);
            unit.put("description", description);
            purchaseUnits.add(unit);
            requestBody.set("purchase_units", purchaseUnits);

            ObjectNode appContext = objectMapper.createObjectNode();
            appContext.put("return_url", PAYPAL_RETURN_URL);
            appContext.put("cancel_url", PAYPAL_CANCEL_URL);
            appContext.put("user_action", "PAY_NOW");
            appContext.put("brand_name", "LearnSpace");
            requestBody.set("application_context", appContext);

            RestClient restClient = RestClient.create();
            String response = restClient
                    .post()
                    .uri(PAYPAL_API_BASE_URL + "/v2/checkout/orders")
                    .header("Authorization", "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(objectMapper.writeValueAsString(requestBody))
                    .retrieve()
                    .body(String.class);

            JsonNode json = objectMapper.readTree(response);
            String orderId = json.get("id").asText();
            String approvalUrl = null;
            for (JsonNode link : json.get("links")) {
                if ("approve".equals(link.get("rel").asText())) {
                    approvalUrl = link.get("href").asText();
                    break;
                }
            }
            return Map.of("id", orderId, "approvalUrl", approvalUrl);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo PayPal order", e);
        }
    }

    public Map<String, String> captureOrder(String paypalOrderId) {
        String accessToken = getAccessToken();
        RestClient restClient = RestClient.create();
        String response = restClient
                .post()
                .uri(PAYPAL_API_BASE_URL + "/v2/checkout/orders/" + paypalOrderId + "/capture")
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(String.class);

        try {
            JsonNode json = objectMapper.readTree(response);
            String status = json.get("status").asText();
            String captureId = null;
            JsonNode purchaseUnits = json.get("purchase_units");
            if (purchaseUnits != null && purchaseUnits.isArray() && !purchaseUnits.isEmpty()) {
                JsonNode payments = purchaseUnits.get(0).get("payments");
                if (payments != null) {
                    JsonNode captures = payments.get("captures");
                    if (captures != null && captures.isArray() && !captures.isEmpty()) {
                        captureId = captures.get(0).get("id").asText();
                    }
                }
            }
            return Map.of("status", status, "captureId", captureId != null ? captureId : "");
        } catch (Exception e) {
            throw new RuntimeException("Lỗi capture PayPal order", e);
        }
    }

    public boolean verifyWebhookSignature(String payload, Map<String, String> headers) {
        String accessToken = getAccessToken();
        try {
            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("auth_algo", headers.getOrDefault("paypal-auth-algo", ""));
            requestBody.put("cert_url", headers.getOrDefault("paypal-cert-url", ""));
            requestBody.put("transmission_id", headers.getOrDefault("paypal-transmission-id", ""));
            requestBody.put(
                    "transmission_sig", headers.getOrDefault("paypal-transmission-sig", ""));
            requestBody.put(
                    "transmission_time", headers.getOrDefault("paypal-transmission-time", ""));
            requestBody.put("webhook_id", PAYPAL_WEBHOOK_ID);
            requestBody.set("webhook_event", objectMapper.readTree(payload));

            RestClient restClient = RestClient.create();
            String response = restClient
                    .post()
                    .uri(PAYPAL_API_BASE_URL + "/v1/notifications/verify-webhook-signature")
                    .header("Authorization", "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(objectMapper.writeValueAsString(requestBody))
                    .retrieve()
                    .body(String.class);
            JsonNode json = objectMapper.readTree(response);
            return "SUCCESS".equals(json.get("verification_status").asText());
        } catch (Exception e) {
            System.err.println("Lỗi verify webhook: " + e.getMessage());
            return false;
        }
    }

    public BigDecimal convertVndToUsd(BigDecimal vndAmount) {
        RestClient restClient = RestClient.create();
        String response = restClient
                .get()
                .uri("https://v6.exchangerate-api.com/v6/" + EXCHANGE_RATE_API_KEY
                        + "/pair/VND/USD")
                .retrieve()
                .body(String.class);

        try {
            JsonNode json = objectMapper.readTree(response);
            if (!"success".equals(json.get("result").asText())) {
                throw new RuntimeException("Lỗi gọi API");
            }

            BigDecimal rate = json.get("conversion_rate").decimalValue();
            return vndAmount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi chuyển đổi tỉ giá");
        }
    }
}
