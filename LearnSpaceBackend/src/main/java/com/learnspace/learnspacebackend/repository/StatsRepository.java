package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.Payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface StatsRepository extends JpaRepository<Payment, Integer> {
    @Query("""
        SELECT e.course.name, COUNT(e)
        FROM Enrollment e
        GROUP BY e.course.id
        ORDER BY COUNT(e) DESC
        LIMIT 10
        """)
    List<Object[]> statsEnrollmentByCourse();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal getTotalIncome();

    @Query(value = """
        SELECT EXTRACT(:timeunit from created_at) AS time_period, SUM(amount) AS total_revenue
        FROM payments WHERE status = 'COMPLETED' AND EXTRACT(YEAR FROM created_at) = :year
        GROUP BY EXTRACT(:timeunit FROM created_at)
        ORDER BY time_period
        """, nativeQuery = true)
    List<Object[]> statsRevenueByTime(@Param("timeUnit") String timeUnit, @Param("year") int year);
}
