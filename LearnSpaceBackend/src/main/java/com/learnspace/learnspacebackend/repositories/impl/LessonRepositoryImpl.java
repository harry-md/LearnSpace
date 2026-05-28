package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Chapter;
import com.learnspace.learnspacebackend.pojo.Lesson;
import com.learnspace.learnspacebackend.repositories.LessonRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Fetch;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class LessonRepositoryImpl implements LessonRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Lesson> getLessons(int chapterId) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery(
                        "FROM Lesson l WHERE l.chapter.id = :chapterId ORDER BY l.order",
                        Lesson.class)
                .setParameter("chapterId", chapterId)
                .getResultList();
    }

    @Override
    public Lesson addOrUpdateLesson(Lesson lesson) {
        Session session = factory.getObject().getCurrentSession();
        if (lesson.getId() == null) {
            session.persist(lesson);
            return lesson;
        }
        return session.merge(lesson);
    }

    @Override
    public Lesson getLessonById(int lessonId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Lesson> q = builder.createQuery(Lesson.class);
        Root<Lesson> root = q.from(Lesson.class);

        root.join("progresses", JoinType.LEFT);

        Fetch<Lesson, Chapter> chapterFetch = root.fetch("chapter", JoinType.INNER);
        chapterFetch.fetch("course", JoinType.INNER);

        q.select(root).where(builder.equal(root.get("id"), lessonId));

        return session.createQuery(q).getSingleResultOrNull();
    }

    @Override
    public void deleteLesson(int lessonId) {
        Session session = factory.getObject().getCurrentSession();
        Lesson lesson = session.get(Lesson.class, lessonId);
        if (lesson != null) {
            session.remove(lesson);
        }
    }

    @Override
    public List<String> getVideoUrlsByChapterId(int chapterId) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery(
                        "SELECT l.video FROM Lesson l WHERE l.chapter.id = :chapterId",
                        String.class)
                .setParameter("chapterId", chapterId)
                .getResultList();
    }

    @Override
    public List<String> getVideoUrlsByCourseId(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery(
                        "SELECT l.video FROM Lesson l JOIN l.chapter c WHERE c.course.id ="
                                + " :courseId",
                        String.class)
                .setParameter("courseId", courseId)
                .getResultList();
    }

    @Override
    public Integer getMaxOrder(int chapterId) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery(
                        "SELECT COALESCE(MAX(l.order), 0) FROM Lesson l WHERE l.chapter.id ="
                                + " :chapterId",
                        Integer.class)
                .setParameter("chapterId", chapterId)
                .getSingleResult();
    }

    @Override
    public int countLessonsByCourseId(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Long> q = builder.createQuery(Long.class);

        Root<Lesson> root = q.from(Lesson.class);
        q.select(builder.count(root))
                .where(builder.equal(root.get("chapter").get("course").get("id"), courseId));

        Long result = session.createQuery(q).getSingleResult();
        return result == null ? 0 : result.intValue();
    }
}
