package com.learnspace.learnspacebackend.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String error, String message) {
        super(message);
    }

    public ResourceNotFoundException(String error, String message, Throwable cause) {
        super(message);
    }
}
