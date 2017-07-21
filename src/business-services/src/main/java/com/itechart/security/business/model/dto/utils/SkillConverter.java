package com.itechart.security.business.model.dto.utils;

import com.itechart.security.business.model.dto.SkillDto;
import com.itechart.security.business.model.persistent.Contact;
import com.itechart.security.business.model.persistent.Skill;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by pavel.urban on 12/1/2016.
 */
public class SkillConverter {
    public static Set<Skill> convert(Set<SkillDto> skillDtos, Contact contact){
        Set<Skill> skills = new HashSet<>();
        for(SkillDto skillDto : skillDtos){
            skills.add(convert(skillDto,contact));
        }
        return skills;
    }

    private static Skill convert(SkillDto skillDto, Contact contact){
        Skill skill = new Skill();
        skill.setName(skillDto.getName());
        skill.setDateDeleted(skillDto.getDateDeleted());
        skill.setId(skillDto.getId());
        skill.setContact(contact);
        return skill;
    }
}
