package com.learnspace.learnspacebackend.utils;

import com.learnspace.learnspacebackend.pojo.UserRole;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {
    @Value("${jwt.secret}")
    private String SECRET;

    private final long EXPIRATION_MS = 86400000;

    public String generateToken(Integer userId, String username, UserRole role) throws Exception {
        JWSSigner signer = new MACSigner(SECRET);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(username)
                .claim("userId", userId)
                .claim("role", role.name())
                .expirationTime(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .issueTime(new Date())
                .build();

        SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);

        signedJWT.sign(signer);

        return signedJWT.serialize();
    }

    private JWTClaimsSet validateToken(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SECRET);

        if (signedJWT.verify(verifier)) {
            Date expiration = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expiration.after(new Date())) {
                return signedJWT.getJWTClaimsSet();
            }
        }
        return null;
    }

    public String validateTokenAndGetUsername(String token) throws Exception {
        JWTClaimsSet claims = validateToken(token);
        if (claims != null) {
            return claims.getSubject();
        }
        return null;
    }

    public Integer validateTokenAndGetUserId(String token) throws Exception {
        JWTClaimsSet claims = validateToken(token);
        if (claims != null && claims.getClaim("userId") != null) {
            return Integer.parseInt(claims.getClaim("userId").toString());
        }
        return null;
    }

    public JWTClaimsSet validateTokenAndGetClaims(String token) throws Exception {
        return validateToken(token);
    }
}
