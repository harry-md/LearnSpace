package com.learnspace.learnspacebackend.dtos.payment;

import java.util.List;

public record CaptureResponseDto(
        String paypalOrderId,
        String captureId,
        String status,
        List<PaymentDto> payments) {}
