package com.itechart.security.business.model.persistent;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.itechart.common.model.persistent.BaseEntity;
import com.itechart.security.business.model.enums.RecruitmentOpportunityType;
import com.itechart.security.business.model.persistent.linkedin.LinkedInSearchContact;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.Instant;
import java.util.Date;
import java.util.Set;

/**
 * Created by pavel.urban on 11/17/2016.
 */
@Entity
@Getter
@Setter
@Table(name = "recruitment_opportunity")
public class RecruitmentOpportunity extends BaseEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "status")
    @Enumerated(value = EnumType.STRING)
    private RecruitmentOpportunityType status;

    @Column(name = "status_date")
    private Date statusDate;

    @Column(name = "reason")
    private String reason;

    @Column(name = "comment")
    private String comment;

    @Column(name="linedkin_id")
    private Long linkedInId;

    @Column(name = "contact_was_created")
    private Boolean contactWasCreated = false;

    @ManyToOne(optional = false, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "linkedin_search_contact_id", nullable = false)
    @JsonIgnore
    private LinkedInSearchContact linkedInSearchContact;

    @ManyToOne(optional = false, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "vacancy_id", nullable = false)
    @JsonIgnore
    private Vacancy vacancy;

    @ManyToOne(optional = true, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "contact_id", nullable = true)
    @JsonIgnore
    private Contact contact;

    @OneToMany(mappedBy = "opportunity", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<RecruitmentOpportunityStatusHistory> statuses;

    public RecruitmentOpportunity(){}

    public RecruitmentOpportunity(
            RecruitmentOpportunityType status
            ,String reson
            ,LinkedInSearchContact  linkedInSearchContact
            ,Vacancy vacancy
    ){
        this.status = status;
        this.reason = reson;
        this.linkedInSearchContact = linkedInSearchContact;
        this.vacancy = vacancy;
        this.linkedInId = linkedInSearchContact.getLinkedinId();
        this.statusDate = Date.from(Instant.now());
    }

}
