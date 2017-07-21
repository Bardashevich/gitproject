package com.itechart.security.business.model.dto;

import com.itechart.common.model.filter.dto.TextFilterDto;
import com.itechart.security.business.model.enums.RecruitmentOpportunityType;

/**
 * Created by pavel.urban on 11/22/2016.
 */
public class RecruitmentOpportunityFilterDto extends TextFilterDto {
    private long vacancyId;

    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getVacancyId() {
        return vacancyId;
    }

    public void setVacancyId(long vacancyId) {
        this.vacancyId = vacancyId;
    }
}
