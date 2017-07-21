package com.itechart.security.business.model.dto.utils;

import com.itechart.security.business.model.dto.*;
import com.itechart.security.business.model.enums.*;
import com.itechart.security.business.model.persistent.*;
import com.itechart.security.business.model.persistent.task.Task;
import com.itechart.security.business.model.persistent.task.TaskComment;
import com.itechart.security.business.service.enums.FileType;
import com.itechart.security.model.dto.SecuredUserDto;
import org.apache.commons.lang.StringUtils;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.Collections.emptyList;
import static java.util.Collections.emptySet;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import static org.springframework.util.CollectionUtils.isEmpty;
public class DtoConverter {

    public static List<VacancyDto> convertVacancies(List<Vacancy> vacancies) {
        if (isEmpty(vacancies)){
            return emptyList();
        }
        return vacancies
                .stream()
                .map(DtoConverter::convertVacancyMainFields)
                .collect(toList());
    }

    public static SmgProfileShortDetailsDto convert(SmgProfileShortDetails smgProfileShortDetails){
        SmgProfileShortDetailsDto smgProfileShortDetailsDto = new SmgProfileShortDetailsDto();
        if (smgProfileShortDetails != null) {
            smgProfileShortDetailsDto.setId(smgProfileShortDetails.getId());
            smgProfileShortDetailsDto.setDomenName(smgProfileShortDetails.getDomenName());
        }
        return (smgProfileShortDetails != null) ? smgProfileShortDetailsDto : null;
    }

    public static SmgProfileShortDetails convert(SmgProfileShortDetailsDto smgProfileShortDetailsDto){
        SmgProfileShortDetails smgProfileShortDetails = new SmgProfileShortDetails();
        smgProfileShortDetails.setId(smgProfileShortDetailsDto.getId());
        smgProfileShortDetails.setDomenName(smgProfileShortDetailsDto.getDomenName());
        return smgProfileShortDetails;
    }

    public static List<SmgProfileShortDetailsDto> convertSmgProfiles(List<SmgProfileShortDetails> smgProfiles) {
        if (isEmpty(smgProfiles)) {
            return emptyList();
        }
        return smgProfiles.stream().map(DtoConverter::convert).collect(toList());
    }

    public static VacancyDto convertVacancyMainFields(Vacancy vacancy){
        VacancyDto dto = new VacancyDto();
        dto.setId(vacancy.getId());
        dto.setPositionName(vacancy.getPositionName());
        dto.setOpenDate(vacancy.getOpenDate());
        dto.setCloseDate(vacancy.getCloseDate());
        dto.setLastSearchDate(vacancy.getLastSearchDate());
        dto.setHr(convertContactMainFields(vacancy.getHr()));
        dto.setCreator(convertContactMainFields(vacancy.getCreator()));
        if (vacancy.getCloseDate() != null){
            dto.setStatus("closed");
        } else if (vacancy.getLastSearchDate() != null){
            dto.setStatus("in progress");
        } else {
            dto.setStatus("opened");
        }
        return dto;
    }

    public static VacancyDto convert(Vacancy vacancy){
        VacancyDto dto = convertVacancyMainFields(vacancy);
        dto.setName(vacancy.getName());
        dto.setResponsibilities(vacancy.getResponsibilities());
        dto.setSalaryMin(vacancy.getSalaryMin());
        dto.setSalaryMax(vacancy.getSalaryMax());
        dto.setEducationType(vacancy.getEducationType() != null ? vacancy.getEducationType().getValue() : null);
        dto.setSpecialization(vacancy.getSpecialization());
        dto.setComment(vacancy.getComment());
        dto.setForeignLanguage(vacancy.getForeignLanguage());
        dto.setLanguageLevel(vacancy.getLanguageLevel());
        dto.setExperienceMin(vacancy.getExperienceMin());
        dto.setExperienceMax(vacancy.getExperienceMax());
        dto.setVacancyPriority(vacancy.getVacancyPriority() != null ? vacancy.getVacancyPriority().name() : null);
        dto.setDateDeleted(vacancy.getDateDeleted());
        dto.setVacancySkills(convertVacancySkills(vacancy.getVacancySkills()));
        if (vacancy.getDeleter() != null) {
            dto.setDeleter(convertContactMainFields(vacancy.getDeleter()));
        }
        return dto;
    }

