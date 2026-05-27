package com.learnspace.learnspacebackend.dtos.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class CustomUserDetails extends User {

    private final Integer id;

    public CustomUserDetails(
            String username,
            String password,
            Collection<? extends GrantedAuthority> authorities,
            Integer id) {
        super(username, password, authorities);
        this.id = id;
    }

    public Integer getId() {
        return id;
    }
}
