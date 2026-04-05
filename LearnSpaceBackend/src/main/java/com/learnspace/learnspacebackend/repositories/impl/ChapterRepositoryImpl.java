package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Chapter;
import com.learnspace.learnspacebackend.repositories.ChapterRepositiry;

import jakarta.persistence.Query;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class ChapterRepositoryImpl implements ChapterRepositiry {
    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Chapter> getChaptersByCourse(int courseId) {
        Session s = factory.getObject().getCurrentSession();
        Query q = s.createQuery(
                "SELECT c FROM Chapter c JOIN c.course course WHERE course.id = :courseId",
                Chapter.class);
        q.setParameter("courseId", courseId);
        return q.getResultList();
    }

    @Override
    public Chapter getChapterById(int ChapterId) {
        Session s = factory.getObject().getCurrentSession();
        return s.get(Chapter.class, ChapterId);
    }
}