    public static Vacancy convert(VacancyDto vacancyDto) {
        Vacancy vacancy = new Vacancy();
        vacancy.setId(vacancyDto.getId());
        vacancy.setName(vacancyDto.getName());
        vacancy.setPositionName(vacancyDto.getPositionName());
        vacancy.setResponsibilities(vacancyDto.getResponsibilities());
        vacancy.setSalaryMin(vacancyDto.getSalaryMin());
        vacancy.setSalaryMax(vacancyDto.getSalaryMax());
        if (vacancyDto.getEducationType() != null) {
            vacancy.setEducationType(EducationType.findByName(vacancyDto.getEducationType()));
        }
        vacancy.setSpecialization(vacancyDto.getSpecialization());
        vacancy.setOpenDate(vacancyDto.getOpenDate());
        vacancy.setCloseDate(vacancyDto.getCloseDate());
        vacancy.setLastSearchDate(vacancyDto.getLastSearchDate());
        vacancy.setComment(vacancyDto.getComment());
        vacancy.setForeignLanguage(vacancyDto.getForeignLanguage());
        vacancy.setLanguageLevel(vacancyDto.getLanguageLevel());
        vacancy.setExperienceMax(vacancyDto.getExperienceMax());
        vacancy.setExperienceMin(vacancyDto.getExperienceMin());
        if ( vacancyDto.getVacancyPriority() != null ){
            vacancy.setVacancyPriority(VacancyPriority.findByName(vacancyDto.getVacancyPriority()));
        }
        if (vacancyDto.getHr() != null) {
            vacancy.setHr(convert(vacancyDto.getHr()));
        }
        if (vacancyDto.getCreator() != null) {
            vacancy.setCreator(convert(vacancyDto.getCreator()));
        }
        vacancy.setDateDeleted(vacancyDto.getDateDeleted());
        if (vacancyDto.getDeleter() != null) {
            vacancy.setDeleter(convert(vacancyDto.getDeleter()));
        }
        vacancy.setVacancySkills(convertVacancySkillDtos(vacancyDto.getVacancySkills()));
        for(VacancySkill vacancySkill : vacancy.getVacancySkills()){
            vacancySkill.setVacancy(vacancy);
        }
        return  vacancy;
    }

    public static List<ContactDto> convertContacts(List<Contact> contacts) {
        if (isEmpty(contacts)) {
            return emptyList();
        }
        return contacts.stream().map(DtoConverter::convertContactMainFields).collect(toList());
    }

    public static ContactDto convert(Contact contact) {
        ContactDto dto = convertContactMainFields(contact);
        dto.setDateOfBirth(contact.getDateOfBirth());
        dto.setIsMale(contact.getIsMale());
        dto.setNationality(contact.getNationality());
        dto.setLinkedInId(contact.getLinkedInId());
        dto.setReadingCommentsDate(contact.getReadingCommentsDate());
        dto.setCountUnreadComments(contact.getCountUnreadComments());
//        dto.setOrders(convertOrders(contact.getOrders()));
        dto.setMessengers(convertMessengerAccounts(contact.getMessengers()));
        dto.setSocialNetworks(convertSocialNetworkAccounts(contact.getSocialNetworks()));
        dto.setWorkplaces(convertWorkplaces(contact.getWorkplaces()));
        dto.setAttachments(convertAttachments(contact.getAttachments()));
        dto.setIndustry(contact.getIndustry());
        dto.setPhotoUrl(contact.getPhotoUrl());
        dto.setSkills(convertSkills(contact.getSkills()));
        dto.setEducations(convertUniversityEducations(contact.getUniversityEducations()));
        dto.setComments(convertContactComments(contact.getContactComments()));
        dto.setLanguages(convertContactLanguages(contact.getContactLanguages()));
        return dto;
    }

    public static ContactDto convertContactMainFields(Contact contact) {
        ContactDto dto = new ContactDto();
        dto.setId(contact.getId());
        dto.setFirstNameEn(contact.getFirstNameEn());
        dto.setLastNameEn(contact.getLastNameEn());
        dto.setFirstName(contact.getFirstName());
        dto.setLastName(contact.getLastName());
        dto.setPatronymic(contact.getPatronymic());
        dto.setUserId(contact.getUserId());
        dto.setAddresses(convertAddresses(contact.getAddresses()));
        dto.setTelephones(convertTelephones(contact.getTelephones()));
        dto.setEmails(convertEmails(contact.getEmails()));
        return dto;
    }

