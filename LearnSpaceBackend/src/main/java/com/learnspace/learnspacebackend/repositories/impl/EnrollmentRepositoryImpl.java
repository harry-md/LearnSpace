package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Fetch;
import jakarta.persistence.criteria.Root;

import org.hibernate.Session;
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
    public boolean checkValidEnrollment(int studentId, int courseId) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery(
                                "SELECT 1 FROM Enrollment e WHERE e.student.id = :studentId AND"
                                        + " e.course.id = :courseId AND e.status IN ('ACTIVE',"
                                        + " 'COMPLETED')",
                                Integer.class)
                        .setParameter("studentId", studentId)
                        .setParameter("courseId", courseId)
                        .setMaxResults(1)
                        .getSingleResultOrNull()
                != null;
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
                        builder.equal(root.get("id"), id),
                        root.get("status").in("ACTIVE", "COMPLETED")));
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
        root.fetch("student");

        Fetch<Enrollment, Course> fetchCourse = root.fetch("course");
        fetchCourse.fetch("category");
        fetchCourse.fetch("teacher");

        q.select(root)
                .where(builder.and(
                        builder.equal(root.get("student").get("id"), studentId),
                        root.get("status").in("ACTIVE", "COMPLETED")));
        return session.createQuery(q).getResultList();
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
    public void deleteEnrollment(int enrollmentId) {
        Session session = factory.getObject().getCurrentSession();
        Enrollment enrollment = session.get(Enrollment.class, enrollmentId);
        if (enrollment != null) {
            session.remove(enrollment);
        }
    }

    @Override
    public Enrollment getEnrollmentByIdAllStatus(int enrollmentId) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery(
                        "FROM Enrollment e JOIN FETCH e.student JOIN FETCH e.course"
                                + " WHERE e.id = :id",
                        Enrollment.class)
                .setParameter("id", enrollmentId)
                .getSingleResultOrNull();
    }
}
