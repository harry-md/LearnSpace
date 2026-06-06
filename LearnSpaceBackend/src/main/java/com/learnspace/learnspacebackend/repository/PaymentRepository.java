package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.Payment;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Optional<Payment> findByEnrollmentId(int enrollmentId);

    @EntityGraph(attributePaths = "enrollment")
    List<Payment> findByStripeSessionId(String stripeSessionId);
}
