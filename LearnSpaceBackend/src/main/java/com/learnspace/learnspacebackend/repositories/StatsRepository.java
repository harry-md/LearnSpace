package com.learnspace.learnspacebackend.repositories;

import java.math.BigDecimal;
import java.util.List;

public interface StatsRepository {

    List<Object[]> statsEnrollmentByCourse();

    BigDecimal getTotalIncome();

    List<Object[]> statsRevenueByTime(String time, int year);

    List<Object[]> statsRevenueByCategory();

    List<Object[]> getTopRatedCourses(int limit);
}
