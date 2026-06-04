package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.pojo.EnrollmentStatus;
import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;

import jakarta.persistence.criteria.*;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Repository
@Transactional
public class EnrollmentRepositoryImpl implements EnrollmentRepository {
    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public boolean checkValidEnrollment(int studentId, int courseId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Long> q = b.createQuery(Long.class);

        Root<Enrollment> root = q.from(Enrollment.class);

        q.select(b.count(root))
                .where(
                        b.equal(root.get("student").get("id"), studentId),
                        b.equal(root.get("course").get("id"), courseId),
                        root.get("status").in(EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED));
        Long count = session.createQuery(q).getSingleResult();
        return count == 1;
    }

    @Override
    public Enrollment getEnrollmentByStudentAndCourse(
            int studentId, int courseId, EnrollmentStatus... status) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Enrollment> q = b.createQuery(Enrollment.class);

        Root<Enrollment> root = q.from(Enrollment.class);
        root.fetch("course");
        root.fetch("student");

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(b.equal(root.get("student").get("id"), studentId));
        predicates.add(b.equal(root.get("course").get("id"), courseId));

        if (status != null && status.length > 0) {
            CriteriaBuilder.In<EnrollmentStatus> statusBuilder = b.in(root.get("status"));
            for (EnrollmentStatus s : status) {
                statusBuilder.value(s);
            }
            predicates.add(statusBuilder);
        }

        q.select(root).where(predicates.toArray(Predicate[]::new));
        return session.createQuery(q).getSingleResultOrNull();
    }

    @Override
    public Enrollment addOrUpdateEnrollment(Enrollment enrollment) {
        Session session = factory.getObject().getCurrentSession();
        if (enrollment.getId() == null) {
            session.persist(enrollment);
            return enrollment;
        }
        return session.merge(enrollment);
    }

    @Override
    public Long countEnrollments(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Long> q = b.createQuery(Long.class);
        Root<Enrollment> root = q.from(Enrollment.class);

        q.select(b.count(root))
                .where(
                        b.equal(root.get("course").get("id"), courseId),
                        root.get("status").in(EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED));
        return session.createQuery(q).getSingleResult();
    }
}
