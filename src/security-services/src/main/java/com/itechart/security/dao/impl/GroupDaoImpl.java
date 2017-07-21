package com.itechart.security.dao.impl;

import com.itechart.security.dao.GroupDao;
import com.itechart.security.model.persistent.Group;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;

/**
 * @author yauheni.putsykovich
 */
@Repository
public class GroupDaoImpl extends BaseHibernateDao<Group> implements GroupDao {

    @Override
    public void deleteById(Long id) {
        // used native sql to prevent from cascade delete from table "principals"
        // this function is performed by trigger
        getHibernateTemplate().executeWithNativeSession(session ->
                session.createSQLQuery("delete from `group` where id = :id")
                        .setLong("id", id)
                        .executeUpdate());
    }

    @Override
    public List<Long> getUserIdsByGroupName(String userGroupName) {
        String sql = "SELECT `user_group`.user_id FROM `group` JOIN user_group on `group`.id = group_id WHERE `group`.`name` = (:user_group)";
        Query query = getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql)
                .setParameter("user_group", userGroupName);
        return query.list();
//            return Collections.emptyList();
    }

    @Override
    public Long getIdByGroupName(String groupName) {
        String sql = "SELECT `group`.id FROM `group` WHERE `group`.`name` = (:group_name) ";
        Query query = getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql)
                .setParameter("group_name", groupName);
        List<String> listId = query.list();
        String stringId = listId.toString();
        stringId = stringId.replaceAll("\\D", "");
        Long id  = Long.parseLong(stringId);
        return id;
    }
}
