package com.itechart.security.business.model.persistent.linkedin;

import com.itechart.security.business.model.persistent.RecruitmentOpportunity;
import com.itechart.security.business.model.persistent.SecuredEntity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;


@Entity
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Table(name = "linkedin_search_contact")
public class LinkedInSearchContact extends SecuredEntity {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "linkedin_id", nullable = false)
    private long linkedinId;

    @Column(name = "first_name")
    private String firstname;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "position")
    private String position;

    @Column(name = "location")
    private String location;

    @Column(name = "industry")
    private String industry;

    @Column(name = "image_uri")
    private String imageUri;

    @Column(name = "profile_uri")
    private String profileUri;

    @OneToMany(mappedBy = "linkedInSearchContact", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<LinkedInSnippet> snippets;

    @OneToMany(mappedBy = "linkedInSearchContact", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<RecruitmentOpportunity> recruitmentOpportunity;

    @Override
    public Long getId() {
        return id;
    }

}
