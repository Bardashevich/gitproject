package com.itechart.security.business.model.persistent.linkedin;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import com.itechart.security.business.model.persistent.SecuredEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

/**
 * Created by pavel.urban on 11/16/2016.
 */
@Entity
@Getter
@Setter
@Table(name = "linkedin_search_contact_snippet")
public class LinkedInSnippet extends SecuredEntity {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="field_name")
    private String fieldName;

    @Column(name="heading")
    private String heading;

    @Column(name="body")
    private String body;

    @ManyToOne(optional = false, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "linkedin_search_contact_id", nullable = false)
    @JsonIgnore
    private LinkedInSearchContact linkedInSearchContact;

    public LinkedInSnippet(JsonNode snippet, LinkedInSearchContact contact){
        this.fieldName = snippet.get("fieldName").asText();
        if(snippet.has("body")) this.body = snippet.get("body").asText();
        if(snippet.has("heading")) this.heading = snippet.get("heading").asText();
        this.linkedInSearchContact = contact;
    }

    public LinkedInSnippet(){}
}
