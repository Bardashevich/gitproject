package com.itechart.security.business.dao.impl;

import com.itechart.common.dao.impl.BaseHibernateDao;
import com.itechart.common.model.filter.PagingFilter;
import com.itechart.security.business.dao.ContactCommentDao;
import com.itechart.security.business.filter.ContactFilter;
import com.itechart.security.business.model.persistent.Contact;
import com.itechart.security.business.model.persistent.ContactComment;
import com.itechart.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;
import org.hibernate.Query;
import org.hibernate.Session;

import java.util.*;

/**
 * Created by siarhei.rudzevich on 1/11/2017.
 */
@Repository
public class ContactCommentDaoImpl extends BaseHibernateDao<ContactComment, Long, PagingFilter> implements ContactCommentDao {

    @Override
    public List<ContactComment> getCommentByContactIdBy(Long contactId, ContactFilter filter) {
        String sql;
        if (filter.isSortAsc()) {
            sql = "SELECT `contact_comment`.* FROM `contact_comment`  WHERE `contact_comment`.contact_id = (:contact_id) AND ISNULL(contact_comment.deleted) ORDER BY `contact_comment`.created";
        } else {
            sql = "SELECT `contact_comment`.* FROM `contact_comment`  WHERE `contact_comment`.contact_id = (:contact_id) AND ISNULL(contact_comment.deleted) ORDER BY `contact_comment`.created DESC";
        }
        Query query = getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql)
                .addEntity(ContactComment.class)
                .setParameter("contact_id", contactId).setFirstResult(filter.getFrom()).setMaxResults(filter.getCount());
        return query.list();
    }

    @Override
    public List<ContactComment> getUnreadCommentsByFilter(Contact contact, ContactFilter filter) {

        String sql = "SELECT `contact_comment`.* FROM `contact_comment` " +
                    "JOIN `contact` on `contact`.id = `contact_comment`.contact_id  " +
                    "JOIN `acl_object_identity` on `acl_object_identity`.object_id = `contact`.id " +
                    "JOIN `acl_entry` on `acl_entry`.object_identity_id = `acl_object_identity`.id " +
                    "JOIN `group` on `group`.id = `acl_entry`.principal_id " +
                    "WHERE `group`.name = (:group) AND ((`contact_comment`.created > (:reading_messages_date)) AND ((:reading_messages_date) IS NOT NULL)) AND ISNULL(contact.date_deleted)  ORDER BY `contact_comment`.created DESC";
        Query query = getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql)
                .addEntity(ContactComment.class)
                .setParameter("reading_messages_date", contact.getReadingCommentsDate()).setParameter("group", filter.getGroup()).setFirstResult(filter.getFrom()).setMaxResults(filter.getCount());
        return query.list();
    }

    @Override
    public Integer getCountCommentByContactId(Long contactId) {

        String sql = "SELECT COUNT(`contact_comment`.id) FROM `contact_comment` WHERE `contact_comment`.`contact_id` = (:contact_id) AND ISNULL(contact_comment.deleted)";
        Query query = getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql)
                .setParameter("contact_id", contactId);
        return ((Number) query.uniqueResult()).intValue();
    }

    @Override
    public Integer getCountUnreadStudentsComments(Date readingMessagesDate) {
        String sql = "SELECT COUNT(`contact_comment`.id) FROM `contact_comment` " +
                    "JOIN `contact` on `contact`.id = `contact_comment`.contact_id  " +
                    "JOIN `acl_object_identity` on `acl_object_identity`.object_id = `contact`.id " +
                    "JOIN `acl_entry` on `acl_entry`.object_identity_id = `acl_object_identity`.id " +
                    "JOIN `group` on `group`.id = `acl_entry`.principal_id " +
                    "WHERE `group`.name = 'students' AND ((`contact_comment`.created > (:reading_messages_date)) OR  ((:reading_messages_date) IS NULL)) AND ISNULL(contact.date_deleted)";
        Query query = getSessionFactory()
                    .getCurrentSession()
                    .createSQLQuery(sql)
                    .setParameter("reading_messages_date", readingMessagesDate);
        return ((Number) query.uniqueResult()).intValue();
    }


}
