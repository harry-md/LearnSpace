package com.learnspace.learnspacebackend.dtos.payment;

import java.math.BigDecimal;
import java.util.List;

public record CheckoutDto(
        String stripeSessionId, String checkoutUrl, List<PaymentDto> payments, BigDecimal amount) {}
