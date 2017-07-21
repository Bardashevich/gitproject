package com.itechart.security.business.model.dto;

import lombok.Data;

import java.util.Date;

/**
 * Created by anton.charnou on 26.05.2016.
 */
@Data
public class LanguageDto {

    private Long id;
    private String name;
    private String level;
    private Date dateDeleted;
}
