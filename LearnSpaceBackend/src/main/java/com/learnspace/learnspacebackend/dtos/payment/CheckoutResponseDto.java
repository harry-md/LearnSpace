package com.learnspace.learnspacebackend.dtos.payment;

import java.math.BigDecimal;
import java.util.List;

public record CheckoutResponseDto(
        String paypalOrderId,
        String approvalUrl,
        List<PaymentDto> payments,
        BigDecimal totalVnd,
        BigDecimal totalUsd) {}
