package com.itechart.security.business.model.persistent;

import com.itechart.security.business.model.enums.LanguageEnum;
import com.itechart.security.business.model.enums.LanguageLevelEnum;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.Date;

/**
 * Created by artsiom.marenau on 1/31/2017.
 */
@Entity
@Getter
@Setter
@Table(name = "contact_language")
@EqualsAndHashCode(callSuper = true)
public class Language extends SecuredEntity{
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "contact_id", referencedColumnName = "id")
    private Contact contact;

    @Enumerated(EnumType.STRING)
    private LanguageEnum name;

    @Enumerated(EnumType.STRING)
    private LanguageLevelEnum level;

    @Column(name = "date_deleted")
    private Date dateDeleted;

    @Override
    public Long getId() {
        return id;
    }
}
