package com.itechart.security.business.dao;

import com.itechart.common.dao.BaseDao;
import com.itechart.security.business.filter.RecruitmentOpportunityFilter;
import com.itechart.security.business.model.persistent.RecruitmentOpportunity;
import com.itechart.security.business.model.persistent.Vacancy;
import com.itechart.security.business.model.persistent.linkedin.LinkedInSearchContact;

import java.util.Date;
import java.util.List;

/**
 * Created by pavel.urban on 11/17/2016.
 */
public interface RecruitmentOpportunityDao extends BaseDao<RecruitmentOpportunity,Long,RecruitmentOpportunityFilter> {

    RecruitmentOpportunity getRecruitmentOportunityByLinkedInIdAndVacancyId(LinkedInSearchContact contact, Vacancy vacancy);

    List<RecruitmentOpportunity> findByVacancyId(Integer vacancyId);

    List getOpportunityStatusByDate(Date start, Date end);

    List getOpportunityStatusByDateAndVacancy(Long vacancyId, Date start, Date end);

    List getOpportunityStatisticData(Date start, Date end, Long vacancyId);
}
