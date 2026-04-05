package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Lesson;
import com.learnspace.learnspacebackend.repositories.LessonRepository;
import jakarta.persistence.Query;
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
        Query q = session.createQuery(
                "SELECT l FROM Lesson l JOIN l.chapter c WHERE c.id = :chapterId", Lesson.class);
        q.setParameter("chapterId", chapterId);
        return q.getResultList();
    }

}
