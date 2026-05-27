package com.learnspace.learnspacebackend.dtos.payment;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record PaypalOrderRequestDto(
        String intent,
        @JsonProperty("purchase_units") List<PurchaseUnit> purchaseUnits,
        @JsonProperty("application_context") ApplicationContext applicationContext) {

    public record Amount(@JsonProperty("currency_code") String currencyCode, String value) {}

    public record PurchaseUnit(Amount amount, String description) {}

    public record ApplicationContext(
            @JsonProperty("return_url") String returnUrl,
            @JsonProperty("cancel_url") String cancelUrl,
            @JsonProperty("user_action") String userAction,
            @JsonProperty("brand_name") String brandName) {}
}
