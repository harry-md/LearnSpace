package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.repositories.UserRepository;

import jakarta.persistence.Query;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class UserRepositoryImpl implements UserRepository {
    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public User getUserByUsername(String username) {
        Session session = factory.getObject().getCurrentSession();
        Query query = session.createQuery("FROM User WHERE username=:username", User.class);
        query.setParameter("username", username);
        return (User) query.getSingleResult();
    }

    @Override
    public User register(User u) {
        Session session = factory.getObject().getCurrentSession();
        session.persist(u);
        return u;
    }
}
