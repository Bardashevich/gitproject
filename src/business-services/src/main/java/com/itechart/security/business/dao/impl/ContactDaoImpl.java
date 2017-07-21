package com.itechart.security.business.dao.impl;

import com.itechart.common.dao.impl.BaseHibernateDao;
import com.itechart.security.business.dao.ContactDao;
import com.itechart.security.business.filter.ContactFilter;
import com.itechart.security.business.model.persistent.Contact;
import com.itechart.security.business.model.persistent.Skill;
import com.itechart.security.core.annotation.AclFilter;
import com.itechart.security.core.annotation.AclFilterRule;
import com.itechart.security.core.model.acl.Permission;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.sql.JoinType;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.hibernate.criterion.MatchMode.ANYWHERE;
import static org.hibernate.criterion.Restrictions.disjunction;
import static org.hibernate.criterion.Restrictions.ilike;

/**
 * @author andrei.samarou
 */
@Repository
public class ContactDaoImpl extends BaseHibernateDao<Contact, Long, ContactFilter> implements ContactDao {

    @AclFilter(@AclFilterRule(type = Contact.class, permissions = {Permission.READ}))
    public Contact get(Long id) {
        return super.get(id);
    }

    @Override
    @AclFilter(@AclFilterRule(type = Contact.class, permissions = {Permission.READ}))
    public Contact getByEmail(String email){
        List<?> result = getHibernateTemplate().find("from Contact c JOIN FETCH c.emails e where e.name is not null and e.name = ?", email);
        return !result.isEmpty() ? (Contact) result.get(0) : null;
    }

    @Override
    public List<Contact> getByUserId(List<Long> userIds) {
        if (!CollectionUtils.isEmpty(userIds)) {
            String sql = "SELECT * FROM contact WHERE contact.user_id in (:user_ids) AND ISNULL(contact.date_deleted)";
            Query query = getSessionFactory()
                    .getCurrentSession()
                    .createSQLQuery(sql)
                    .addEntity(Contact.class)
                    .setParameterList("user_ids", userIds);
            return query.list();
        } else {
            return Collections.emptyList();
        }
    }

    @Override
    public List<Contact> getByContactId(List<Long> contactIds) {
        if (!CollectionUtils.isEmpty(contactIds)) {
            String sql = "SELECT * FROM contact WHERE contact.id in (:ids) AND ISNULL(contact.date_deleted)";
            Query query = getSessionFactory()
                    .getCurrentSession()
                    .createSQLQuery(sql)
                    .addEntity(Contact.class)
                    .setParameterList("ids", contactIds);
            return query.list();
        } else {
            return Collections.emptyList();
        }
    }

    @Override
    public List<Contact> getContactByGroupName(ContactFilter filter) {
        String sql;
        if (filter.isSortAsc()) {
            sql = "SELECT `contact`.* FROM `contact` " +
                    "JOIN `acl_object_identity` on `acl_object_identity`.object_id = `contact`.id " +
                    "JOIN `acl_entry` on `acl_entry`.object_identity_id = `acl_object_identity`.id " +
                    "JOIN `group` on `group`.id = `acl_entry`.principal_id " +
                    "WHERE `group`.name = (:group_name) AND ISNULL(contact.date_deleted) ORDER BY `contact`.firstName, `contact`.lastName";
        } else {
            sql = "SELECT `contact`.* FROM `contact` " +
                    "JOIN `acl_object_identity` on `acl_object_identity`.object_id = `contact`.id " +
                    "JOIN `acl_entry` on `acl_entry`.object_identity_id = `acl_object_identity`.id "+
                    "JOIN `group` on `group`.id = `acl_entry`.principal_id " +
                    "WHERE `group`.name = (:group_name) AND ISNULL(contact.date_deleted) ORDER BY `contact`.firstName DESC, `contact`.lastName DESC";
        }
       Query query = getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql)
                .addEntity(Contact.class)
                .setParameter("group_name", filter.getGroup()).setFirstResult(filter.getFrom()).setMaxResults(filter.getCount());
        return query.list();
    }


    @Override
    public Contact getByUserId(Long userId) {
        List<?> result = find("from Contact c where c.userId is not null and c.userId=?", userId);
        return !result.isEmpty() ? (Contact) result.get(0) : null;
    }

    @Override
    public Contact getContactById(Long id) {
        List<?> result = find("from Contact c where c.id is not null and c.id=?", id);
        return !result.isEmpty() ? (Contact) result.get(0) : null;
    }

    public Contact getByLinkedInId(Long linkedInId){
        List<?> result = find("from Contact c where c.linkedInId is not null and c.linkedInId=?", linkedInId);
        return !result.isEmpty() ? (Contact) result.get(0) : null;
    }

    @AclFilter(@AclFilterRule(type = Contact.class, permissions = {Permission.READ}))
    public List<Contact> find(ContactFilter filter) {
        return super.find(filter);
    }

    @AclFilter(@AclFilterRule(type = Contact.class, permissions = {Permission.READ}))
    public int count(ContactFilter filter) {
        return super.count(filter);
    }

    @Override
    public void delete(Long id) {
        Contact contact = getHibernateTemplate().get(Contact.class, id);
        if (contact != null) {
            contact.setDateDeleted(new Date());
            update(contact);
        }
    }

    @Override
    @AclFilter(@AclFilterRule(type = Contact.class, permissions = {Permission.READ}))
    public void deleteSkill(Long id) {
        Skill skill = getHibernateTemplate().get(Skill.class, id);
        if (skill != null) {
            skill.setDateDeleted(new Date());
            getHibernateTemplate().update(skill);
        }
    }

    @Override
    protected Criteria createFilterCriteria(Session session, ContactFilter filter) {
        Criteria criteria = session.createCriteria(Contact.class, "u");
        if (StringUtils.hasText(filter.getText())) {
            criteria.createAlias("emails", "e", JoinType.LEFT_OUTER_JOIN)
                    .createAlias("addresses", "a", JoinType.LEFT_OUTER_JOIN)
                    .add(disjunction(
                            ilike("a.addressLine", filter.getText(), ANYWHERE),
                            ilike("u.firstName", filter.getText(), ANYWHERE),
                            ilike("u.lastName", filter.getText(), ANYWHERE),
                            ilike("e.name", filter.getText(), ANYWHERE)
                    ));
        }
        return criteria;
    }

    @Override
    public void incCountUnreadComments() {
        String sql = "UPDATE `contact` " +
                    "JOIN `user` on `contact`.user_id = `user`.id " +
                    "JOIN `user_role` on `user`.id = `user_role`.user_id "+
                    "JOIN `role` on `role`.id = `user_role`.role_id " +
                    "SET `contact`.count_unread_comments = `contact`.count_unread_comments + 1 " +
                    "WHERE `role`.name in ('HR','DEPARTMENT_MANAGER','TUTOR') AND `contact`.id > 0";
        Query query = getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql);
        Integer countRowUpdate = query.executeUpdate();
    }
}
