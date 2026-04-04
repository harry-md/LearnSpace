package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Category;
import com.learnspace.learnspacebackend.repositories.CategoryRepository;

import jakarta.persistence.Query;

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
        Session s = factory.getObject().getCurrentSession();

        Query q = s.createQuery("FROM Category", Category.class);
        return q.getResultList();
    }

    @Override
    public Category getCateById(int id) {
        Session s = factory.getObject().getCurrentSession();

        return s.get(Category.class, id);
    }

    @Override
    public Category createOrUpdate(Category category) {
        Session s = factory.getObject().getCurrentSession();
        if (category.getId() == null) {
            s.persist(category);
        } else {
            category = s.merge(category);
        }
        return category;
    }

    @Override
    public void deleteCate(int id) {
        Session s = factory.getObject().getCurrentSession();

        Category c = s.get(Category.class, id);
        if (c != null) {
            s.remove(c);
        }
    }
}
