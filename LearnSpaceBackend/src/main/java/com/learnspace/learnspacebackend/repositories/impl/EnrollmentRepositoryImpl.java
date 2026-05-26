package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class EnrollmentRepositoryImpl implements EnrollmentRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public boolean hasValidEnrollment(int studentId, int courseId) {
        Session session = factory.getObject().getCurrentSession();
        String hql = "SELECT COUNT(e) FROM Enrollment e WHERE e.student.id = :studentId AND e.course.id"
                + " = :courseId AND e.status IN ('ACTIVE', 'COMPLETED')";

        Query<Long> query = session.createQuery(hql, Long.class);
        query.setParameter("studentId", studentId);
        query.setParameter("courseId", courseId);
        return query.getSingleResult() > 0;
    }

    @Override
    public Enrollment getEnrollmentById(int id) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Enrollment> q = builder.createQuery(Enrollment.class);

        Root<Enrollment> root = q.from(Enrollment.class);
        root.fetch("course");
        root.fetch("student");

        q.select(root)
                .where(builder.and(
                        builder.equal(root.get("id"), id), root.get("status").in("ACTIVE", "COMPLETED")));
        return session.createQuery(q).getSingleResultOrNull();
    }

    @Override
    public Enrollment getEnrollmentByStudentAndCourse(int studentId, int courseId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Enrollment> q = builder.createQuery(Enrollment.class);

        Root<Enrollment> root = q.from(Enrollment.class);
        root.fetch("course");
        root.fetch("student");

        q.select(root)
                .where(builder.and(
                        builder.equal(root.get("student").get("id"), studentId),
                        builder.equal(root.get("course").get("id"), courseId),
                        root.get("status").in("ACTIVE", "COMPLETED")));
        return session.createQuery(q).getSingleResultOrNull();
    }

    @Override
    public List<Enrollment> getEnrollmentsByStudentId(int studentId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Enrollment> q = builder.createQuery(Enrollment.class);
        Root<Enrollment> root = q.from(Enrollment.class);
        root.fetch("course");
        root.fetch("student");
        q.select(root)
                .where(builder.and(
                        builder.equal(root.get("student").get("id"), studentId),
                        root.get("status").in("ACTIVE", "COMPLETED")));
        return session.createQuery(q).getResultList();
    }
}
