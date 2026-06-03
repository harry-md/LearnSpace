package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.pojo.Payment;
import com.learnspace.learnspacebackend.repositories.StatsRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Repository
@Transactional
public class StatsRepositoryImpl implements StatsRepository {
    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Object[]> statsEnrollmentByCourse() {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);
        Root<Enrollment> root = q.from(Enrollment.class);
        Join<Enrollment, Course> courseJoin = root.join("course");

        q.multiselect(courseJoin.get("name"), b.count(root))
                .groupBy(courseJoin.get("id"))
                .orderBy(b.desc(b.count(root)));

        return session.createQuery(q).setMaxResults(10).getResultList();
    }

    @Override
    public BigDecimal getTotalIncome() {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<BigDecimal> q = b.createQuery(BigDecimal.class);
        Root<Payment> root = q.from(Payment.class);
        q.select(b.sum(root.get("amount"))).where(b.equal(root.get("status"), "COMPLETED"));

        return session.createQuery(q).getSingleResult();
    }

    @Override
    public List<Object[]> statsRevenueByTime(String time, int year) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);

        Root<Payment> root = q.from(Payment.class);

        q.multiselect(b.function(time, Integer.class, root.get("createdAt")), b.sum(root.get("amount")));

        q.where(
                b.equal(root.get("status"), "COMPLETED"),
                b.equal(b.function("YEAR", Integer.class, root.get("createdAt")), year));

        q.groupBy(b.function(time, Integer.class, root.get("createdAt")));

        return session.createQuery(q).getResultList();
    }
}
