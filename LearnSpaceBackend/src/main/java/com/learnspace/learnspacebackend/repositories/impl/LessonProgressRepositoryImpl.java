package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Chapter;
import com.learnspace.learnspacebackend.pojo.Lesson;
import com.learnspace.learnspacebackend.pojo.LessonProgress;
import com.learnspace.learnspacebackend.repositories.LessonProgressRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Fetch;
import jakarta.persistence.criteria.Join;
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
    public LessonProgress getLessonProgressByStudentAndLesson(int studentId, int lessonId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<LessonProgress> q = builder.createQuery(LessonProgress.class);

        Root<LessonProgress> root = q.from(LessonProgress.class);
        root.fetch("lesson");
        root.fetch("student");

        q.select(root)
                .where(
                        builder.equal(root.get("student").get("id"), studentId),
                        builder.equal(root.get("lesson").get("id"), lessonId));
        return session.createQuery(q).getSingleResultOrNull();
    }

    @Override
    public LessonProgress getLessonProgressByStudentAndCourse(int studentId, int courseId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<LessonProgress> q = builder.createQuery(LessonProgress.class);

        Root<LessonProgress> root = q.from(LessonProgress.class);

        Fetch<LessonProgress, Lesson> lessonFetch = root.fetch("lesson");
        Join<LessonProgress, Lesson> lessonJoin = (Join<LessonProgress, Lesson>) lessonFetch;
        Join<Lesson, Chapter> chapterJoin = lessonJoin.join("chapter");

        q.select(root)
                .where(builder.and(
                        builder.equal(root.get("student").get("id"), studentId),
                        builder.equal(chapterJoin.get("course").get("id"), courseId)));

        q.orderBy(builder.desc(root.get("updatedAt")), builder.desc(root.get("id")));

        return session.createQuery(q).setMaxResults(1).getSingleResultOrNull();
    }
}
