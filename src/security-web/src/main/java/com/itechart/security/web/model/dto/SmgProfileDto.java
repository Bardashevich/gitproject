package com.itechart.security.web.model.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.itechart.security.business.model.dto.ContactDto;
import com.itechart.security.business.model.dto.EmailDto;
import com.itechart.security.business.model.dto.MessengerAccountDto;
import com.itechart.security.business.model.dto.TelephoneDto;
import com.itechart.security.model.dto.SecuredUserDto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import static org.springframework.util.StringUtils.isEmpty;

/**
 * Created by siarhei.rudzevich on 2/14/2017.
 */

@Data
@EqualsAndHashCode()
@JsonIgnoreProperties(ignoreUnknown = true)
public class SmgProfileDto {


    private static final Logger logger = LoggerFactory.getLogger(SmgProfileDto.class);

    private static final Long SKYPE_ID = 1L;

    public Integer ProfileId;
    public Integer DeptId;
    public String Birthday;
    public String DomenName;
    public String Email;
    public String FirstName;
    public String FirstNameEng;
    public String Image;
    public String LastName;
    public String LastNameEng;
    public String MiddleName;
    public String Phone;
    public String Rank;
    public String Skype;
    public String Group;
    public String Position;

    public Boolean isDepartmentManager() {
        String rank = getRank();
        return rank != null && rank.contains("Department Manager");
    }

    public Boolean isManager() {
        String rank = getRank();
        return rank != null && rank.contains("manager");
    }

    public Boolean isHR() {
        String rank = getRank();
        return rank != null && rank.contains("HR");
    }

    public SecuredUserDto convertToUser() {
        SecuredUserDto user = new SecuredUserDto();
        user.setFirstName(getFirstName());
        user.setLastName(getLastName());
        user.setPassword(getDomenName());
        user.setUserName(getDomenName());
        user.setEmail(getEmail());
        user.setActive(true);
        user.setGroups(new HashSet<>());
        user.setAcls(new ArrayList<>());
        user.setRoles(new HashSet<>());
        return user;
    }

    public ContactDto convertToContact() {
        ContactDto contact = new ContactDto();
        if (!isEmpty(getFirstName())) {
            contact.setFirstName(getFirstName());
        } else {
            contact.setFirstName(getFirstNameEng());
        }
        if (!isEmpty(getLastName())) {
            contact.setLastName(getLastName());
        } else {
            contact.setLastName(getLastNameEng());
        }
        contact.setFirstNameEn(getFirstNameEng());
        contact.setLastNameEn(getLastNameEng());
        contact.setPatronymic(getMiddleName());
        contact.setPhotoUrl(getImage());
        contact.setIndustry("Information Technologies");
        contact.setDateOfBirth(parse(Birthday));

        Set<TelephoneDto> telephoneDtos = new HashSet<>();
        Set<EmailDto> emailDtos = new HashSet<>();
        Set<MessengerAccountDto> messengerAccountDtos = new HashSet<>();
        if (!isEmpty(getPhone())) {
            String phone = "+" + getPhone().replaceAll("[\\s()+-]", "");
            telephoneDtos.add(new TelephoneDto(null, phone, "WORK", null));
        }
        if (!isEmpty(getEmail())) {
            emailDtos.add(new EmailDto(null, getEmail(), "WORK", null));
        }
        if (!isEmpty(getSkype())) {
            messengerAccountDtos.add(new MessengerAccountDto(null, SKYPE_ID, getSkype(), null, null));
        }
        contact.setTelephones(telephoneDtos);
        contact.setEmails(emailDtos);
        contact.setMessengers(messengerAccountDtos);
        return contact;
    }

    private Date parse(String dateString) {
        logger.debug("parsing date from string [{}]", dateString);
        int beginIndex = dateString.indexOf("Date(") + 5;
        int endIndex = dateString.indexOf('+');
        dateString = dateString.substring(beginIndex, endIndex);
        Long dateLong;
        try {
            dateLong = Long.parseLong(dateString);
        } catch (NumberFormatException ex){
            logger.debug("Can not perform parse dateString to Long, returning date as 'null' {}", ex);
            return null;
        }
        return new Date(dateLong);
    }
}
