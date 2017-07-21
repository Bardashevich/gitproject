package com.itechart.security.business.model.enums;

import lombok.Getter;

/**
 * Created by artsiom.marenau on 11/29/2016.
 */
@Getter
public enum VacancyPriority {
    HIGH("High"),
    MIDDLE("Middle"),
    LOW("Low");
    private String value;

    public static VacancyPriority findByName(String type){
        for (VacancyPriority priority : VacancyPriority.values()){
            if (priority.name().equalsIgnoreCase(type)){
                return priority;
            }
        }
        throw new RuntimeException("VacancyPriority was not found for name: " + type);
    }

    VacancyPriority(String value){
        this.value = value;
    }
}
