package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.pojo.Lesson;
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
    public LessonProgress getLessonProgressById(int progressId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<LessonProgress> q = builder.createQuery(LessonProgress.class);

        Root<LessonProgress> root = q.from(LessonProgress.class);
        root.fetch("lesson");
        root.fetch("enrollment").fetch("student");

        q.select(root).where(builder.equal(root.get("id"), progressId));
        return session.createQuery(q).getSingleResultOrNull();
    }

    @Override
    public LessonProgress addOrUpdateLessonProgress(LessonProgress lessonProgress) {
        Session session = factory.getObject().getCurrentSession();
        if (lessonProgress.getId() == null) {
            session.persist(lessonProgress);
            return lessonProgress;
        } else {
            return session.merge(lessonProgress);
        }
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
    public int countCompletedLessonsByStudentAndCourse(int studentId, int courseId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Long> q = builder.createQuery(Long.class);

        Root<LessonProgress> root = q.from(LessonProgress.class);

        q.select(builder.count(root));
        q.where(builder.and(
                builder.equal(root.get("enrollment").get("student").get("id"), studentId),
                builder.equal(root.get("lesson").get("chapter").get("course").get("id"), courseId),
                builder.equal(root.get("completed"), true)));

        Long result = session.createQuery(q).getSingleResult();
        return result == null ? 0 : result.intValue();
    }
}
