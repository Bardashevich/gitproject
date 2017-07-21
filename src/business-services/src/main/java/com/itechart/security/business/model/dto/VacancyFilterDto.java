package com.itechart.security.business.model.dto;

import com.itechart.common.model.filter.dto.TextFilterDto;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by artsiom.marenau on 11/17/2016.
 */
@Getter
@Setter
public class VacancyFilterDto extends TextFilterDto {

    private boolean showClosed = false;
    private Long displayedPeriodStart;
    private Long displayedPeriodEnd;
}
