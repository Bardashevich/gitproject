package com.itechart.security.business.dao.impl;

import com.itechart.common.dao.impl.BaseHibernateDao;
import com.itechart.security.business.dao.LinkedInSearchContactDao;
import com.itechart.security.business.filter.LinkedInSearchContactFilrer;
import com.itechart.security.business.model.persistent.Contact;
import com.itechart.security.business.model.persistent.linkedin.LinkedInSearchContact;
import com.itechart.security.business.service.impl.ContactServiceImpl;
import com.itechart.security.core.annotation.AclFilter;
import com.itechart.security.core.annotation.AclFilterRule;
import com.itechart.security.core.model.acl.Permission;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by pavel.urban on 11/17/2016.
 */

@Repository
public class LinkedInSearchContactDaoImpl extends BaseHibernateDao<LinkedInSearchContact, Long, LinkedInSearchContactFilrer> implements LinkedInSearchContactDao {
    @Transactional
    public Long saveLinkedInSearchContact(LinkedInSearchContact contact){
        LinkedInSearchContact existsContact = getLinkedInSearchContact(contact);
        return (existsContact == null) ? save(contact) : existsContact.getId();
    }

    @AclFilter(@AclFilterRule(type = LinkedInSearchContact.class, permissions = {Permission.READ}))
    public LinkedInSearchContact getLinkedInSearchContact(LinkedInSearchContact contact){
        List<?> result = getHibernateTemplate().find("from LinkedInSearchContact c where c.linkedinId = ? and c.position = ? and c.location = ? and c.industry = ?"
                ,contact.getLinkedinId()
                ,contact.getPosition()
                ,contact.getLocation()
                ,contact.getIndustry()
        );
        return !result.isEmpty() ? (LinkedInSearchContact) result.get(0) : null;
    }

    public LinkedInSearchContact get(long id){
        return super.get(id);
    }
}
