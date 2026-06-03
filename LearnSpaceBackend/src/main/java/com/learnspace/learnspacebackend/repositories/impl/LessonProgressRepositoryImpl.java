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
        return session.createQuery(q).getSingleResult();
    }

    @Override
    public LessonProgress getLessonProgressByStudentAndCourse(int studentId, int courseId) {
        Session session = factory.getObject().getCurrentSession();
        String hql = """
            SELECT lp
            FROM LessonProgress lp
            JOIN FETCH Lesson lp.l
            JOIN l.chapter ch
            WHERE
                s.student.id = :studentId
                AND ch.course.id = :courseId
            ORDER BY lp.updatedAt DESC, lp.id DESC
            """;

        return session.createQuery(hql, LessonProgress.class).setMaxResults(1).getSingleResult();
    }
}
