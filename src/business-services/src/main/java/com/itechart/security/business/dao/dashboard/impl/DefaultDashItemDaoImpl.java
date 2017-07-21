package com.itechart.security.business.dao.dashboard.impl;

import com.itechart.common.dao.impl.BaseHibernateDao;
import com.itechart.common.model.filter.PagingFilter;
import com.itechart.security.business.dao.dashboard.DefaultDashItemDao;
import com.itechart.security.business.model.persistent.dashboard.DefaultDashItem;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by artsiom.marenau on 12/26/2016.
 */
@Repository
public class DefaultDashItemDaoImpl extends BaseHibernateDao<DefaultDashItem,Long,PagingFilter> implements DefaultDashItemDao {
    @Override
    public List<DefaultDashItem> listDefaultDashProperties(List<Long> roleIds){
        return getSessionFactory().getCurrentSession().
                createSQLQuery("SELECT * FROM def_dash_item WHERE role_id in(:ids) group by dash_item_id").
                addEntity(DefaultDashItem.class).
                setParameterList("ids",roleIds).list();
    }
}
