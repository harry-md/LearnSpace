package com.learnspace.learnspacebackend.dtos.payment;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.learnspace.learnspacebackend.pojo.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentDto(
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Integer id,

        Integer enrollmentId,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String paypalOrderId,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String approvalUrl,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        PaymentStatus status,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        BigDecimal usdAmount,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        BigDecimal vndAmount,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String currency,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String originalCurrency,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt,

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime updatedAt) {}
