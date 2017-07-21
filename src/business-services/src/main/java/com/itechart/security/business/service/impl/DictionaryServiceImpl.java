package com.itechart.security.business.service.impl;

import com.itechart.security.business.dao.CountryDao;
import com.itechart.security.business.dao.MessengerDao;
import com.itechart.security.business.dao.SocialNetworkDao;
import com.itechart.security.business.model.dto.*;
import com.itechart.security.business.model.enums.*;
import com.itechart.security.business.service.DictionaryService;
import com.itechart.security.business.service.enums.FileType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static com.itechart.security.business.model.dto.utils.DtoConverter.*;

@Service
public class DictionaryServiceImpl implements DictionaryService {

    @Autowired
    private CountryDao countryDao;

    @Autowired
    private MessengerDao messengerDao;

    @Autowired
    private SocialNetworkDao socialNetworkDao;

    @Override
    @Transactional
    public List<CountryDto> getCountries() {
        return convertCountries(countryDao.loadAll());
    }

    @Override
    @Transactional
    public List<SocialNetworkDto> getSocialNetworks() {
        return convertSocialNetworks(socialNetworkDao.loadAll());
    }

    @Override
    @Transactional
    public List<MessengerDto> getMessengers() {
        return convertMessengers(messengerDao.loadAll());
    }

    @Override
    public List<String> getEducationTypes(){
        List<String> educationTypes = new ArrayList<>();
        for (EducationType educationType : EducationType.values()){
            educationTypes.add(educationType.getValue());
        }
        return educationTypes;
    }

    @Override
    public List<VacancyPriorityDto> getPriorities(){
        List<VacancyPriorityDto> priorities = new ArrayList<>();
        for (VacancyPriority vacancyPriority : VacancyPriority.values()){
            VacancyPriorityDto dto = new VacancyPriorityDto();
            dto.setName(vacancyPriority.name());
            dto.setValue(vacancyPriority.getValue());
            priorities.add(dto);
        }
        return priorities;
    }

    @Override
    @Transactional
    public DictionaryDto getDictionary() {
        DictionaryDto dictionaryDto = new DictionaryDto();
        dictionaryDto.setCountries(getCountries());
        dictionaryDto.setSocialNetworks(getSocialNetworks());
        dictionaryDto.setMessengers(getMessengers());
        dictionaryDto.setEmailTypes(convertEmailTypes(EmailType.values()));
        dictionaryDto.setTelephoneTypes(convertTelephoneTypes(TelephoneType.values()));
        dictionaryDto.setCertificateTypes(convertCertificateTypes(CertificateType.values()));
        dictionaryDto.setFileTypes(convertFileTypes(FileType.values()));
        return dictionaryDto;
    }
}
