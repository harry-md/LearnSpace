package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.repository.StatsRepository;
import com.learnspace.learnspacebackend.service.StatsService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Service
public class StatsServiceImpl implements StatsService {
    private final StatsRepository statsRepository;

    @Override
    public BigDecimal getTotalIncome() {
        return statsRepository.getTotalIncome();
    }

    @Override
    public List<BigDecimal> getIncomeByAllMonths(int year) {
        BigDecimal[] data = new BigDecimal[12];
        Arrays.fill(data, BigDecimal.ZERO);

        for (Object[] row : statsRepository.statsRevenueByMonth(year)) {
            data[((Number) row[0]).intValue() - 1] = (BigDecimal) row[1];
        }
        return Arrays.asList(data);
    }

    @Override
    public List<BigDecimal> getIncomeByAllQuarter(int year) {
        BigDecimal[] data = new BigDecimal[4];
        Arrays.fill(data, BigDecimal.ZERO);

        for (Object[] row : statsRepository.statsRevenueByQuarter(year)) {
            data[((Number) row[0]).intValue() - 1] = (BigDecimal) row[1];
        }
        return Arrays.asList(data);
    }

    @Override
    public List<Object[]> statsEnrollmentByCourse() {
        return statsRepository.statsEnrollmentByCourse();
    }
}
