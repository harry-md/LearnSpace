package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Review;
import com.learnspace.learnspacebackend.repositories.ReviewRepository;

import jakarta.persistence.Query;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Repository
@Transactional
public class ReviewRepositoryImpl implements ReviewRepository {
    @Value("${review.page_size}")
    private int REVIEW_PAGE_SIZE;

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Review getReviewById(int reviewId) {
        Session session = factory.getObject().getCurrentSession();
        return session.get(Review.class, reviewId);
    }

    @Override
    public Double getAverageRatingByCourseId(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery("SELECT AVG(r.rating) FROM Review r WHERE r.course.id = :courseId", Double.class)
                .setParameter("courseId", courseId)
                .getSingleResult();
    }

    @Override
    public List<Review> getReviewsByCourse(int courseId, Map<String, String> params) {
        Session session = factory.getObject().getCurrentSession();
        String hql = """
            SELECT DISTINCT r
            FROM Review r
            JOIN FETCH r.student s
            JOIN s.enrollments e
            JOIN r.course c
            WHERE
                e.status IN ('ACTIVE', 'COMPLETED')
                AND c.id = :courseId
                AND e.course.id = :courseId
            ORDER BY r.rating DESC, r.createdAt DESC
            """;

        Query query = session.createQuery(hql, Review.class).setParameter("courseId", courseId);

        if (params != null) {
            int page = Integer.parseInt(params.getOrDefault("page", "1"));
            int start = (page - 1) * REVIEW_PAGE_SIZE;
            query.setFirstResult(start);
            query.setMaxResults(REVIEW_PAGE_SIZE);
        }

        return query.getResultList();
    }

    @Override
    public Long countReviewsByCourse(int courseId, Map<String, String> params) {
        Session session = factory.getObject().getCurrentSession();
        String hql = """
            SELECT COUNT(r)
            FROM Review r
            JOIN r.student s
            JOIN s.enrollments e
            JOIN r.course c
            WHERE e.status IN ('ACTIVE', 'COMPLETED') AND c.id = :courseId AND e.course.id = :courseId
            """;

        return session.createQuery(hql, Long.class)
                .setParameter("courseId", courseId)
                .getSingleResultOrNull();
    }

    @Override
    public Review addOrUpdateReview(Review review) {
        Session session = factory.getObject().getCurrentSession();
        if (review.getId() == null) {
            session.persist(review);
            return review;
        }
        return session.merge(review);
    }
}
