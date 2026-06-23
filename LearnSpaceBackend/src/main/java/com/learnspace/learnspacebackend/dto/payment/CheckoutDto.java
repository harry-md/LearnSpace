package com.learnspace.learnspacebackend.dto.payment;

import java.math.BigDecimal;
import java.util.List;

public record CheckoutDto(
        String stripeSessionId, String checkoutUrl, List<PaymentDto> payments, BigDecimal amount) {}
