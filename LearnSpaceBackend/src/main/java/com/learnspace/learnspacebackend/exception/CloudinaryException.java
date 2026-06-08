package com.learnspace.learnspacebackend.exception;

import lombok.Getter;

@Getter
public class CloudinaryException extends RuntimeException {
    private final String error;

    public CloudinaryException(String error, String message) {
        super(message);
        this.error = error;
    }

    public CloudinaryException(String error, String message, Throwable cause) {
        super(message, cause);
        this.error = error;
    }
}
