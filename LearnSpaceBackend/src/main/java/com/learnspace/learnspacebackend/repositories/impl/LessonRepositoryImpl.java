package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Chapter;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.Lesson;
import com.learnspace.learnspacebackend.repositories.LessonRepository;

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

import java.util.List;

@Repository
@Transactional
public class LessonRepositoryImpl implements LessonRepository {
    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Lesson addOrUpdateLesson(Lesson lesson) {
        Session session = factory.getObject().getCurrentSession();
        if (lesson.getId() == null) {
            session.persist(lesson);
            return lesson;
        }
        session.merge(lesson);
        return lesson;
    }

    @Override
    public Lesson getLessonById(int lessonId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Lesson> q = b.createQuery(Lesson.class);
        Root<Lesson> root = q.from(Lesson.class);

        Fetch<Lesson, Chapter> chapterFetch = root.fetch("chapter");
        Fetch<Chapter, Course> courseFetch = chapterFetch.fetch("course");
        courseFetch.fetch("teacher");

        q.select(root).where(b.equal(root.get("id"), lessonId));
        return session.createQuery(q).getSingleResult();
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
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<String> q = b.createQuery(String.class);
        Root<Lesson> root = q.from(Lesson.class);

        q.select(root.get("video")).where(b.equal(root.get("chapter").get("id"), chapterId));
        return session.createQuery(q).getResultList();
    }

    @Override
    public List<String> getVideoUrlsByCourseId(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<String> q = b.createQuery(String.class);
        Root<Lesson> root = q.from(Lesson.class);
        Join<Lesson, Chapter> chapterJoin = root.join("chapter");

        q.select(root.get("video")).where(b.equal(chapterJoin.get("course").get("id"), courseId));
        return session.createQuery(q).getResultList();
    }
}
