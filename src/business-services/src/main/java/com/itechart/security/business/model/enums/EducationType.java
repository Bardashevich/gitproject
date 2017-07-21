package com.itechart.security.business.model.enums;

import lombok.Getter;

@Getter
public enum EducationType {
    HIGHER("Higher"),
    HIGHER_UNFINISHED("Higher unfinished"),
    SECONDARY("Secondary"),
    BASE("Base");
    private String value;

    public static EducationType findByName(String type){
        for (EducationType educationType : EducationType.values()){
            if (educationType.getValue().equals(type)){
                return educationType;
            }
        }
        throw new RuntimeException("EducationType was not found for name: " + type);
    }

    EducationType(String value){
        this.value = value;
    }
}
