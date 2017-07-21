package com.itechart.security.business.model.persistent;


import com.itechart.common.model.persistent.BaseEntity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Table(name = "contact_comment")
public class ContactComment extends BaseEntity{

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "contact_id", referencedColumnName = "id")
    private Contact contact;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinColumn(name = "author_id", referencedColumnName = "id")
    private Contact author;

    @Column(name = "text", length = 500)
    private String text;

    @Column(name = "created")
    private Date dateCreated;

    @Column(name = "deleted")
    private Date dateDeleted;

    @Override
    public Long getId() {
        return this.id;
    }
}
