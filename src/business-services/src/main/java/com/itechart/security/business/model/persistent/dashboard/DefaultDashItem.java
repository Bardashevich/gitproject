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
@Table(name = "def_dash_item")
public class DefaultDashItem extends BaseEntity {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dash_item_id", referencedColumnName = "id", nullable = false)
    private DashItem dashItem;

    @Column(name = "role_id", nullable = false)
    private Long roleId;

    @Column(name = "col", nullable = false)
    private Integer col;

    @Column(name = "row", nullable = false)
    private Integer row;
}