package com.itechart.security.business.service;

import com.itechart.security.business.model.dto.*;

import java.util.Date;
import java.util.List;

public interface RecruitmentOpportunityService {

    Long saveOpportunityWithAction(LinkedInCandidatDto candidat);

    Long saveOpportunityWithCV(Integer vacancyId, ContactDto dto);

    boolean updateOpportunity(RecruitmentOpportunityDto dto);

    List<RecruitmentOpportunityDto> findRecruitmentOpportunities(RecruitmentOpportunityFilterDto filter);

    List<RecruitmentOpportunityDto> getRecruitmentOpportunityDtosByVacancyId(Integer vacancyId);

    int countOpportunities(RecruitmentOpportunityFilterDto filter);

    String getOpportunityStatusLogicStr();

    List getOpportunityStatusByDate(Date start, Date end);

    List<VacancyStatisticDto> getOpportunityStatusByDateAndVacancy(List<VacancyDto> vacancies, Date start, Date end);

    List getOpportunityStatisticData(Date start, Date end, Long vacancyId);

}
