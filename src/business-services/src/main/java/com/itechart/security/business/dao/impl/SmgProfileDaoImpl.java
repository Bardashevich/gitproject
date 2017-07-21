package com.itechart.security.business.dao.impl;

import com.itechart.common.dao.impl.BaseHibernateDao;
import com.itechart.common.model.filter.PagingFilter;
import com.itechart.security.business.dao.SmgProfileDao;
import com.itechart.security.business.model.persistent.SmgProfileShortDetails;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;

@Repository
public class SmgProfileDaoImpl extends BaseHibernateDao<SmgProfileShortDetails, Long, PagingFilter> implements SmgProfileDao {

    @Override
    public Integer getProfileIdByDomenName(String domenName) {
        String sql = "SELECT `smg_profile`.id FROM `smg_profile` " +
                "WHERE `smg_profile`.domen_name = (:domen_name)";
        Query query = getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql)
                .setParameter("domen_name", domenName);
        return (query.uniqueResult() != null) ? ((Number) query.uniqueResult()).intValue() : null;
    }
}
