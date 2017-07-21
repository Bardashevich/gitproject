package com.itechart.security.business.dao.dashboard;

import com.itechart.common.dao.BaseDao;
import com.itechart.common.model.filter.PagingFilter;
import com.itechart.security.business.model.persistent.dashboard.CustomDashItem;

import java.util.List;

/**
 * Created by artsiom.marenau on 12/26/2016.
 */
public interface CustomDashItemDao extends BaseDao<CustomDashItem,Long,PagingFilter> {
    List<CustomDashItem> listCustomItems(Long id);

    void saveUpdateCustomProperty(CustomDashItem customProp);

    CustomDashItem getCustomDashItem(Long userId, Long dashItemId);
}
