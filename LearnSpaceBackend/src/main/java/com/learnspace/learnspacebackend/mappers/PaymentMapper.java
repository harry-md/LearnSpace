package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.payment.PaymentDto;
import com.learnspace.learnspacebackend.pojo.Payment;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    PaymentDto toDto(Payment payment);

    Payment toEntity(PaymentDto paymentDto);
}
