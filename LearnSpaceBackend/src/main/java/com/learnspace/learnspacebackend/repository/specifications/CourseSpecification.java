package com.learnspace.learnspacebackend.repository.specifications;

import com.learnspace.learnspacebackend.entity.Course;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CourseSpecification {
    public static Specification<Course> filterCourses(Map<String, String> params) {
        return (root, query, builder) -> {
            if (params == null || params.isEmpty()) {
                return builder.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();

            String kw = params.get("kw");
            if (kw != null && !kw.isBlank()) {
                predicates.add(builder.like(builder.lower(root.get("name")), "%" + kw + "%"));
            }

            String fromPrice = params.get("fromPrice");
            if (fromPrice != null && !fromPrice.isBlank()) {
                int price = Integer.parseInt(fromPrice);
                predicates.add(builder.greaterThanOrEqualTo(root.get("price"), price));
            }

            String toPrice = params.get("toPrice");
            if (toPrice != null && !toPrice.isBlank()) {
                int price = Integer.parseInt(toPrice);
                predicates.add(builder.greaterThanOrEqualTo(root.get("price"), price));
            }

            String teacherName = params.get("teacherName");
            if (teacherName != null && !teacherName.isBlank()) {
                predicates.add(builder.like(
                        root.get("teacher").get("fullName"), String.format("%%%s%%", teacherName)));
            }

            String categoryId = params.get("categoryId");
            if (categoryId != null && !categoryId.isBlank()) {
                Integer id = Integer.parseInt(categoryId);
                predicates.add(builder.equal(root.get("category").get("id"), id));
            }

            String teacherId = params.get("teacherId");
            if (teacherId != null && !teacherId.isBlank()) {
                Integer id = Integer.parseInt(teacherId);
                predicates.add(builder.equal(root.get("teacher").get("id"), id));
            }

            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
