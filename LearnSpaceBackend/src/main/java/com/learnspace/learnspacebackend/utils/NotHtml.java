package com.learnspace.learnspacebackend.utils;

import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface NotHtml {

    String message() default "Nội dung không được chứa HTML tag";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
