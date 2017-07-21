package com.itechart.security.business.model.dto.utils;

import com.itechart.common.model.util.FilterConverter;
import com.itechart.security.business.filter.VacancyFilter;
import com.itechart.security.business.model.dto.VacancyFilterDto;

import java.util.Date;

/**
 * Created by artsiom.marenau on 11/17/2016.
 */
public class VacancyConverter {

    public static VacancyFilter convert(VacancyFilterDto dto) {
        VacancyFilter filter = FilterConverter.convert(new VacancyFilter(), dto);
        filter.setShowClosed(dto.isShowClosed());

        if (dto.getDisplayedPeriodStart() != null) {
            filter.setDisplayedPeriodStart(new Date(dto.getDisplayedPeriodStart()));
        }
        if (dto.getDisplayedPeriodEnd() != null) {
            filter.setDisplayedPeriodEnd(new Date(dto.getDisplayedPeriodEnd()));
        }

        return filter;
    }
}
