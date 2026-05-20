package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.repositories.CourseRepository;

import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
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
@PropertySource("classpath:configs.properties")
public class CourseRepositoryImpl implements CourseRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private Environment env;

    private List<Predicate> filter(
            CriteriaBuilder builder, Root<Course> root, Map<String, String> params) {
        List<Predicate> predicates = new ArrayList<>();

        String kw = params.get("kw");
        if (kw != null && !kw.isBlank()) {
            predicates.add(builder.like(root.get("name"), String.format("%%%s%%", kw)));
        }
        String fromPrice = params.get("fromPrice");
        if (fromPrice != null && !fromPrice.isBlank()) {
            BigDecimal price = parsePrice(fromPrice);
            if (price != null) {
                predicates.add(builder.greaterThanOrEqualTo(root.get("price"), price));
            }
        }

        String toPrice = params.get("toPrice");
        if (toPrice != null && !toPrice.isBlank()) {
            BigDecimal price = parsePrice(toPrice);
            if (price != null) {
                predicates.add(builder.lessThanOrEqualTo(root.get("price"), price));
            }
        }
        String categoryId = params.get("categoryId");
        if (categoryId != null && !categoryId.isBlank()) {
            Integer id = parseId(categoryId);
            if (id != null) {
                predicates.add(builder.equal(root.get("category").get("id"), id));
            }
        }
        String teacherId = params.get("teacherId");
        if (teacherId != null && !teacherId.isBlank()) {
            Integer id = parseId(teacherId);
            if (id != null) {
                predicates.add(builder.equal(root.get("teacher").as(Integer.class), id));
            }
        }

        String active = params.get("active");
        if (active != null && !active.isBlank()) {
            predicates.add(builder.equal(root.get("active"), active.equals("1")));
        }

        return predicates;
    }

    @Override
    public List<Course> getAllCourses(Map<String, String> params, boolean fetchRelationship) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Course> q = builder.createQuery(Course.class);
        Root<Course> root = q.from(Course.class);

        if (fetchRelationship) {
            root.fetch("category", jakarta.persistence.criteria.JoinType.INNER);
            root.fetch("teacher", jakarta.persistence.criteria.JoinType.INNER);
        }

        q.select(root);

        if (params != null) {
            q.where(filter(builder, root, params).toArray(Predicate[]::new));
        }

        q.orderBy(builder.desc(root.get("id")));

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

    public Long countCourses(Map<String, String> params) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Long> q = builder.createQuery(Long.class);
        Root<Course> root = q.from(Course.class);

        q.select(builder.count(root));

        if (params != null) {
            q.where(filter(builder, root, params).toArray(Predicate[]::new));
        }

        return session.createQuery(q).getSingleResultOrNull();
    }

    private BigDecimal parsePrice(String price) {
        try {
            return new BigDecimal(price);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private Integer parseId(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    @Override
    public Course getCourseById(int id) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Course> q = builder.createQuery(Course.class);
        Root<Course> root = q.from(Course.class);
        root.fetch("category", JoinType.INNER);
        root.fetch("teacher", JoinType.INNER);

        q.select(root).where(builder.equal(root.get("id"), id));

        return session.createQuery(q).getSingleResultOrNull();
    }

    @Override
    public Course createOrUpdate(Course course) {
        Session session = factory.getObject().getCurrentSession();
        if (course.getId() == null) {
            session.persist(course);
            return course;
        }
        return session.merge(course);
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
