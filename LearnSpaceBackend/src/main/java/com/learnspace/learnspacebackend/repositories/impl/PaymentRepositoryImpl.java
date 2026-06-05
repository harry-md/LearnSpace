package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Payment;
import com.learnspace.learnspacebackend.repositories.PaymentRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class PaymentRepositoryImpl implements PaymentRepository {
    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Payment> getPaymentsByStripeSessionId(String stripeSessionId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Payment> q = b.createQuery(Payment.class);
        Root<Payment> root = q.from(Payment.class);
        root.fetch("enrollment");

        q.select(root).where(b.equal(root.get("stripeSessionId"), stripeSessionId));
        return session.createQuery(q).getResultList();
    }

    @Override
    public Payment getPaymentByEnrollmentId(int enrollmentId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Payment> q = b.createQuery(Payment.class);
        Root<Payment> root = q.from(Payment.class);
        q.select(root).where(b.equal(root.get("enrollment").get("id"), enrollmentId));
        return session.createQuery(q).getSingleResult();
    }

    @Override
    public Payment addOrUpdatePayment(Payment payment) {
        Session session = factory.getObject().getCurrentSession();
        if (payment.getId() == null) {
            session.persist(payment);
            return payment;
        }
        return session.merge(payment);
    }
}
