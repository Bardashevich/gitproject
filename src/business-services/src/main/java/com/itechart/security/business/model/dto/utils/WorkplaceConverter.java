package com.itechart.security.business.model.dto.utils;

import com.itechart.security.business.model.dto.WorkplaceDto;
import com.itechart.security.business.model.persistent.Contact;
import com.itechart.security.business.model.persistent.Workplace;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by pavel.urban on 12/1/2016.
 */
public class WorkplaceConverter {
    public static Set<Workplace> convert(Set<WorkplaceDto> workDtos, Contact contact){
        Set<Workplace> works = new HashSet<>();
        for(WorkplaceDto workDto : workDtos){
            works.add(convert(workDto,contact));
        }
        return works;
    }


    private static Workplace convert(WorkplaceDto workplaceDto, Contact contact){
        Workplace  workplace = new Workplace();
        workplace.setEndDate(workplaceDto.getEndDate());
        workplace.setStartDate(workplaceDto.getStartDate());
        workplace.setComment(workplaceDto.getComment());
        workplace.setDateDeleted(workplaceDto.getDateDeleted());
        workplace.setId(workplaceDto.getId());
        workplace.setName(workplaceDto.getName());
        workplace.setPosition(workplaceDto.getPosition());
        workplace.setContact(contact);
        return workplace;
    }
}
