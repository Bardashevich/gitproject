package com.itechart.security.business.model.persistent;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.itechart.common.model.persistent.BaseEntity;
import com.itechart.security.business.model.enums.RecruitmentOpportunityType;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by pavel.urban on 12/7/2016.
 */
@Entity
@Getter
@Setter
@Table(name = "recruitment_opportunity_status_history")
public class RecruitmentOpportunityStatusHistory extends BaseEntity {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "status")
    @Enumerated(value = EnumType.STRING)
    private RecruitmentOpportunityType status;

    @Column(name = "reason")
    private String reason;

    @Column(name = "comment")
    private String comment;

    @Column(name = "date_create")
    private Date dateCreate;

    @ManyToOne(optional = false, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "recruitment_opportunity_id", nullable = false)
    private RecruitmentOpportunity opportunity;

    public RecruitmentOpportunityStatusHistory(){}

    public RecruitmentOpportunityStatusHistory(RecruitmentOpportunityType status, String reason, String comment, Date date, RecruitmentOpportunity opportunity){
        this.reason = reason;
        this.comment = comment;
        this.status = status;
        this.dateCreate = date;
        this.opportunity = opportunity;
    }

}
