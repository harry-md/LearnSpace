package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Chapter;
import com.learnspace.learnspacebackend.repositories.ChapterRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
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
public class ChapterRepositoryImpl implements ChapterRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Chapter getChapterById(int chapterId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Chapter> q = builder.createQuery(Chapter.class);
        Root<Chapter> root = q.from(Chapter.class);
        root.fetch("course");
        root.fetch("lessons", JoinType.LEFT);

        q.select(root).where(builder.equal(root.get("id"), chapterId));
        return session.createQuery(q).getSingleResult();
    }

    @Override
    public boolean existChapter(int chapterId) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery("SELECT 1 FROM Chapter c WHERE c.id = :chapterId", Integer.class)
                        .setParameter("chapterId", chapterId)
                        .setMaxResults(1)
                        .getSingleResult()
                != null;
    }

    @Override
    public Chapter createOrUpdate(Chapter chapter) {
        Session session = factory.getObject().getCurrentSession();
        if (chapter.getId() == null) {
            session.persist(chapter);
            return chapter;
        }
        return session.merge(chapter);
    }

    @Override
    public void deleteChapter(int chapterId) {
        Session session = factory.getObject().getCurrentSession();
        Chapter chapter = session.get(Chapter.class, chapterId);
        if (chapter != null) {
            session.remove(chapter);
        }
    }

    @Override
    public List<Chapter> getChaptersByCourse(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Chapter> q = builder.createQuery(Chapter.class);

        Root<Chapter> root = q.from(Chapter.class);

        q.select(root)
                .where(builder.equal(root.get("course").get("id"), courseId))
                .orderBy(builder.asc(root.get("order")));

        return session.createQuery(q).getResultList();
    }

    @Override
    public Integer getMaxOrder(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery(
                        "SELECT COALESCE(MAX(c.order), 0) FROM Chapter c WHERE c.course.id ="
                                + " :courseId",
                        Integer.class)
                .setParameter("courseId", courseId)
                .getSingleResult();
    }
}
