package com.itechart.security.business.model.enums;

/**
 * Created by artsiom.marenau on 1/31/2017.
 */
public enum LanguageLevelEnum {
    BEGINNER("Beginner"),
    ELEMENTARY("Elementary"),
    PRE_INTERMEDIATE("Pre_intermediate"),
    INTERMEDIATE("intermediate"),
    UPPER_INTERMEDIATE("Upper_intermediate"),
    ADVANCED("Advanced"),
    PROFICIENCY("Proficiency");

    private String value;

    public static LanguageLevelEnum findByName(String languageLevelType){
        if (languageLevelType == null){return LanguageLevelEnum.BEGINNER;}
        for(LanguageLevelEnum type: LanguageLevelEnum.values()){
            if(type.name().equals(languageLevelType)){
                return type;
            }
        }
        throw new RuntimeException("Language level was not found for name " + languageLevelType);
    }

    LanguageLevelEnum(String value){this.value = value;}
}
