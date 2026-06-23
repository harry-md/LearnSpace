package com.learnspace.learnspacebackend.exception;

import lombok.Getter;

@Getter
public class ResourceNotFoundException extends RuntimeException {
    private final String error;

    public ResourceNotFoundException(String error, String message) {
        super(message);
        this.error = error;
    }

    public ResourceNotFoundException(String error, String message, Throwable cause) {
        super(message);
        this.error = error;
    }
}
