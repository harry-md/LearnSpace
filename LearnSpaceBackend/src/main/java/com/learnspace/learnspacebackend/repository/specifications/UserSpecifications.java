package com.learnspace.learnspacebackend.repository.specifications;

import com.learnspace.learnspacebackend.entity.User;
import com.learnspace.learnspacebackend.entity.UserRole;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class UserSpecifications {
    public static Specification<User> filterUsers(Map<String, String> params) {
        return (root, query, builder) -> {
            if (params == null || params.isEmpty()) {
                return builder.conjunction();
            }
            List<Predicate> predicates = new ArrayList<>();

            String kw = params.get("kw");
            if (kw != null && !kw.isBlank()) {
                predicates.add(builder.like(
                        builder.lower(root.get("username")), "%" + kw.toLowerCase() + "%"));
            }

            String role = params.get("role");
            if (role != null && !role.isBlank()) {
                predicates.add(builder.equal(root.get("role"), UserRole.valueOf(role)));
            }

            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
