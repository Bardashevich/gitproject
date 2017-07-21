package com.itechart.security.business.service;

import com.itechart.security.business.filter.VacancyFilter;
import com.itechart.security.business.model.dto.VacancyDto;

import java.util.Date;
import java.util.List;

/**
 * Created by artsiom.marenau on 11/17/2016.
 */
public interface VacancyService {

    VacancyDto get(Long id);

    List<VacancyDto> findVacancies(VacancyFilter filter);

    int countVacancies(VacancyFilter filter);

    void deleteById(Long id);

    void updateVacancy(VacancyDto vacancy);

    Long saveVacancy(VacancyDto dto);

    Date updateSearchDate(Long vacancyId);

    List countVacanciesByStatus(Date periodStart, Date periodEnd);
}
