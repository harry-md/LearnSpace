package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Chapter;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.repositories.CourseRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Fetch;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${course.pageSize}")
    private int COURSE_PAGE_SIZE_KEY;

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

        return predicates;
    }

    @Override
    public List<Object[]> getAllCourses(Map<String, String> params) {
        Session session = factory.getObject().getCurrentSession();

        String jpql = """
            SELECT c,
                   AVG(r.rating),
                   SUM(CASE WHEN e.status IN ('ACTIVE', 'COMPLETED') THEN 1L ELSE 0L END),
                   COUNT(DISTINCT ch.id),
                   COUNT(DISTINCT l.id)
            FROM Course c
            JOIN FETCH c.category
            JOIN FETCH c.teacher
            LEFT JOIN Review r ON r.course = c
            LEFT JOIN Enrollment e ON e.course = c
            LEFT JOIN Chapter ch ON ch.course = c
            LEFT JOIN Lesson l ON l.chapter.course = c
            GROUP BY c
            ORDER BY c.id DESC
            """;

        Query<Object[]> query = session.createQuery(jpql, Object[].class);

        if (params != null && params.containsKey("page")) {
            int page = Integer.parseInt(params.getOrDefault("page", "1"));
            int start = (page - 1) * COURSE_PAGE_SIZE_KEY;
            query.setFirstResult(start);
            query.setMaxResults(COURSE_PAGE_SIZE_KEY);
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
    public Course getCourseById(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Course> q = builder.createQuery(Course.class);

        Root<Course> root = q.from(Course.class);
        root.fetch("category", JoinType.INNER);
        root.fetch("teacher", JoinType.INNER);

        Fetch<Course, Chapter> chaptersFetch = root.fetch("chapters", JoinType.LEFT);
        chaptersFetch.fetch("lessons", JoinType.LEFT);

        q.select(root).where(builder.equal(root.get("id"), courseId));
        return session.createQuery(q).getSingleResultOrNull();
    }

    @Override
    public boolean existCourse(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery("SELECT 1 FROM Course c WHERE c.id = :courseId", Integer.class)
                        .setParameter("courseId", courseId)
                        .setMaxResults(1)
                        .getSingleResultOrNull()
                != null;
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
    public void deleteCourse(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        Course c = session.get(Course.class, courseId);

        if (c != null) {
            session.remove(c);
        }
    }
}
