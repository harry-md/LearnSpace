package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Category;
import com.learnspace.learnspacebackend.repositories.CategoryRepository;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class CategoryRepositoryImpl implements CategoryRepository {
    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Category> getCates() {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery("FROM Category", Category.class).getResultList();
    }

    @Override
    public Category getCateById(int id) {
        Session session = factory.getObject().getCurrentSession();
        return session.get(Category.class, id);
    }

    @Override
    public Category addOrUpdateCate(Category category) {
        Session session = factory.getObject().getCurrentSession();
        if (category.getId() == null) {
            session.persist(category);
            return category;
        }
        return session.merge(category);
    }

    @Override
    public void deleteCate(int id) {
        Session session = factory.getObject().getCurrentSession();
        Category c = session.get(Category.class, id);
        if (c != null) {
            session.remove(c);
        }
    }
}
