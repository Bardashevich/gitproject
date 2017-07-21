package com.itechart.security.business.model.dto;

import com.itechart.security.business.model.persistent.linkedin.LinkedInSearchContact;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LinkedInSearchResultDto {

    private String nextLink;
    private String exceptionMessage;
    private List<LinkedInSearchContact> contacts;

    public LinkedInSearchResultDto(String nextLink, List<LinkedInSearchContact> contacts){
        this.contacts = contacts;
        this.nextLink = nextLink;
    }
}
