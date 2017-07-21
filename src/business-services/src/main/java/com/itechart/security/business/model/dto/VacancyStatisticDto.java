package com.itechart.security.business.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

/**
 * Created by yury.sauchuk on 12/23/2016.
 */
@Getter
@Setter
public class VacancyStatisticDto {
    private VacancyDto vacancy;
    private Map<String, Long> statistic;
}
