package com.itechart.security.dao;

import com.itechart.security.model.persistent.Group;

import java.util.List;

/**
 * @author yauheni.putsykovich
 */
public interface GroupDao extends BaseDao<Group> {
    List<Long> getUserIdsByGroupName(String userGroupName);
    Long getIdByGroupName(String groupName);
}
