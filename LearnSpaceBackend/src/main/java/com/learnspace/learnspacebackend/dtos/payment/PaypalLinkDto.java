package com.learnspace.learnspacebackend.dtos.payment;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PaypalLinkDto(String href, String rel, String method) {}
