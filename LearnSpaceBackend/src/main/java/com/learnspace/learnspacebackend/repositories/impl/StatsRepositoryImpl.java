package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Payment;
import com.learnspace.learnspacebackend.repositories.StatsRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Repository
@Transactional
public class StatsRepositoryImpl implements StatsRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

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
    public List<BigDecimal> getIncomeByAllMonths(int year) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);
        Root<Payment> root = q.from(Payment.class);
        q.multiselect(b.function("MONTH", Integer.class, root.get("createdAt")), b.sum(root.get("amount")))
                .where(
                        b.equal(root.get("status"), "COMPLETED"),
                        b.equal(b.function("YEAR", Integer.class, root.get("createdAt")), year))
                .groupBy(b.function("MONTH", Integer.class, root.get("createdAt")));

        List<Object[]> results = session.createQuery(q).getResultList();

        List<BigDecimal> monthlyIncome = new ArrayList<>(Collections.nCopies(12, BigDecimal.ZERO));

        for (Object[] row : results) {
            int month = (Integer) row[0];
            BigDecimal total = (BigDecimal) row[1];
            monthlyIncome.set(month - 1, total != null ? total : BigDecimal.ZERO);
        }
        return monthlyIncome;
    }

    @Override
    public List<BigDecimal> getIncomeByAllQuarters(int year) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);
        Root<Payment> root = q.from(Payment.class);

        q.multiselect(b.function("QUARTER", Integer.class, root.get("createdAt")), b.sum(root.get("amount")))
                .where(
                        b.equal(root.get("status"), "COMPLETED"),
                        b.equal(b.function("YEAR", Integer.class, root.get("createdAt")), year))
                .groupBy(b.function("QUARTER", Integer.class, root.get("createdAt")));

        List<Object[]> results = session.createQuery(q).getResultList();

        List<BigDecimal> quarterlyIncome = new ArrayList<>(Collections.nCopies(4, BigDecimal.ZERO));

        for (Object[] row : results) {
            int quarter = (Integer) row[0];
            BigDecimal total = (BigDecimal) row[1];
            quarterlyIncome.set(quarter - 1, total != null ? total : BigDecimal.ZERO);
        }
        return quarterlyIncome;
    }
}
