package com.itechart.security.business.model.persistent;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by artsiom.marenau on 11/17/2016.
 */
@Entity
@Getter
@Setter
@Table(name = "vacancy_skill")
public class VacancySkill extends SecuredEntity {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "vacancy_id", referencedColumnName = "id")
    private Vacancy vacancy;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "required")
    private Boolean required;

    @Column(name = "date_deleted")
    private Date dateDeleted;
}
