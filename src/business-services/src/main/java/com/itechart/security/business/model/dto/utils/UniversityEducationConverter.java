package com.itechart.security.business.model.dto.utils;

import com.itechart.security.business.model.dto.UniversityEducationDto;
import com.itechart.security.business.model.enums.CertificateType;
import com.itechart.security.business.model.persistent.Contact;
import com.itechart.security.business.model.persistent.UniversityEducation;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by pavel.urban on 12/1/2016.
 */
public class UniversityEducationConverter {
    public static Set<UniversityEducation> convert(Set<UniversityEducationDto> universitiesDtos, Contact contact){
        Set<UniversityEducation> universities = new HashSet<>();
        for(UniversityEducationDto universitiesDto : universitiesDtos){
            universities.add(convert(universitiesDto,contact));
        }
        return universities;
    }

    private static UniversityEducation convert(UniversityEducationDto universityDto, Contact contact){
        UniversityEducation universityEducation = new UniversityEducation();
        universityEducation.setId(universityDto.getId());
        universityEducation.setDateDeleted(universityDto.getDateDeleted());
        universityEducation.setName(universityDto.getName());
        universityEducation.setStartDate(universityDto.getStartDate());
        universityEducation.setContact(contact);
        universityEducation.setEndDate(universityDto.getEndDate());
        universityEducation.setSpeciality(universityDto.getSpeciality());
        universityEducation.setType(CertificateType.valueOf(universityDto.getType()));
        return universityEducation;
    }
}
