package com.itechart.security.business.dao;

import com.itechart.common.dao.BaseDao;
import com.itechart.common.model.filter.PagingFilter;
import com.itechart.security.business.model.persistent.SmgProfileShortDetails;
import org.springframework.stereotype.Repository;

/**
 * @author siarhei.rudzevich
 */
@Repository
public interface SmgProfileDao extends BaseDao<SmgProfileShortDetails, Long, PagingFilter> {

    Integer getProfileIdByDomenName (String domenName);
}
