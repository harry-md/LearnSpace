package com.learnspace.learnspacebackend.repositories;

import java.math.BigDecimal;
import java.util.List;

public interface StatsRepository {
    BigDecimal getTotalIncome();

    List<BigDecimal> getIncomeByAllMonths(int year);

    List<BigDecimal> getIncomeByAllQuarters(int year);
}
