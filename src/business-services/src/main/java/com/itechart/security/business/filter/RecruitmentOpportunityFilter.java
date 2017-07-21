package com.itechart.security.business.filter;

import com.itechart.common.model.filter.TextFilter;
import com.itechart.security.business.model.enums.RecruitmentOpportunityType;
import com.itechart.security.business.model.persistent.Vacancy;

/**
 * Created by pavel.urban on 11/18/2016.
 */
public class RecruitmentOpportunityFilter extends TextFilter {


    private long vacancyId;

    private RecruitmentOpportunityType status;

    public long getVacancyId() {
        return vacancyId;
    }

    public void setVacancyId(long vacancyId) {
        this.vacancyId = vacancyId;
    }

    public RecruitmentOpportunityType getStatus() {
        return status;
    }

    public void setStatus(RecruitmentOpportunityType status) {
        this.status = status;
    }
}
