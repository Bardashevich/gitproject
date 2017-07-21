package com.itechart.security.business.dao.dashboard.impl;

import com.itechart.common.dao.impl.BaseHibernateDao;
import com.itechart.common.model.filter.PagingFilter;
import com.itechart.security.business.dao.dashboard.CustomDashItemDao;
import com.itechart.security.business.model.persistent.dashboard.CustomDashItem;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by artsiom.marenau on 12/26/2016.
 */
@Repository
public class CustomDashItemDaoImpl extends BaseHibernateDao<CustomDashItem,Long,PagingFilter> implements CustomDashItemDao {

    @Override
    public List<CustomDashItem> listCustomItems(Long id){
        return getSessionFactory().
                getCurrentSession().
                createSQLQuery("SELECT * FROM custom_dash_item_prop WHERE user_id = :id").
                addEntity(CustomDashItem.class).
                setParameter("id",id).list();
    }

    @Override
    public CustomDashItem getCustomDashItem(Long userId, Long dashItemId){
        Query query = getSessionFactory().getCurrentSession().createQuery("from CustomDashItem e where e.userId=? and e.dashItem.id=?");
        query.setParameter(0,userId);
        query.setParameter(1,dashItemId);
        return (CustomDashItem)query.uniqueResult();
    }

    @Override
    public void saveUpdateCustomProperty(CustomDashItem customProp){
        getSessionFactory().getCurrentSession().saveOrUpdate(customProp);
    }
}
