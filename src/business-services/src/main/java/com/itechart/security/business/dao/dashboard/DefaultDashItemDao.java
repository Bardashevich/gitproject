package com.itechart.security.business.dao.dashboard;

import com.itechart.common.dao.BaseDao;
import com.itechart.common.model.filter.PagingFilter;
import com.itechart.security.business.model.persistent.dashboard.DefaultDashItem;

import java.util.List;

/**
 * Created by artsiom.marenau on 12/26/2016.
 */
public interface DefaultDashItemDao extends BaseDao<DefaultDashItem,Long,PagingFilter> {
    List<DefaultDashItem> listDefaultDashProperties(List<Long> roleIds);
}
