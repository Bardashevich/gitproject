package com.itechart.security.dao;

import com.itechart.security.model.persistent.acl.AclEntry;

import java.util.List;

/**
 * Created by siarhei.rudzevich on 1/12/2017.
 */
public interface AclEntryDao extends BaseDao<AclEntry> {
    List<Long> findContactIds(Long groupId, Integer pageNumber, Integer pageSize);

    Integer count(Long groupId);
}
