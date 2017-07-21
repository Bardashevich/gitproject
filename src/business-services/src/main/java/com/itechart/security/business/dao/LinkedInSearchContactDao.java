package com.itechart.security.business.dao;

import com.itechart.security.business.model.persistent.linkedin.LinkedInSearchContact;

/**
 * Created by pavel.urban on 11/17/2016.
 */
public interface LinkedInSearchContactDao {
    Long saveLinkedInSearchContact(LinkedInSearchContact contact);

    LinkedInSearchContact get(long id);
}
