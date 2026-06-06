package com.learnspace.learnspacebackend.mapper;

import com.learnspace.learnspacebackend.dto.payment.PaymentDto;
import com.learnspace.learnspacebackend.entity.Payment;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "enrollmentId", source = "enrollment.id")
    PaymentDto toDto(Payment payment);

    Payment toEntity(PaymentDto paymentDto);
}