    public static Contact convert(ContactDto dto) {
        Contact contact = new Contact();
        contact.setId(dto.getId());
        contact.setFirstNameEn(dto.getFirstNameEn());
        contact.setLastNameEn(dto.getLastNameEn());
        contact.setFirstName(dto.getFirstName());
        contact.setLastName(dto.getLastName());
        contact.setPatronymic(dto.getPatronymic());
        contact.setDateOfBirth(dto.getDateOfBirth());
        contact.setIsMale(dto.getIsMale());
        contact.setPhotoUrl(dto.getPhotoUrl());
        contact.setNationality(dto.getNationality());
        contact.setUserId(dto.getUserId());
        contact.setReadingCommentsDate(dto.getReadingCommentsDate());
        contact.setCountUnreadComments(dto.getCountUnreadComments());
//        contact.setOrders(convertOrderDtos(dto.getOrders()));
        contact.setAddresses(convertAddressDtos(dto.getAddresses()));
        contact.setTelephones(convertTelephoneDtos(dto.getTelephones()));
        contact.setEmails(convertEmailDtos(dto.getEmails()));
        contact.setMessengers(convertMessengerAccountDtos(dto.getMessengers()));
        contact.setSocialNetworks(convertSocialNetworkAccountDtos(dto.getSocialNetworks()));
        contact.setWorkplaces(convertWorkplaceDtos(dto.getWorkplaces()));
        contact.setAttachments(convertAttachmentDtos(dto.getAttachments()));
        contact.setIndustry(dto.getIndustry());
        contact.setSkills(convertSkillDtos(dto.getSkills()));
        contact.setUniversityEducations(convertUnivercityEducationDtos(dto.getEducations()));
        contact.setLinkedInId(dto.getLinkedInId());
        contact.setContactComments(convertContactComentDtos(dto.getComments()));
        contact.setContactLanguages(convertContactLanguagesDtos(dto.getLanguages()));

        for (Email email : contact.getEmails()) {
            email.setContact(contact);
        }
        for (Address address : contact.getAddresses()) {
            address.setContact(contact);
        }
        for (SocialNetworkAccount account : contact.getSocialNetworks()) {
            account.setContact(contact);
        }
        for (Telephone telephone : contact.getTelephones()) {
            telephone.setContact(contact);
        }
        for (MessengerAccount messenger : contact.getMessengers()) {
            messenger.setContact(contact);
        }
        for (Workplace workplace : contact.getWorkplaces()) {
            workplace.setContact(contact);
        }
        for (Attachment attachment : contact.getAttachments()) {
            attachment.setContact(contact);
        }
        for (Skill skill : contact.getSkills()) {
            skill.setContact(contact);
        }
        for (UniversityEducation education : contact.getUniversityEducations()){
            education.setContact(contact);
        }
        for (ContactComment comment: contact.getContactComments()) {
            comment.setContact(contact);
        }
        for (Language language: contact.getContactLanguages()){
            language.setContact(contact);
        }

        return contact;
    }

    public static Contact convert(SecuredUserDto dto) {
        Contact contact = new Contact();
        contact.setFirstName(dto.getFirstName());
        contact.setLastName(dto.getLastName());
        contact.setUserId(dto.getId());
        Email email = new Email();
        email.setName(dto.getEmail());
        email.setContact(contact);
        Set<Email> emails = new HashSet<>();
        emails.add(email);
        contact.setEmails(emails);
        return contact;
    }

    public static OrderDto convert(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setProduct(order.getProduct());
        dto.setCount(order.getCount());
        dto.setPrice(order.getPrice());
        return dto;
    }

    public static Order convert(OrderDto dto) {
        Order order = new Order();
        order.setId(dto.getId());
        order.setProduct(dto.getProduct());
        order.setCount(dto.getCount());
        order.setPrice(dto.getPrice());
        return order;
    }

    public static Set<OrderDto> convertOrders(Set<Order> orders) {
        if (isEmpty(orders)) {
            return emptySet();
        }
        return orders
            .stream()
            .map(DtoConverter::convert)
            .collect(toSet());
    }

    public static Set<Order> convertOrderDtos(Set<OrderDto> orderDtos) {
        if (isEmpty(orderDtos)) {
            return emptySet();
        }
        return orderDtos
            .stream()
            .map(DtoConverter::convert)
            .collect(toSet());
    }

    public static LanguageDto convert(Language language){
        LanguageDto dto = new LanguageDto();
        dto.setId(language.getId());
        dto.setLevel(language.getLevel().name());
        dto.setName(language.getName().name().toUpperCase());
        return dto;
    }

    public static Language convert(LanguageDto dto){
        Language language = new Language();
        language.setId(dto.getId());
        language.setName(LanguageEnum.findByName(dto.getName()));
        language.setLevel(LanguageLevelEnum.findByName(dto.getLevel()));
        language.setDateDeleted(dto.getDateDeleted());
        return language;
    }

    public static Set<LanguageDto> convertContactLanguages(Set<Language> languages){
        if (isEmpty(languages)){
            return emptySet();
        }
        return languages
                .stream()
                .filter(language -> language.getDateDeleted() == null)
                .map(DtoConverter::convert)
                .collect(toSet());
    }

