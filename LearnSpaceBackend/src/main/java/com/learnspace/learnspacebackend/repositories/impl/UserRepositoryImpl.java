package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.pojo.UserRole;
import com.learnspace.learnspacebackend.repositories.UserRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
@Transactional
public class UserRepositoryImpl implements UserRepository {
    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public User getUserByUsername(String username) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery("FROM User WHERE username = :username", User.class)
                .setParameter("username", username)
                .getSingleResult();
    }

    @Override
    public boolean checkUsernameExist(String username) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Long> q = b.createQuery(Long.class);
        Root<User> root = q.from(User.class);
        q.select(b.count(root)).where(b.equal(root.get("username"), username));
        Long count = session.createQuery(q).setMaxResults(1).getSingleResult();
        return count == 1;
    }

    @Override
    public User register(User u) {
        Session session = factory.getObject().getCurrentSession();
        session.persist(u);
        return u;
    }

    @Override
    public User getUserById(Integer id) {
        Session session = factory.getObject().getCurrentSession();
        return session.get(User.class, id);
    }

    @Override
    public void update(User user) {
        Session session = factory.getObject().getCurrentSession();
        session.merge(user);
    }

    @Override
    public List<User> getContactsEnrolled(int userId, UserRole role) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<User> q = b.createQuery(User.class);

        Root<Enrollment> root = q.from(Enrollment.class);
        Join<Enrollment, Course> courseJoin = root.join("course");

        if (role == UserRole.TEACHER) {
            Join<Enrollment, User> studentJoin = root.join("student");
            q.select(studentJoin).where(b.equal(courseJoin.get("teacher").get("id"), userId));
            return session.createQuery(q).getResultList();
        }

        if (role == UserRole.STUDENT) {
            Join<Course, User> teacherJoin = courseJoin.join("teacher");
            q.select(teacherJoin).where(b.equal(root.get("student").get("id"), userId));
            return session.createQuery(q).getResultList();
        }
        return null;
    }

    @Override
    public int countAllUser() {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Long> q = b.createQuery(Long.class);
        Root<User> root = q.from(User.class);
        q.select(b.count(root));

        return session.createQuery(q).getSingleResult().intValue();
    }
}
