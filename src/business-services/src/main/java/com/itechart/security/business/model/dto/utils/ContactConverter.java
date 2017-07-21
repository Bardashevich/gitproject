package com.itechart.security.business.model.dto.utils;

import com.itechart.common.model.util.FilterConverter;
import com.itechart.security.business.filter.ContactFilter;
import com.itechart.security.business.model.dto.ContactFilterDto;
import com.itechart.security.business.model.dto.SkillDto;
import com.itechart.security.business.model.dto.UniversityEducationDto;
import com.itechart.security.business.model.dto.WorkplaceDto;
import com.itechart.security.business.model.enums.CertificateType;
import com.itechart.security.business.model.persistent.Contact;
import com.itechart.security.business.model.persistent.Skill;
import com.itechart.security.business.model.persistent.UniversityEducation;
import com.itechart.security.business.model.persistent.Workplace;

import java.util.HashSet;
import java.util.Set;

public class ContactConverter {

    public static ContactFilter convert(ContactFilterDto dto) {
        return FilterConverter.convert(new ContactFilter(), dto);
    }


}