    public static Set<Language> convertContactLanguagesDtos(Set<LanguageDto> dtos){
        if (isEmpty(dtos)){
            return emptySet();
        }
        return  dtos
                .stream()
                .map(DtoConverter::convert)
                .collect(toSet());
    }


    public static EmailDto convert(Email email) {
        EmailDto dto = new EmailDto();
        dto.setId(email.getId());
        dto.setName(email.getName());
        dto.setType(email.getType() != null ? email.getType().name() : null);
        dto.setDateDeleted(email.getDateDeleted());
        return dto;
    }

    public static Email convert(EmailDto dto) {
        Email email = new Email();
        email.setId(dto.getId());
        email.setName(dto.getName());
        email.setType(dto.getType() != null ? EmailType.findByName(dto.getType()) : null);
        email.setDateDeleted(dto.getDateDeleted());
        return email;
    }

    public static Set<EmailDto> convertEmails(Set<Email> emails) {
        if (isEmpty(emails)) {
            return emptySet();
        }
        return emails
            .stream()
            .filter(email -> email.getDateDeleted() == null)
            .map(DtoConverter::convert)
            .collect(toSet());
    }

    public static Set<Email> convertEmailDtos(Set<EmailDto> dtos) {
        if (isEmpty(dtos)) {
            return emptySet();
        }
        return dtos
            .stream()
            .map(DtoConverter::convert)
            .collect(toSet());
    }


    public static CountryDto convert(Country country) {
        CountryDto dto = new CountryDto();
        dto.setId(country.getId());
        dto.setName(country.getName());
        return dto;
    }

    public static Country convert(CountryDto dto) {
        Country country = new Country();
        country.setId(dto.getId());
        country.setName(dto.getName());
        return country;
    }

    public static List<CountryDto> convertCountries(List<Country> countries) {
        if (isEmpty(countries)) {
            return emptyList();
        }
        return countries.stream().map(DtoConverter::convert).collect(toList());
    }

    public static AddressDto convert(Address address) {
        AddressDto dto = new AddressDto();
        dto.setId(address.getId());
        dto.setAddressLine(address.getAddressLine());
        dto.setZipcode(address.getZipcode());
        dto.setCity(address.getCity());
        dto.setRegion(address.getRegion());
        dto.setCountry(address.getCountry() != null ? address.getCountry().getId() : null);
        dto.setDateDeleted(address.getDateDeleted());
        return dto;
    }

    public static Address convert(AddressDto dto) {
        Address address = new Address();
        address.setId(dto.getId());
        address.setAddressLine(dto.getAddressLine());
        address.setZipcode(dto.getZipcode());
        address.setCity(dto.getCity());
        address.setRegion(dto.getRegion());
        if (dto.getCountry() != null && dto.getCountry() != 0) {
            Country country = new Country();
            country.setId(dto.getCountry());
            address.setCountry(country);
        }
        address.setDateDeleted(dto.getDateDeleted());
        return address;
    }

    public static Set<AddressDto> convertAddresses(Set<Address> addresses) {
        if (isEmpty(addresses)) {
            return emptySet();
        }
        return addresses
            .stream()
            .filter(address -> address.getDateDeleted() == null)
            .map(DtoConverter::convert)
            .collect(toSet());
    }

    public static Set<Address> convertAddressDtos(Set<AddressDto> dtos) {
        if (isEmpty(dtos)) {
            return emptySet();
        }
        return dtos
            .stream()
            .map(DtoConverter::convert)
            .collect(toSet());
    }


    public static TelephoneDto convert(Telephone telephone) {
        TelephoneDto dto = new TelephoneDto();
        dto.setId(telephone.getId());
        dto.setNumber(telephone.getNumber());
        dto.setType(telephone.getType() != null ? telephone.getType().name() : null);
        dto.setDateDeleted(telephone.getDateDeleted());
        return dto;
    }

    public static Telephone convert(TelephoneDto dto) {
        Telephone telephone = new Telephone();
        telephone.setId(dto.getId());
        telephone.setNumber(dto.getNumber());
        telephone.setType(dto.getType() != null ? TelephoneType.findByName(dto.getType()) : null);
        telephone.setDateDeleted(dto.getDateDeleted());
        return telephone;
    }

    public static Set<TelephoneDto> convertTelephones(Set<Telephone> telephones) {
        if (isEmpty(telephones)) {
            return emptySet();
        }
        return telephones
            .stream()
            .filter(telephone -> telephone.getDateDeleted() == null)
            .map(DtoConverter::convert)
            .collect(toSet());
    }

