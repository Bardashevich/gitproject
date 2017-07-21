package com.itechart.security.business.model.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by pavel.urban on 11/16/2016.
 */
@Getter
@Setter
public class LinkedInNextSearchResultDto {
    private String nextLink;

    private long vacancyId;

    private String cookiesStr;
}
