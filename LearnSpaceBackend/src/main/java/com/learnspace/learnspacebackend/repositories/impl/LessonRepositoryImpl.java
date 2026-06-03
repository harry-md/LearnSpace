package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Chapter;
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
import java.util.Map;
import java.util.stream.Collectors;

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
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Lesson> q = b.createQuery(Lesson.class);
        Root<Lesson> root = q.from(Lesson.class);

        Fetch<Lesson, Chapter> chapterFetch = root.fetch("chapter");
        chapterFetch.fetch("course");

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
    public Map<Integer, Long> countLessons(List<Integer> courseIds) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);
        Root<Lesson> root = q.from(Lesson.class);

        Join<Lesson, Chapter> chapterJoin = root.join("chapter");
        q.multiselect(chapterJoin.get("course").get("id"), b.count(root))
                .where(chapterJoin.get("course").get("id").in(courseIds))
                .groupBy(chapterJoin.get("course"));

        List<Object[]> results = session.createQuery(q).getResultList();

        return results.stream()
                .collect(Collectors.toMap(row -> (Integer) row[0], row -> (Long) row[1]));
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

    @Override
    public Integer getMaxOrder(int chapterId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Integer> q = b.createQuery(Integer.class);
        Root<Lesson> root = q.from(Lesson.class);

        q.select(b.coalesce(b.max(root.get("order")), 0))
                .where(b.equal(root.get("chapter").get("id"), chapterId));
        return session.createQuery(q).getSingleResult();
    }
}
