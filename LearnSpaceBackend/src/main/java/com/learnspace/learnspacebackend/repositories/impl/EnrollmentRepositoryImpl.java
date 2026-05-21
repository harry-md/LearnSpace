package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;

import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class EnrollmentRepositoryImpl implements EnrollmentRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public boolean hasValidEnrollment(int studentId, int courseId) {
        Session session = factory.getObject().getCurrentSession();
        String hql =
                "SELECT COUNT(e) FROM Enrollment e WHERE e.student.id = :studentId AND e.course.id"
                        + " = :courseId AND e.status IN ('ACTIVE', 'COMPLETED')";

        Query<Long> query = session.createQuery(hql, Long.class);
        query.setParameter("studentId", studentId);
        query.setParameter("courseId", courseId);
        return query.getSingleResult() > 0;
    }
}
