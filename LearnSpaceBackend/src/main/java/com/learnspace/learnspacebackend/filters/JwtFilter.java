package com.learnspace.learnspacebackend.filters;

import com.learnspace.learnspacebackend.utils.JwtUtils;
import com.nimbusds.jwt.JWTClaimsSet;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.util.List;

public class JwtFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String header = httpRequest.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                JWTClaimsSet claims = JwtUtils.validateTokenAndGetUsername(token);
                if (claims != null) {
                    String username = claims.getSubject();

                    httpRequest.setAttribute("username", username);

                    String role = claims.getClaim("role").toString();

                    List<SimpleGrantedAuthority> authorities =
                            List.of(new SimpleGrantedAuthority("ROLE_" + role));

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    chain.doFilter(request, response);
                    return;
                }
            } catch (Exception ex) {
                System.err.println(ex.getMessage());
            }
        }

        chain.doFilter(request, response);
    }
}
