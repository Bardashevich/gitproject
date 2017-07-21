package com.itechart.security.business.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
public class ContactDto {
    private Long id;

    private String firstNameEn;

    private String lastNameEn;

    private String firstName;

    private String lastName;

    private String patronymic;

    private Date dateOfBirth;

    private Boolean isMale;

    private String nationality;

    private String photoUrl;

    private String industry;

    private String position;

    private Long linkedInId;

    private Set<OrderDto> orders;

    private Set<MessengerAccountDto> messengers;

    private Set<SocialNetworkAccountDto> socialNetworks;

    private Set<TelephoneDto> telephones;

    private Set<AddressDto> addresses;

    private Set<WorkplaceDto> workplaces;

    private Set<EmailDto> emails;

    private Set<AttachmentDto> attachments;

    private Set<SkillDto> skills;

    private HistoryEntryDto history;

    private Set<UniversityEducationDto> educations;

    private Set<ContactCommentDto> comments;

    private Set<LanguageDto> languages;

    private Long userId;

    private Date readingCommentsDate;

    private Integer countUnreadComments;
}
