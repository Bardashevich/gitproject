package com.itechart.security.business.dao;

import com.itechart.common.dao.BaseDao;
import com.itechart.common.model.filter.PagingFilter;
import com.itechart.security.business.filter.ContactFilter;
import com.itechart.security.business.model.persistent.Contact;
import com.itechart.security.business.model.persistent.ContactComment;

import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * Created by siarhei.rudzevich on 1/11/2017.
 */
public interface ContactCommentDao extends BaseDao<ContactComment, Long, PagingFilter> {

    List<ContactComment> getCommentByContactIdBy(Long contactId, ContactFilter filter);

    List<ContactComment> getUnreadCommentsByFilter(Contact contact, ContactFilter filter);

    Integer getCountCommentByContactId(Long contactId);

    Integer getCountUnreadStudentsComments (Date readingMessagesDate);

}
