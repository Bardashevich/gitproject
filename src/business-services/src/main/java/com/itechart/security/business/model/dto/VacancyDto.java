package com.itechart.security.business.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.Set;

/**
 * Created by artsiom.marenau on 11/17/2016.
 */
@Getter
@Setter
public class VacancyDto {
    private Long id;

    private String name;

    private String positionName;

    private String responsibilities;

    private Integer salaryMin;

    private Integer salaryMax;

    private String educationType;

    private String specialization;

    private Date openDate;

    private Date closeDate;

    private String comment;

    private String foreignLanguage;

    private String languageLevel;

    private Integer experienceMin;

    private Integer experienceMax;

    private String vacancyPriority;

    private ContactDto hr;

    private ContactDto creator;

    private Date dateDeleted;

    private Date lastSearchDate;

    private ContactDto deleter;

    private HistoryEntryDto history;

    private Set<VacancySkillDto> vacancySkills;

    private String status;
}
