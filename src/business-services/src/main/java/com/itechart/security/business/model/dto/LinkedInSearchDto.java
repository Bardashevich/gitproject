package com.itechart.security.business.model.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LinkedInSearchDto {
    public String keyWords;

    public String position;

    public String company;

    public String firstName;

    public String lastName;

    public String location;

    public long vacancyId;

    public String cookiesStr;

    public String nextLink;
}
