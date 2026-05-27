package com.learnspace.learnspacebackend.dtos.payment;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PaypalWebhookEventDto(
        String id,
        @JsonProperty("event_type") String eventType,
        @JsonProperty("resource_type") String resourceType,
        WebhookResource resource) {

    public String orderId() {
        SupplementaryData data = resource.supplementaryData();
        return data.relatedIds().orderId();
    }

    public String captureId() {
        return resource != null ? resource.id() : null;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record WebhookResource(
            String id,
            String status,
            @JsonProperty("supplementary_data") SupplementaryData supplementaryData) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record SupplementaryData(
            @JsonProperty("related_ids") RelatedIds relatedIds) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record RelatedIds(@JsonProperty("order_id") String orderId) {}
}
