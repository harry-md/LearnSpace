package com.learnspace.learnspacebackend.services;

import java.math.BigDecimal;
import java.util.List;

public interface StatsService {
    BigDecimal getTotalIncome();

    List<BigDecimal> getIncomeByAllMonths(int year);

    List<BigDecimal> getIncomeByAllQuarter(int year);

    List<Object[]> statsEnrollmentByCourse();

    List<Object[]> statsRevenueByCategory();

    List<Object[]> getTopRatedCourses(int limit);
}
