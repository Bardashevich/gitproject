package com.itechart.security.business.service;

import com.itechart.security.business.model.dto.*;

import java.util.List;

public interface DictionaryService {
    List<CountryDto> getCountries();

    List<SocialNetworkDto> getSocialNetworks();

    List<MessengerDto> getMessengers();

    List<String> getEducationTypes();

    List<VacancyPriorityDto> getPriorities();

    DictionaryDto getDictionary();
}
