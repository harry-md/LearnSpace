package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.repositories.StatsRepository;
import com.learnspace.learnspacebackend.services.StatsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
public class StatsServiceImpl implements StatsService {

    @Autowired
    private StatsRepository statsRepository;

    @Override
    public BigDecimal getTotalIncome() {
        return statsRepository.getTotalIncome();
    }

    @Override
    public List<BigDecimal> getIncomeByAllMonths(int year) {
        BigDecimal[] data = new BigDecimal[12];
        Arrays.fill(data, BigDecimal.ZERO);

        for (Object[] row : statsRepository.statsRevenueByTime("MONTH", year)) {
            data[(Integer) row[0] - 1] = (BigDecimal) row[1];
        }
        return Arrays.asList(data);
    }

    @Override
    public List<BigDecimal> getIncomeByAllQuarter(int year) {
        BigDecimal[] data = new BigDecimal[4];
        Arrays.fill(data, BigDecimal.ZERO);

        for (Object[] row : statsRepository.statsRevenueByTime("QUARTER", year)) {
            data[(Integer) row[0] - 1] = (BigDecimal) row[1];
        }
        return Arrays.asList(data);
    }

    @Override
    public List<Object[]> statsEnrollmentByCourse() {
        return statsRepository.statsEnrollmentByCourse();
    }
}
