package com.itechart.security.business.model.persistent;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

/**
 * Created by siarhei.rudzevich on 2/15/2017.
 */
@Entity
@Getter
@Setter
@Table(name = "smg_profile")
@EqualsAndHashCode(callSuper = true)
public class SmgProfileShortDetails extends SecuredEntity{

    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "domen_name", nullable = false, length = 30)
    private String domenName;

    @Override
    public Long getId() {
        return id;
    }
}