    public static Set<Telephone> convertTelephoneDtos(Set<TelephoneDto> telephones) {
        if (isEmpty(telephones)) {
            return emptySet();
        }
        return telephones
            .stream()
            .map(DtoConverter::convert)
            .collect(toSet());
    }


    public static MessengerDto convert(Messenger messenger) {
        MessengerDto dto = new MessengerDto();
        dto.setId(messenger.getId());
        dto.setName(messenger.getName());
        return dto;
    }

    public static Messenger convert(MessengerDto dto) {
        Messenger messenger = new Messenger();
        messenger.setId(dto.getId());
        messenger.setName(dto.getName());
        return messenger;
    }

    public static List<MessengerDto> convertMessengers(List<Messenger> messengers) {
        if (isEmpty(messengers)) {
            return emptyList();
        }
        return messengers.stream().map(DtoConverter::convert).collect(toList());
    }

    public static MessengerAccountDto convert(MessengerAccount messengerAccount) {
        MessengerAccountDto dto = new MessengerAccountDto();
        dto.setId(messengerAccount.getId());
        dto.setMessenger(messengerAccount.getMessenger() != null ? messengerAccount.getMessenger().getId() : null);
        dto.setUsername(messengerAccount.getUsername());
        dto.setDescription(messengerAccount.getDescription());
        dto.setDateDeleted(messengerAccount.getDateDeleted());
        return dto;
    }

    public static MessengerAccount convert(MessengerAccountDto dto) {
        MessengerAccount messengerAccount = new MessengerAccount();
        messengerAccount.setId(dto.getId());
        if (dto.getMessenger() != null && dto.getMessenger() != 0) {
            Messenger messenger = new Messenger();
            messenger.setId(dto.getMessenger());
            messengerAccount.setMessenger(messenger);
        }
        messengerAccount.setUsername(dto.getUsername());
        messengerAccount.setDescription(dto.getDescription());
        messengerAccount.setDateDeleted(dto.getDateDeleted());
        return messengerAccount;
    }

    public static Set<MessengerAccountDto> convertMessengerAccounts(Set<MessengerAccount> messengers) {
        if (isEmpty(messengers)) {
            return emptySet();
        }
        return messengers
            .stream()
            .filter(messengerAccount -> messengerAccount.getDateDeleted() == null)
            .map(DtoConverter::convert)
            .collect(toSet());
    }

    public static Set<MessengerAccount> convertMessengerAccountDtos(Set<MessengerAccountDto> messengers) {
        if (isEmpty(messengers)) {
            return emptySet();
        }
        return messengers
            .stream()
            .map(DtoConverter::convert)
            .collect(toSet());
    }


    public static SocialNetworkDto convert(SocialNetwork socialNetwork) {
        SocialNetworkDto dto = new SocialNetworkDto();
        dto.setId(socialNetwork.getId());
        dto.setName(socialNetwork.getName());
        return dto;
    }

    public static SocialNetwork convert(SocialNetworkDto dto) {
        SocialNetwork socialNetwork = new SocialNetwork();
        socialNetwork.setId(dto.getId());
        socialNetwork.setName(dto.getName());
        return socialNetwork;
    }

    public static List<SocialNetworkDto> convertSocialNetworks(List<SocialNetwork> socialNetworks) {
        if (isEmpty(socialNetworks)) {
            return emptyList();
        }
        return socialNetworks.stream().map(DtoConverter::convert).collect(toList());
    }

    public static SocialNetworkAccountDto convert(SocialNetworkAccount socialNetworkAccount) {
        SocialNetworkAccountDto dto = new SocialNetworkAccountDto();
        dto.setId(socialNetworkAccount.getId());
        dto.setSocialNetwork(socialNetworkAccount.getSocialNetwork() != null ? socialNetworkAccount.getSocialNetwork().getId() : null);
        dto.setUrl(socialNetworkAccount.getUrl());
        dto.setDateDeleted(socialNetworkAccount.getDateDeleted());
        return dto;
    }

    public static SocialNetworkAccount convert(SocialNetworkAccountDto dto) {
        SocialNetworkAccount socialNetworkAccount = new SocialNetworkAccount();
        socialNetworkAccount.setId(dto.getId());
        if (dto.getSocialNetwork() != null && dto.getSocialNetwork() != 0) {
            SocialNetwork socialNetwork = new SocialNetwork();
            socialNetwork.setId(dto.getSocialNetwork());
            socialNetworkAccount.setSocialNetwork(socialNetwork);
        }
        socialNetworkAccount.setUrl(dto.getUrl());
        socialNetworkAccount.setDateDeleted(dto.getDateDeleted());
        return socialNetworkAccount;
    }

