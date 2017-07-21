package com.itechart.security.business.model.dto;

import com.itechart.security.business.model.enums.RecruitmentOpportunityType;
import com.itechart.security.business.model.persistent.Contact;
import com.itechart.security.business.model.persistent.linkedin.LinkedInSnippet;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * Created by pavel.urban on 11/22/2016.
 */
@Getter
@Setter
public class RecruitmentOpportunityDto {
    private Long id;

    private String fullName;

    private RecruitmentOpportunityType status;

    private String profileUri;

    private String imageUri;

    private String reason;

    private String currentReason;

    private String comment;

    private String currentComment;

    private String position;

    private String location;

    private String industry;

    private List<LinkedInSnippet> snippets;

    private Long contactId;

    private Long vacancyId;

    private Boolean contactWasCreated;
}
