package com.itechart.security.business.model.enums;

import lombok.Getter;

/**
 * Created by artsiom.marenau on 1/31/2017.
 */
@Getter
public enum LanguageEnum {
    ENGLISH("English"),
    DEUTSCH("Deutsch"),
    RUSSIAN("Russian"),
    SPANISH("Spanish"),
    FRENCH("French");

    private String value;

    public static LanguageEnum findByName(String languageType){
        if (languageType == null){return LanguageEnum.RUSSIAN;}
        for(LanguageEnum type: LanguageEnum.values()){
            if(type.name().equals(languageType)){
                return type;
            }
        }
        throw new RuntimeException("Language was not found for name " + languageType);
    }

    LanguageEnum(String value){this.value = value;}
}