    public static Set<SocialNetworkAccountDto> convertSocialNetworkAccounts(Set<SocialNetworkAccount> socialNetworks) {
        if (isEmpty(socialNetworks)) {
            return emptySet();
        }
        return socialNetworks
            .stream()
            .filter(s -> s.getDateDeleted() == null)
            .map(DtoConverter::convert)
            .collect(toSet());
    }

    public static Set<SocialNetworkAccount> convertSocialNetworkAccountDtos(Set<SocialNetworkAccountDto> socialNetworks) {
        if (isEmpty(socialNetworks)) {
            return emptySet();
        }
        return socialNetworks
            .stream()
            .map(DtoConverter::convert)
            .collect(toSet());
    }


    public static WorkplaceDto convert(Workplace workplace) {
        WorkplaceDto dto = new WorkplaceDto();
        dto.setId(workplace.getId());
        dto.setName(workplace.getName());
        dto.setComment(workplace.getComment());
        dto.setPosition(workplace.getPosition());
        dto.setStartDate(workplace.getStartDate());
        dto.setEndDate(workplace.getEndDate());
        dto.setDateDeleted(workplace.getDateDeleted());
        return dto;
    }

    public static Workplace convert(WorkplaceDto dto) {
        Workplace workplace = new Workplace();
        workplace.setId(dto.getId());
        workplace.setName(dto.getName());
        workplace.setComment(dto.getComment());
        workplace.setPosition(dto.getPosition());
        workplace.setStartDate(dto.getStartDate());
        workplace.setEndDate(dto.getEndDate());
        workplace.setDateDeleted(dto.getDateDeleted());
        return workplace;
    }

    public static Set<WorkplaceDto> convertWorkplaces(Set<Workplace> workplaces) {
        if (isEmpty(workplaces)) {
            return emptySet();
        }
        return workplaces
            .stream()
            .filter(workplace -> workplace.getDateDeleted() == null)
            .map(DtoConverter::convert)
            .collect(toSet());
    }

    public static Set<Workplace> convertWorkplaceDtos(Set<WorkplaceDto> workplaces) {
        if (isEmpty(workplaces)) {
            return emptySet();
        }
        return workplaces
            .stream()
            .map(DtoConverter::convert)
            .collect(toSet());
    }

    public static Attachment convert(AttachmentDto dto) {
        Attachment attachment = new Attachment();
        attachment.setId(dto.getId());
        attachment.setName(dto.getName());
        attachment.setComment(dto.getComment());
        attachment.setDateUpload(dto.getDateUpload());
        attachment.setFilePath(dto.getFilePath());
        attachment.setDateDeleted(dto.getDateDeleted());
        return attachment;
    }

    public static AttachmentDto convert(Attachment attachment) {
        AttachmentDto dto = new AttachmentDto();
        dto.setId(attachment.getId());
        dto.setName(attachment.getName());
        dto.setComment(attachment.getComment());
        dto.setContactId(attachment.getContact().getId());
        dto.setDateUpload(attachment.getDateUpload());
        dto.setDateDeleted(attachment.getDateDeleted());
        return dto;
    }

    public static Set<AttachmentDto> convertAttachments(Set<Attachment> attachments) {
        if (CollectionUtils.isEmpty(attachments)) {
            return emptySet();
        }
        return attachments
            .stream()
            .filter(workplace -> workplace.getDateDeleted() == null)
            .map(DtoConverter::convert)
            .collect(toSet());
    }

    public static Set<Attachment> convertAttachmentDtos(Set<AttachmentDto> attachmentsDto) {
        if (CollectionUtils.isEmpty(attachmentsDto)) {
            return emptySet();
        }
        return attachmentsDto
            .stream()
            .map(DtoConverter::convert)
            .collect(toSet());
    }

    public static EmailTypeDto convert(EmailType type) {
        EmailTypeDto dto = new EmailTypeDto();
        dto.setName(type.name());
        dto.setValue(type.getValue());
        return dto;
    }

    public static List<EmailTypeDto> convertEmailTypes(EmailType[] types) {
        if (types.length == 0) {
            return emptyList();
        }
        return Arrays.asList(types)
            .stream()
            .map(DtoConverter::convert)
            .collect(toList());
    }


    public static TelephoneTypeDto convert(TelephoneType type) {
        TelephoneTypeDto dto = new TelephoneTypeDto();
        dto.setName(type.name());
        dto.setValue(type.getValue());
        return dto;
    }

    public static List<TelephoneTypeDto> convertTelephoneTypes(TelephoneType[] types) {
        if (types.length == 0) {
            return emptyList();
        }
        return Arrays.asList(types)
            .stream()
            .map(DtoConverter::convert)
            .collect(toList());
    }

