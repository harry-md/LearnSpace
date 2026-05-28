package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.pojo.LessonProgress;
import com.learnspace.learnspacebackend.repositories.LessonProgressRepository;

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
public class LessonProgressRepositoryImpl implements LessonProgressRepository {
    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public LessonProgress getLessonProgressByLessonAndStudent(int lessonId, int studentId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<LessonProgress> q = builder.createQuery(LessonProgress.class);

        Root<LessonProgress> root = q.from(LessonProgress.class);
        root.fetch("lesson");

        Fetch<LessonProgress, Enrollment> enrollmentFetch = root.fetch("enrollment");
        enrollmentFetch.fetch("student");

        q.select(root)
                .where(builder.and(
                        builder.equal(root.get("lesson").get("id"), lessonId),
                        builder.equal(root.get("enrollment").get("student").get("id"), studentId)));
        return session.createQuery(q).getSingleResultOrNull();
    }

    @Override
    public LessonProgress addOrUpdateLessonProgress(LessonProgress lessonProgress) {
        Session session = factory.getObject().getCurrentSession();
        if (lessonProgress.getId() == null) {
            session.persist(lessonProgress);
            return lessonProgress;
        }
        return session.merge(lessonProgress);
    }

    @Override
    public LessonProgress getLessonProgressByEnrollmentAndLesson(int enrollmentId, int lessonId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<LessonProgress> q = builder.createQuery(LessonProgress.class);

        Root<LessonProgress> root = q.from(LessonProgress.class);
        root.fetch("lesson");
        root.fetch("enrollment").fetch("student");

        q.select(root)
                .where(
                        builder.equal(root.get("enrollment").get("id"), enrollmentId),
                        builder.equal(root.get("lesson").get("id"), lessonId));
        return session.createQuery(q).getSingleResultOrNull();
    }

    @Override
    public int countCompletedLessonsByEnrollment(int enrollmentId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Long> q = builder.createQuery(Long.class);

        Root<LessonProgress> root = q.from(LessonProgress.class);

        q.select(builder.count(root));
        q.where(builder.and(
                builder.equal(root.get("enrollment").get("id"), enrollmentId),
                builder.equal(root.get("completed"), true)));
        Long result = session.createQuery(q).getSingleResult();

        return result == null ? 0 : result.intValue();
    }

    @Override
    public List<LessonProgress> getLessonProgressByEnrollment(int enrollmentId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<LessonProgress> q = builder.createQuery(LessonProgress.class);

        Root<LessonProgress> root = q.from(LessonProgress.class);
        root.fetch("lesson");

        q.select(root).where(builder.equal(root.get("enrollment").get("id"), enrollmentId));
        return session.createQuery(q).getResultList();
    }
}
