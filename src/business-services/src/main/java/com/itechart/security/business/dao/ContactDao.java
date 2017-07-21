package com.itechart.security.business.dao;

import com.itechart.common.dao.BaseDao;
import com.itechart.security.business.filter.ContactFilter;
import com.itechart.security.business.model.persistent.Contact;

import java.util.List;

/**
 * @author andrei.samarou
 */
public interface ContactDao extends BaseDao<Contact, Long, ContactFilter> {

    List<Contact> getByUserId(List<Long> userId);

    List<Contact> getByContactId(List<Long> contactId);

    List<Contact> getContactByGroupName(ContactFilter filter);

    Contact getByUserId(Long userId);

    Contact getContactById(Long Id);

    void deleteSkill(Long id);

    Contact getByEmail(String email);

    Contact getByLinkedInId(Long linkedInId);

    void incCountUnreadComments ();
}