    public static Skill convert(SkillDto dto) {
        Skill skill = new Skill();
        skill.setId(dto.getId());
        skill.setName(dto.getName());
        skill.setDateDeleted(dto.getDateDeleted());
        return skill;
    }

    public static SkillDto convert(Skill skill) {
        SkillDto dto = new SkillDto();
        dto.setId(skill.getId());
        dto.setName(skill.getName());
        dto.setDateDeleted(skill.getDateDeleted());
        return dto;
    }

    public static Set<SkillDto> convertSkills(Set<Skill> skills) {
        if (isEmpty(skills)) {
            return emptySet();
        }
        return skills
            .stream()
            .filter(skill -> skill.getDateDeleted() == null)
            .map(DtoConverter::convert)
            .collect(toSet());
    }

    public static Set<Skill> convertSkillDtos(Set<SkillDto> skills) {
        if (isEmpty(skills)) {
            return emptySet();
        }
        return skills
            .stream()
            .map(DtoConverter::convert)
            .collect(toSet());
    }

    private static VacancySkillDto convert(VacancySkill vacancySkill){
        VacancySkillDto vacancySkillDto = new VacancySkillDto();
        vacancySkillDto.setId(vacancySkill.getId());
        vacancySkillDto.setName(vacancySkill.getName());
        vacancySkillDto.setRequired((vacancySkill.getRequired()));
        vacancySkillDto.setVacancy(convertVacancyMainFields(vacancySkill.getVacancy()));
        return vacancySkillDto;
    }

    private static VacancySkill convert(VacancySkillDto vacancySkillDto){
        VacancySkill vacancySkill = new VacancySkill();
        vacancySkill.setId(vacancySkillDto.getId());
        vacancySkill.setName(vacancySkillDto.getName());
        vacancySkill.setRequired((vacancySkillDto.getRequired()));
        if (vacancySkillDto.getDateDeleted() != null) {
            vacancySkill.setDateDeleted(vacancySkillDto.getDateDeleted());
        }
        return vacancySkill;
    }

    private static Set<VacancySkillDto> convertVacancySkills(Set<VacancySkill> vacancySkills) {
        if (isEmpty(vacancySkills)) {
            return emptySet();
        }
        return vacancySkills
                .stream()
                .filter(vacancySkill -> vacancySkill.getDateDeleted() == null)
                .map(DtoConverter::convert)
                .collect(toSet());
    }

    private static Set<VacancySkill> convertVacancySkillDtos(Set<VacancySkillDto> vacancySkillDtos){
        if (isEmpty(vacancySkillDtos)) {
            return emptySet();
        }
        return vacancySkillDtos
                .stream()
                .map(DtoConverter::convert)
                .collect(toSet());
    }

    public static List<UniversityCertificateTypeDto> convertCertificateTypes(CertificateType[] types){
        if(types.length == 0){
            return emptyList();
        }
        return Arrays.asList(types)
            .stream()
            .map(DtoConverter::convert)
            .collect(toList());
    }

    public static UniversityCertificateTypeDto convert(CertificateType type){
        UniversityCertificateTypeDto dto = new UniversityCertificateTypeDto();
        dto.setName(type.name());
        dto.setValue(type.getValue());
        return dto;
    }

    public static UniversityEducationDto convert(UniversityEducation education){
        UniversityEducationDto dto = new UniversityEducationDto();
        dto.setId(education.getId());
        if (education.getStartDate() != null) {
            Calendar cal = Calendar.getInstance();
            cal.setTime(education.getStartDate());
            dto.setEndDate((education.getEndDate() ==  null) ? cal.get(Calendar.YEAR) + 4 : education.getEndDate());
        }
        dto.setStartDate(education.getStartDate());
        dto.setName(education.getName());
        dto.setSpeciality(education.getSpeciality());
        if (education.getType() != null) {
            dto.setType(education.getType().name());
        }
        dto.setDateDeleted(education.getDateDeleted());
        dto.setFaculty(StringUtils.isEmpty(education.getFaculty()) ? "" : education.getFaculty());
        return dto;
    }

    public static UniversityEducation convert(UniversityEducationDto dto){
        UniversityEducation education = new UniversityEducation();
        education.setId(dto.getId());
        education.setName(dto.getName());
        education.setStartDate(dto.getStartDate());
        education.setEndDate(dto.getEndDate());
        education.setSpeciality(dto.getSpeciality());
        education.setType(CertificateType.findByName(dto.getType()));
        education.setDateDeleted(dto.getDateDeleted());
        education.setFaculty(dto.getFaculty());
        return education;
    }

