package com.itechart.security.dao.impl;

import com.itechart.security.dao.AclEntryDao;
import com.itechart.security.model.persistent.acl.AclEntry;
import org.springframework.stereotype.Repository;
import org.hibernate.Query;
import java.util.List;

/**
 * Created by siarhei.rudzevich on 1/12/2017.
 */
@Repository
public class AclEntryDaoImpl extends BaseHibernateDao<AclEntry> implements AclEntryDao {

    @Override
    public List<Long> findContactIds(Long groupId, Integer pageNumber, Integer pageSize) {
        String sql = "SELECT `acl_entry`.`object_identity_id` FROM `acl_entry` WHERE `acl_entry`.`principal_id` = (:group_id)";
        Query query = getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql)
                .setParameter("group_id", groupId).setFirstResult(pageNumber).setMaxResults(pageSize);
        return query.list();
    }

    @Override
    public Integer count(Long groupId) {
        String sql = "SELECT COUNT(`acl_entry`.`object_identity_id`) FROM `acl_entry` WHERE `acl_entry`.`principal_id` = (:group_id)";
        Query query = getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql)
                .setParameter("group_id", groupId);
        List<String> countList = query.list();
        String number = countList.toString();
        number = number.replaceAll("\\D", "");
        Integer countContact  = Integer.parseInt(number);
        return countContact;
    }
}
