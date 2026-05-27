package com.learnspace.learnspacebackend.configs;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnspace.learnspacebackend.dtos.payment.PaypalOrderRequestDto;
import com.learnspace.learnspacebackend.dtos.payment.PaypalOrderResponseDto;
import com.learnspace.learnspacebackend.dtos.payment.PaypalWebhookEventDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Configuration
public class PaypalConfigs {

    @Value("${paypal.client_id}")
    private String clientId;

    @Value("${paypal.client_secret}")
    private String clientSecret;

    @Value("${paypal.webhook_id}")
    private String webhookId;

    @Value("${paypal.return_url}")
    private String returnUrl;

    @Value("${paypal.cancel_url}")
    private String cancelUrl;

    @Value("${exhangerate_api.api_key}")
    private String exchangeRateApiKey;

    private final String baseUrl = "https://api-m.sandbox.paypal.com";

    @Autowired
    private ObjectMapper objectMapper;

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record AccessTokenResponse(
            @JsonProperty("access_token") String accessToken,
            @JsonProperty("expires_in") Integer expiresIn) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record ExchangeRateResponse(
            String result, @JsonProperty("conversion_rate") BigDecimal conversionRate) {

        boolean isSuccess() {
            return "success".equals(result);
        }
    }

    private record WebhookVerifyRequest(
            @JsonProperty("auth_algo") String authAlgo,
            @JsonProperty("cert_url") String certUrl,
            @JsonProperty("transmission_id") String transmissionId,
            @JsonProperty("transmission_sig") String transmissionSig,
            @JsonProperty("transmission_time") String transmissionTime,
            @JsonProperty("webhook_id") String webhookId,
            @JsonProperty("webhook_event") JsonNode webhookEvent) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record WebhookVerifyResponse(
            @JsonProperty("verification_status") String verificationStatus) {

        boolean isSuccess() {
            return "SUCCESS".equals(verificationStatus);
        }
    }

    public String getAccessToken() {
        String credentials = clientId + ":" + clientSecret;
        String encoded =
                Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));

        AccessTokenResponse response = RestClient.create()
                .post()
                .uri(baseUrl + "/v1/oauth2/token")
                .header("Authorization", "Basic " + encoded)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body("grant_type=client_credentials")
                .retrieve()
                .body(AccessTokenResponse.class);

        if (response == null || response.accessToken() == null) {
            throw new RuntimeException("Không lấy được access token của PayPal");
        }
        return response.accessToken();
    }

    public PaypalOrderResponseDto createOrder(BigDecimal usdAmount, String description) {
        String accessToken = getAccessToken();
        String usdValue = usdAmount.setScale(2, RoundingMode.HALF_UP).toPlainString();

        PaypalOrderRequestDto request = new PaypalOrderRequestDto(
                "CAPTURE",
                List.of(new PaypalOrderRequestDto.PurchaseUnit(
                        new PaypalOrderRequestDto.Amount("USD", usdValue), description)),
                new PaypalOrderRequestDto.ApplicationContext(
                        returnUrl, cancelUrl, "PAY_NOW", "LearnSpace"));

        PaypalOrderResponseDto response = RestClient.create()
                .post()
                .uri(baseUrl + "/v2/checkout/orders")
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(PaypalOrderResponseDto.class);

        if (response == null || response.id() == null) {
            throw new RuntimeException("Lỗi tạo PayPal order");
        }
        return response;
    }

    public PaypalOrderResponseDto captureOrder(String paypalOrderId) {
        String accessToken = getAccessToken();

        PaypalOrderResponseDto response = RestClient.create()
                .post()
                .uri(baseUrl + "/v2/checkout/orders/" + paypalOrderId + "/capture")
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(PaypalOrderResponseDto.class);

        if (response == null) {
            throw new RuntimeException("Lỗi capture PayPal order");
        }
        return response;
    }

    public boolean verifyWebhookSignature(String payload, Map<String, String> headers) {
        String accessToken = getAccessToken();

        try {
            WebhookVerifyRequest request = new WebhookVerifyRequest(
                    headers.getOrDefault("paypal-auth-algo", ""),
                    headers.getOrDefault("paypal-cert-url", ""),
                    headers.getOrDefault("paypal-transmission-id", ""),
                    headers.getOrDefault("paypal-transmission-sig", ""),
                    headers.getOrDefault("paypal-transmission-time", ""),
                    webhookId,
                    objectMapper.readTree(payload));

            WebhookVerifyResponse response = RestClient.create()
                    .post()
                    .uri(baseUrl + "/v1/notifications/verify-webhook-signature")
                    .header("Authorization", "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(WebhookVerifyResponse.class);

            return response != null && response.isSuccess();
        } catch (Exception e) {
            System.err.println("Lỗi verify webhook: " + e.getMessage());
            return false;
        }
    }

    public PaypalWebhookEventDto parseWebhookEvent(String payload) {
        try {
            return objectMapper.readValue(payload, PaypalWebhookEventDto.class);
        } catch (Exception ex) {
            throw new RuntimeException("Lỗi webhook event");
        }
    }

    public BigDecimal convertVndToUsd(BigDecimal vndAmount) {
        ExchangeRateResponse response = RestClient.create()
                .get()
                .uri("https://v6.exchangerate-api.com/v6/" + exchangeRateApiKey + "/pair/VND/USD")
                .retrieve()
                .body(ExchangeRateResponse.class);

        if (response == null || !response.isSuccess()) {
            throw new RuntimeException("Lỗi chuyển đổi đơn vị tiền tệ");
        }
        return vndAmount.multiply(response.conversionRate()).setScale(2, RoundingMode.HALF_UP);
    }
}
