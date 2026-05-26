package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Payment;
import com.learnspace.learnspacebackend.repositories.PaymentRepository;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class PaymentRepositoryImpl implements PaymentRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Payment addOrUpdatePayment(Payment payment) {
        Session session = factory.getObject().getCurrentSession();
        if (payment.getId() == null) {
            session.persist(payment);
            return payment;
        }
        return session.merge(payment);
    }

    @Override
    public Payment getPaymentByPaypalOrderId(String paypalOrderId) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery(
                        "FROM Payment p"
                                + " JOIN FETCH p.enrollment e"
                                + " JOIN FETCH e.student"
                                + " JOIN FETCH e.course"
                                + " WHERE p.paypalOrderId = :orderId",
                        Payment.class)
                .setParameter("orderId", paypalOrderId)
                .getSingleResultOrNull();
    }

    @Override
    public Payment getPaymentById(int id) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery(
                        "FROM Payment p"
                                + " JOIN FETCH p.enrollment e"
                                + " JOIN FETCH e.student"
                                + " JOIN FETCH e.course"
                                + " WHERE p.id = :id",
                        Payment.class)
                .setParameter("id", id)
                .getSingleResultOrNull();
    }
}
