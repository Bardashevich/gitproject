package com.itechart.security.business.model.dto.dashboard;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by artsiom.marenau on 12/19/2016.
 */
@Getter
@Setter
public class DashItemDto {
    private Long id;

    private String name;

    private Integer col;

    private Integer row;

    private Boolean visible;

}
