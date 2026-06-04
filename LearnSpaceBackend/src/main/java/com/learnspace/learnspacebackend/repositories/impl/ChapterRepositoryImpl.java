package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Chapter;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.repositories.ChapterRepository;

import jakarta.persistence.criteria.*;

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
public class ChapterRepositoryImpl implements ChapterRepository {
    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Chapter getChapterById(int chapterId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Chapter> q = b.createQuery(Chapter.class);
        Root<Chapter> root = q.from(Chapter.class);
        root.fetch("course");
        root.fetch("lessons", JoinType.LEFT);

        q.select(root).where(b.equal(root.get("id"), chapterId));
        return session.createQuery(q).getSingleResult();
    }

    @Override
    public Chapter createOrUpdate(Chapter chapter) {
        Session session = factory.getObject().getCurrentSession();
        if (chapter.getId() == null) {
            session.persist(chapter);
            return chapter;
        }
        Chapter merged = session.merge(chapter);
        return getChapterById(merged.getId());
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
    public Map<Integer, Long> countChapters(List<Integer> ids) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);
        Root<Chapter> root = q.from(Chapter.class);

        Join<Chapter, Course> courseJoin = root.join("course");
        q.multiselect(courseJoin.get("id"), b.count(root))
                .where(courseJoin.get("id").in(ids))
                .groupBy(courseJoin);

        List<Object[]> results = session.createQuery(q).getResultList();
        return results.stream()
                .collect(Collectors.toMap(row -> (Integer) row[0], row -> (Long) row[1]));
    }
}
