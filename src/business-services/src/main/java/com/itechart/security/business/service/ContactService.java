package com.itechart.security.business.service;



import com.itechart.security.business.filter.ContactFilter;
import com.itechart.security.business.model.dto.ContactCommentDto;
import com.itechart.security.business.model.dto.ContactDto;
import com.itechart.security.business.model.dto.NationalityDto;
import com.itechart.security.model.dto.SecuredUserDto;

import java.util.List;

/**
 * @author andrei.samarou
 */
public interface ContactService {

    List<ContactDto> findContacts(ContactFilter filter);

    List<ContactDto> getContactsByUserGroup(String userGroupName);

    List<ContactDto> getContactsByUserGroupByFilter(ContactFilter filter);

    List<ContactCommentDto> getCommentsByContactIdByFilter(Long contactId, ContactFilter filter);

    List<ContactCommentDto> getUnreadCommentsByFilter(ContactFilter filter);

    Integer getCountStudentsByFilter (ContactFilter filter);

    Integer getCountCommentsByContactIdByFilter (Long contactId, ContactFilter filter);

    Integer getCountUnreadComments ();

    Long saveContact(ContactDto contact);

    ContactDto get(Long id);

    ContactDto getContactById(Long id);

    ContactDto getCurrentUserContact();

    ContactDto getByUserId(Long id);

    List <NationalityDto> getNationalities();

    ContactDto getByEmail(String email);

    void updateContact(ContactDto contact);

    Long saveContactBySmgData(ContactDto contact);

    void setCountUnreadCommentsInZero();

    void addComment(ContactDto contact);

    void deleteById(Long id);

    void deleteEmail(Long id);

    void deleteLanguage(Long id);

    void deleteAddress(Long id);

    void deleteMessengerAccount(Long id);

    void deleteSocialNetworkAccount(Long id);

    void deleteTelephone(Long id);

    void deleteWorkplace(Long id);

    void deleteAttachment(Long id);

    void deleteSkill(Long id);

    int countContacts(ContactFilter filter);

    void deleteUniversityEducation(Long id);

    void saveContactHistory(Long contactId, boolean isNewContact);

    List<ContactDto> getContactList();

    Long createContactFromUser(SecuredUserDto dto, Long userId);
}
