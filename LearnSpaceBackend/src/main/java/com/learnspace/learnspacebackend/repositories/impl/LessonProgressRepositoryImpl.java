package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.LessonProgress;
import com.learnspace.learnspacebackend.repositories.LessonProgressRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class LessonProgressRepositoryImpl implements LessonProgressRepository {
    @Autowired
    private LocalSessionFactoryBean factory;

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
        root.fetch("enrollment");

        q.select(root)
                .where(
                        builder.equal(root.get("enrollment").get("id"), enrollmentId),
                        builder.equal(root.get("lesson").get("id"), lessonId));
        return session.createQuery(q).getSingleResultOrNull();
    }

    @Override
    public LessonProgress getLatestLessonProgressByEnrollment(int enrollmentId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<LessonProgress> q = builder.createQuery(LessonProgress.class);

        Root<LessonProgress> root = q.from(LessonProgress.class);
        root.fetch("enrollment");

        q.select(root)
                .where(builder.equal(root.get("enrollment").get("id"), enrollmentId))
                .orderBy(builder.desc(root.get("updatedAt")), builder.desc(root.get("id")));

        return session.createQuery(q).setMaxResults(1).getSingleResultOrNull();
    }
}
