package com.itechart.security.business.model.persistent.dashboard;

import com.itechart.common.model.persistent.BaseEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by artsiom.marenau on 12/26/2016.
 */
@Entity
@Getter
@Setter
@Table(name = "dash_item")
public class DashItem extends BaseEntity {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

}