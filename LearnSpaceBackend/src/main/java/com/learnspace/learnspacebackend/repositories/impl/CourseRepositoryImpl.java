package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.repositories.CourseRepository;

import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
@Transactional
public class CourseRepositoryImpl implements CourseRepository {
    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private Environment env;

    @Override
    public List<Course> getAllCourses(Map<String, String> params) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder buider = session.getCriteriaBuilder();
        CriteriaQuery<Course> q = buider.createQuery(Course.class);
        Root<Course> root = q.from(Course.class);

        //        root.fetch("category", JoinType.INNER);
        q.select(root);

        if (params != null) {
            List<Predicate> predicates = new ArrayList<>();
            String kw = params.get("kw");
            if (kw != null && !kw.isBlank()) {
                predicates.add(buider.like(root.get("name"), String.format("%%%s%%", kw)));
            }
            String fromPrice = params.get("fromPrice");
            if (fromPrice != null && !fromPrice.isBlank()) {
                BigDecimal price = parsePrice(fromPrice);
                if (price != null) {
                    predicates.add(buider.greaterThanOrEqualTo(root.get("price"), price));
                }
            }

            String toPrice = params.get("toPrice");
            if (toPrice != null && !toPrice.isBlank()) {
                BigDecimal price = parsePrice(toPrice);
                if (price != null) {
                    predicates.add(buider.lessThanOrEqualTo(root.get("price"), price));
                }
            }
            String categoryId = params.get("categoryId");
            if (categoryId != null && !categoryId.isBlank()) {
                predicates.add(buider.equal(root.get("category"), categoryId));
            }
            q.where(predicates.toArray(Predicate[]::new));
        }

        Query query = session.createQuery(q);
        if (params != null && params.containsKey("page")) {
            int page = Integer.parseInt(params.getOrDefault("page", "1"));
            int pageSize = env.getProperty("course.pageSize", Integer.class);
            int start = (page - 1) * pageSize;
            query.setFirstResult(start);
            query.setMaxResults(pageSize);
        }
        return query.getResultList();
    }

    private BigDecimal parsePrice(String price) {
        try {
            return new BigDecimal(price);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    @Override
    public Course getCourseById(int id) {
        Session session = factory.getObject().getCurrentSession();
        return session.get(Course.class, id);
    }

    @Override
    public Course createOrUpdate(Course course) {
        Session session = factory.getObject().getCurrentSession();
        if (course.getId() == null) {
            session.persist(course);
            return course;
        } else {
            return session.merge(course);
        }
    }

    @Override
    public void deleteCourse(int id) {
        Session session = factory.getObject().getCurrentSession();
        Course c = session.get(Course.class, id);
        if (c != null) {
            session.remove(c);
        }
    }
}
