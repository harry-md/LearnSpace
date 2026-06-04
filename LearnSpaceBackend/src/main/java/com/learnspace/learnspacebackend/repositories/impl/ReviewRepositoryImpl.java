package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.*;
import com.learnspace.learnspacebackend.repositories.ReviewRepository;

import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Fetch;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;

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
    public Double getAverageRatingByCourse(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Double> q = b.createQuery(Double.class);
        Root<Review> root = q.from(Review.class);

        q.select(b.avg(root.get("rating"))).where(b.equal(root.get("course").get("id"), courseId));
        return session.createQuery(q).getSingleResult();
    }

    @Override
    public List<Review> getReviewsByCourse(int courseId, Map<String, String> params) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Review> q = b.createQuery(Review.class);
        Root<Review> root = q.from(Review.class);

        Fetch<Review, User> studentJoinFetch = root.fetch("student");
        Join<Review, User> userJoin = (Join<Review, User>) studentJoinFetch;
        Join<User, Enrollment> enrollmentJoin = userJoin.join("enrollments");

        q.select(root)
                .distinct(true)
                .where(
                        b.equal(root.get("course").get("id"), courseId),
                        b.equal(enrollmentJoin.get("course").get("id"), courseId),
                        enrollmentJoin
                                .get("status")
                                .in(EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED));

        Query query = session.createQuery(q);
        if (params != null) {
            int page = Integer.parseInt(params.getOrDefault("page", "1"));
            int start = (page - 1) * REVIEW_PAGE_SIZE;
            query.setFirstResult(start);
            query.setMaxResults(REVIEW_PAGE_SIZE);
        }
        return query.getResultList();
    }

    @Override
    public Long countReviewsByCourse(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Long> q = b.createQuery(Long.class);
        Root<Review> root = q.from(Review.class);

        Join<Review, User> userJoin = root.join("student");
        Join<User, Enrollment> enrollmentJoin = userJoin.join("enrollments");

        q.select(b.countDistinct(root))
                .where(
                        b.equal(root.get("course").get("id"), courseId),
                        b.equal(enrollmentJoin.get("course").get("id"), courseId),
                        enrollmentJoin
                                .get("status")
                                .in(EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED));
        return session.createQuery(q).getSingleResult();
    }
}
