package com.itechart.security.business.model.dto;

import com.itechart.security.business.model.enums.RecruitmentOpportunityType;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by pavel.urban on 11/21/2016.
 */
@Getter
@Setter
public class LinkedInCandidatDto {

    private Long linkedInSearchResultId;

    private RecruitmentOpportunityType recruitmentOpportunityType;

    private String reason;

    private long vacancyId;

}
