package com.learnspace.learnspacebackend.exceptions;

public class InvalidLoginException extends RuntimeException {

    public InvalidLoginException(String message) {
        super(message);
    }

    public InvalidLoginException() {
        super("Tên đăng nhập hoặc mật khẩu không đúng");
    }
}
