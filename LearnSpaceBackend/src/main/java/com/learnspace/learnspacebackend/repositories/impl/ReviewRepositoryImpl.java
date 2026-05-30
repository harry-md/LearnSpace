package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.pojo.EnrollmentStatus;
import com.learnspace.learnspacebackend.pojo.Review;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.repositories.ReviewRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class ReviewRepositoryImpl implements ReviewRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Double getAverageRatingByCourseId(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery(
                        "SELECT AVG(r.rating) FROM Review r WHERE r.course.id = :courseId",
                        Double.class)
                .setParameter("courseId", courseId)
                .getSingleResultOrNull();
    }

    @Override
    public List<Review> getReviewsByCourse(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Review> q = builder.createQuery(Review.class);

        Root<Review> root = q.from(Review.class);
        root.fetch("student");

        Join<Review, User> userJoin = root.join("student");
        Join<User, Enrollment> enrollmentJoin = userJoin.join("enrollments");
        Join<Review, Course> courseJoin = root.join("course");

        q.select(root)
                .distinct(true)
                .where(builder.and(
                        builder.or(
                                builder.equal(
                                        enrollmentJoin.get("status"), EnrollmentStatus.COMPLETED),
                                builder.equal(
                                        enrollmentJoin.get("status"), EnrollmentStatus.ACTIVE)),
                        builder.equal(courseJoin.get("id"), courseId),
                        builder.equal(enrollmentJoin.get("course").get("id"), courseId)));

        q.orderBy(builder.desc(root.get("rating")), builder.desc(root.get("createdAt")));
        return session.createQuery(q).getResultList();
    }
}
