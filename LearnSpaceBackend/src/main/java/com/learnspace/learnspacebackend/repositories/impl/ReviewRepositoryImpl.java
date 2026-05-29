package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.repositories.ReviewRepository;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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
}
