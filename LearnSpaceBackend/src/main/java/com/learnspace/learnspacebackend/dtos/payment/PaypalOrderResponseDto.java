package com.learnspace.learnspacebackend.dtos.payment;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PaypalOrderResponseDto(
        String id,
        String status,
        List<PaypalLinkDto> links,
        @JsonProperty("purchase_units") List<PurchaseUnitResponse> purchaseUnits) {

    public record PaypalLinkDto(String href, String rel, String method) {}

    public String approvalUrl() {
        return links.stream()
                .filter(link -> "approve".equals(link.rel()))
                .map(PaypalLinkDto::href)
                .findFirst()
                .orElse(null);
    }

    public String captureId() {
        PurchaseUnitResponse unit = purchaseUnits.get(0);
        List<CaptureDto> captures = unit.payments().captures();
        return captures.get(0).id();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PurchaseUnitResponse(PaymentsDto payments) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PaymentsDto(List<CaptureDto> captures) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record CaptureDto(String id, String status) {}
}
