package com.itechart.security.business.model.persistent;

import com.itechart.common.model.persistent.BaseEntity;
import com.itechart.security.business.model.enums.EducationType;
import com.itechart.security.business.model.enums.VacancyPriority;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * Created by artsiom.marenau on 11/17/2016.
 */
@Entity
@Getter
@Setter
@Table(name = "vacancy")
public class Vacancy extends BaseEntity {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "position_name", nullable = false, length = 100)
    private String positionName;

    @Column(name = "responsibilities", nullable = false, length = 500)
    private String responsibilities;

    @Column(name = "salary_min")
    private Integer salaryMin;

    @Column(name = "salary_max")
    private Integer salaryMax;

    @Column(name = "education_type", length = 20)
    @Enumerated(value = EnumType.STRING)
    private EducationType educationType;

    @Column(name = "specialization", length = 50)
    private String specialization;

    @Column(name = "open_date", nullable = false)
    private Date openDate;

    @Column(name = "close_date")
    private Date closeDate;

    @Column(name = "comment", length = 500)
    private String comment;

    @Column(name = "foreign_language", length = 20)
    private String foreignLanguage;

    @Column(name = "language_level", length = 20)
    private String languageLevel;

    @Column(name = "experience_min")
    private Integer experienceMin;

    @Column(name = "experience_max")
    private Integer experienceMax;

    @Column(name = "priority", length = 10)
    @Enumerated(value = EnumType.STRING)
    private VacancyPriority vacancyPriority;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hr_id", referencedColumnName = "id", nullable = false)
    private Contact hr;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "creator_id", referencedColumnName = "id", nullable = false)
    private Contact creator;

    @Column(name = "date_deleted")
    private Date dateDeleted;

    @Column(name = "last_search_date")
    private Date lastSearchDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deleter_id", referencedColumnName = "id")
    private Contact deleter;

    @OneToMany(mappedBy = "vacancy", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<VacancySkill> vacancySkills;

    @OneToMany(mappedBy = "vacancy", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<RecruitmentOpportunity> recruitmentOpportunity;

}
