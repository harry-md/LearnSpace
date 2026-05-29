package com.learnspace.learnspacebackend.utils;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

public class NotHtmlValidator implements ConstraintValidator<NotHtml, String> {

    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        return Jsoup.isValid(value, Safelist.none());
    }
}