    public static ContactCommentDto convert(ContactComment comment){
        ContactCommentDto dto = new ContactCommentDto();
        dto.setId(comment.getId());
        dto.setDate(comment.getDateCreated());
        dto.setText(comment.getText());
        dto.setAuthor(comment.getAuthor().getFirstName() + " " + comment.getAuthor().getLastName());
        dto.setAuthorId(comment.getAuthor().getId());
        dto.setDateDeleted(comment.getDateDeleted());
        dto.setContact(comment.getContact().getFirstName() + " " + comment.getContact().getLastName());
        return dto;
    }

    public static ContactComment convert(ContactCommentDto dto){
        ContactComment comment = new ContactComment();
        comment.setId(dto.getId());
        if (comment.getId() == null) {
            comment.setDateCreated(new Date());
        }
        else {
            comment.setDateCreated(dto.getDate());
        }

        comment.setDateDeleted(dto.getDateDeleted());
        comment.setText(dto.getText());
        Contact author = new Contact();
        author.setId(dto.getAuthorId());
        comment.setAuthor(author);

        return comment;
    }

    public static Set<UniversityEducationDto> convertUniversityEducations(Set<UniversityEducation> educations){
        if(isEmpty(educations)){
            return emptySet();
        }
        return educations
            .stream()
            .filter(education -> education.getDateDeleted() == null)
            .map(DtoConverter::convert)
            .collect(toSet());
    }

    public static Set<UniversityEducation> convertUnivercityEducationDtos(Set<UniversityEducationDto> educations){
        if(isEmpty(educations)){
            return emptySet();
        }
        return educations.stream().map(DtoConverter::convert).collect(toSet());
    }

    public static Set<ContactCommentDto> convertContactComments(Set<ContactComment> comments){
        if(isEmpty(comments)){
            return emptySet();
        }
        return comments
                .stream()
                .filter(comment -> comment.getDateDeleted() == null)
                .map(DtoConverter::convert)
                .collect(toSet());
    }

    public static List<ContactCommentDto> convertContactCommentList(List<ContactComment> comments){
        if(isEmpty(comments)){
            return emptyList();
        }
        return comments
                .stream()
                .filter(comment -> comment.getDateDeleted() == null)
                .map(DtoConverter::convert)
                .collect(toList());
    }

    public static Set<ContactComment> convertContactComentDtos(Set<ContactCommentDto> comments){
        if(isEmpty(comments)){
            return emptySet();
        }
        return comments
                .stream()
                .map(DtoConverter::convert)
                .collect(toSet());
    }

    public static TaskCommentDto convert(TaskComment comment) {
        TaskCommentDto dto = new TaskCommentDto();
        dto.setId(comment.getId());
        dto.setDateCreated(comment.getDateCreated());
        dto.setCommentAuthorId(comment.getCommentAuthorId());
        dto.setTaskId(comment.getTask().getId());
        dto.setText(comment.getText());
        return dto;
    }

    public static TaskComment convert(TaskCommentDto commentDto) {
        TaskComment comment = new TaskComment();
        comment.setId(commentDto.getId());
        comment.setDateCreated(commentDto.getDateCreated());
        comment.setTask(new Task());
        comment.getTask().setId(commentDto.getTaskId());
        comment.setCommentAuthorId(commentDto.getCommentAuthorId());
        comment.setText(commentDto.getText());
        return comment;
    }

    public static List<TaskCommentDto> convertTaskComments(List<TaskComment> taskComments) {
        if(isEmpty(taskComments)) {
            return emptyList();
        }
        return taskComments
                .stream()
                .filter(comment -> comment.getDateDeleted() == null)
                .map(DtoConverter::convert)
                .collect(Collectors.toList());
    }

    public static List<NationalityDto> convertNationalities(List<Nationality> nationalities) {
        if (isEmpty(nationalities)) {
            return emptyList();
        }
        return nationalities.stream().map(DtoConverter::convert).collect(toList());
    }

    public static NationalityDto convert(Nationality nationality) {
        NationalityDto dto = new NationalityDto();
        dto.setId(nationality.getId());
        dto.setName(nationality.getName());
        return dto;
    }

    public static Nationality convert(NationalityDto dto) {
        Nationality nationality = new Nationality();
        nationality.setId(dto.getId());
        nationality.setName(dto.getName());
        return nationality;
    }

    public static List<FileTypeDto> convertFileTypes(FileType[] types){
        if(types.length == 0){
            return emptyList();
        }
        return Arrays.asList(types)
                .stream()
                .map(DtoConverter::convert)
                .collect(toList());
    }

    public static FileTypeDto convert(FileType type){
        FileTypeDto dto = new FileTypeDto();
        dto.setName(type.name());
        dto.setValue(type.getValue());
        return dto;
    }



}
