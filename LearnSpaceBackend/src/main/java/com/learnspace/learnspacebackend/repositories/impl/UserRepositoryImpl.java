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
                .getSingleResultOrNull();
    }

    @Override
    public boolean checkUsernameExist(String username) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery("SELECT 1 FROM User u WHERE u.username = :username", Integer.class)
                        .setParameter("username", username)
                        .setMaxResults(1)
                        .getSingleResultOrNull()
                != null;
    }

    @Override
    public User register(User u) {
        Session session = factory.getObject().getCurrentSession();
        session.persist(u);
        return u;
    }

    @Override
    public List<User> getAllUsers(Map<String, String> params) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<User> q = builder.createQuery(User.class);
        Root<User> root = q.from(User.class);
        q.select(root);

        if (params != null && !params.isEmpty()) {
            List<Predicate> predicates = new ArrayList<>();

            String kw = params.get("kw");
            if (kw != null && !kw.trim().isEmpty()) {
                Predicate p1 = builder.like(root.get("username"), "%" + kw + "%");
                Predicate p2 = builder.like(root.get("email"), "%" + kw + "%");
                Predicate p3 = builder.like(root.get("firstName"), "%" + kw + "%");
                Predicate p4 = builder.like(root.get("lastName"), "%" + kw + "%");
                predicates.add(builder.or(p1, p2, p3, p4));
            }

            String role = params.get("role");
            if (role != null && !role.trim().isEmpty()) {
                try {
                    predicates.add(builder.equal(root.get("role"), UserRole.valueOf(role)));
                } catch (IllegalArgumentException ex) {
                    ex.printStackTrace();
                }
            }

            String active = params.get("active");
            if (active != null && !active.trim().isEmpty()) {
                predicates.add(builder.equal(root.get("active"), active.equals("1")));
            }

            q.where(predicates.toArray(Predicate[]::new));
        }

        return session.createQuery(q).getResultList();
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
    public List<User> getContactsEnrolled(int userId, String role) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<User> q = builder.createQuery(User.class);

        Root<Enrollment> root = q.from(Enrollment.class);

        Join<Enrollment, Course> courseJoin = root.join("course");

        if (role.equals("student")) {
            Join<Course, User> teacherJoin = courseJoin.join("teacher");
            q.select(teacherJoin)
                    .distinct(true)
                    .where(builder.equal(root.get("student").get("id"), userId));
            return session.createQuery(q).getResultList();
        }

        Join<Course, User> userJoin = courseJoin.join(role);

        q.select(userJoin).distinct(true).where(builder.equal(root.get(role).get("id"), userId));

        return session.createQuery(q).getResultList();
    }
}
