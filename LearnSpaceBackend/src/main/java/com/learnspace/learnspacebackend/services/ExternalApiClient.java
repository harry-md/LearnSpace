package com.learnspace.learnspacebackend.services;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.Base64;

@Service
public class ExternalApiClient {

    @Value("${paypal.client_id}")
    private String PAYPAL_CLIENT_ID;

    @Value("${paypal.client_secret}")
    private String PAYPAL_CLIENT_SECRET;

    @Value("${paypal.webhook_id}")
    private String PAYPAL_WEBHOOK_ID;

    @Value("${paypal.return_url}")
    private String PAYPAL_RETURN_URL;

    @Value("${paypal.cancel_url}")
    private String PAYPAL_CANCEL_URL;

    @Value("${exhangerate_api.api_key}")
    private String EXCHANGEAPIRATE_API_KEY;

    private final String PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record PaypalAccessTokenResponse(
            @JsonProperty("access_token") String accessToken,
            @JsonProperty("expires_in") Integer expiresIn) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record ExchangeRateResponseDto(
            String result, @JsonProperty("conversion_rate") BigDecimal conversionRate) {
        boolean isSuccess() {
            return result.equals("success");
        }
    }

    public String getPaypalAccessToken() {
        String credentials = PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET;
        String encoded = Base64.getEncoder().encodeToString(credentials.getBytes());

        PaypalAccessTokenResponse res = RestClient.create()
                .post()
                .uri(PAYPAL_BASE_URL + "/v1/oauth2/token")
                .header("Authorization", "Basic " + encoded)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body("grant_type=client_credentials")
                .retrieve()
                .body(PaypalAccessTokenResponse.class);

        if (res == null || res.accessToken() == null) {
            throw new RuntimeException("Không lấy được access token của PayPal");
        }
        return res.accessToken();
    }

    public BigDecimal getVndToUsdRate() {
        ExchangeRateResponseDto res = RestClient.create()
                .get()
                .uri("https://v6.exchangerate-api.com/v6/" + EXCHANGEAPIRATE_API_KEY
                        + "/pair/VND/USD")
                .retrieve()
                .body(ExchangeRateResponseDto.class);

        if (res == null || !res.isSuccess()) {
            throw new RuntimeException("Lỗi chuyển đổi đơn vị tiền tệ");
        }
        return res.conversionRate();
    }
}
