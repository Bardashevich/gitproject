package com.itechart.security.business.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;


/**
 * Created by artsiom.marenau on 11/17/2016.
 */
@Getter
@Setter
public class VacancySkillDto {
    private Long id;

    private VacancyDto vacancy;

    private String name;

    private Boolean required;

    private Date dateDeleted;
}
