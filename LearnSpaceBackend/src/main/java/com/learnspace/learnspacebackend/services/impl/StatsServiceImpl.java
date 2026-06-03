package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.repositories.StatsRepository;
import com.learnspace.learnspacebackend.services.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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

        return statsRepository.getIncomeByAllMonths(year);
    }

    @Override
    public List<BigDecimal> getIncomeByAllQuarter(int year) {
        return statsRepository.getIncomeByAllQuarters(year);
    }
}
