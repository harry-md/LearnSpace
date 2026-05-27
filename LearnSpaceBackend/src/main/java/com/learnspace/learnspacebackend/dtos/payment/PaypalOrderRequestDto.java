package com.learnspace.learnspacebackend.dtos.payment;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record PaypalOrderRequestDto(
        String intent,
        @JsonProperty("purchase_units") List<PurchaseUnitDto> purchaseUnitDtos,
        @JsonProperty("application_context") ApplicationContextDto applicationContextDto) {

    public record AmountDto(@JsonProperty("currency_code") String currencyCode, String value) {}

    public record PurchaseUnitDto(AmountDto amountDto, String description) {}

    public record ApplicationContextDto(
            @JsonProperty("return_url") String returnUrl,
            @JsonProperty("cancel_url") String cancelUrl,
            @JsonProperty("user_action") String userAction,
            @JsonProperty("brand_name") String brandName) {}
}
