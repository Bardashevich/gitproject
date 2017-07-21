package com.itechart.security.business.dao;

import com.itechart.common.dao.BaseDao;
import com.itechart.security.business.filter.VacancyFilter;
import com.itechart.security.business.model.persistent.Vacancy;

import java.util.Date;
import java.util.List;


/**
 * Created by artsiom.marenau on 11/17/2016.
 */
public interface VacancyDao extends BaseDao<Vacancy,Long,VacancyFilter> {

    Date updateLastSearchDate(Long vacancyId);

    List countVacanciesByStatus(Date periodStart, Date periodEnd);
}
