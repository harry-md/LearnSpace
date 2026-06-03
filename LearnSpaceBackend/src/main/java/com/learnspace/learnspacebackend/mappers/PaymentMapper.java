package com.learnspace.learnspacebackend.mappers;

import com.learnspace.learnspacebackend.dtos.payment.PaymentDto;
import com.learnspace.learnspacebackend.pojo.Payment;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "enrollmentId", source = "enrollment.id")
    PaymentDto toDto(Payment payment);

    Payment toEntity(PaymentDto paymentDto);
}
