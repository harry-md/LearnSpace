package com.learnspace.learnspacebackend.exception;

public class CloudinaryException extends RuntimeException {
    public CloudinaryException(String error, String message) {
        super(message);
    }

    public CloudinaryException(String error, String message, Throwable cause) {
        super(message, cause);
    }
}
