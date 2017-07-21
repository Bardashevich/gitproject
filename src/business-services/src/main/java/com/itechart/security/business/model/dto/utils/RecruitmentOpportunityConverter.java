package com.itechart.security.business.model.dto.utils;

import com.itechart.common.model.util.FilterConverter;
import com.itechart.security.business.filter.RecruitmentOpportunityFilter;
import com.itechart.security.business.model.dto.RecruitmentOpportunityDto;
import com.itechart.security.business.model.dto.RecruitmentOpportunityFilterDto;
import com.itechart.security.business.model.enums.RecruitmentOpportunityType;
import com.itechart.security.business.model.persistent.RecruitmentOpportunity;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by pavel.urban on 11/22/2016.
 */

public class RecruitmentOpportunityConverter {

    public static RecruitmentOpportunityFilter convert(RecruitmentOpportunityFilterDto dto) {
        RecruitmentOpportunityFilter filter = FilterConverter.convert(new RecruitmentOpportunityFilter(), dto);
        filter.setVacancyId(dto.getVacancyId());
        filter.setStatus(RecruitmentOpportunityType.valueOf(dto.getStatus()));
        return filter;
    }

    public static List<RecruitmentOpportunityDto> convert(List<RecruitmentOpportunity> opportunities){
        List<RecruitmentOpportunityDto> recruitmentOpportunityDtos = new ArrayList<>();
        for(RecruitmentOpportunity opportunity: opportunities) {
            recruitmentOpportunityDtos.add(convert(opportunity));
        }
        return recruitmentOpportunityDtos;
    }

    public static RecruitmentOpportunityDto convert(RecruitmentOpportunity opportunity){
        RecruitmentOpportunityDto recruitmentOpportunityDto = new RecruitmentOpportunityDto();
        recruitmentOpportunityDto.setId(opportunity.getId());
        recruitmentOpportunityDto.setStatus(opportunity.getStatus());
        recruitmentOpportunityDto.setProfileUri(opportunity.getLinkedInSearchContact().getProfileUri());
        recruitmentOpportunityDto.setIndustry(opportunity.getLinkedInSearchContact().getIndustry());
        recruitmentOpportunityDto.setLocation(opportunity.getLinkedInSearchContact().getLocation());
        recruitmentOpportunityDto.setPosition(opportunity.getLinkedInSearchContact().getPosition());
        recruitmentOpportunityDto.setCurrentReason(opportunity.getReason());
        recruitmentOpportunityDto.setCurrentComment(opportunity.getComment());
        recruitmentOpportunityDto.setSnippets(opportunity.getLinkedInSearchContact().getSnippets());
        recruitmentOpportunityDto.setContactWasCreated(opportunity.getContactWasCreated());
        if(opportunity.getContact()==null) {
            if(opportunity.getLinkedInSearchContact().getFirstname().equals(""))
                recruitmentOpportunityDto.setFullName("LinkedIn Member");
            else recruitmentOpportunityDto.setFullName(opportunity.getLinkedInSearchContact().getFirstname() + " " + opportunity.getLinkedInSearchContact().getLastName());
            recruitmentOpportunityDto.setImageUri(opportunity.getLinkedInSearchContact().getImageUri());
        }else{
            recruitmentOpportunityDto.setFullName(opportunity.getContact().getFirstName() + " " +opportunity.getContact().getLastName());
            recruitmentOpportunityDto.setImageUri(opportunity.getContact().getPhotoUrl());
            recruitmentOpportunityDto.setContactId(opportunity.getContact().getId());
        }
        return recruitmentOpportunityDto;
    }

}
