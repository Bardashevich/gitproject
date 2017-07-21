package com.itechart.security.business.model.persistent.dashboard;

import com.itechart.common.model.persistent.BaseEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * Created by artsiom.marenau on 12/26/2016.
 */
@Entity
@Getter
@Setter
@Table(name = "custom_dash_item_prop")
public class CustomDashItem extends BaseEntity {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dash_item_id", referencedColumnName = "id", nullable = false)
    private DashItem dashItem;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "col")
    private Integer col;

    @Column(name = "row")
    private Integer row;

    @Column(name = "visible")
    private Boolean visible;

}
