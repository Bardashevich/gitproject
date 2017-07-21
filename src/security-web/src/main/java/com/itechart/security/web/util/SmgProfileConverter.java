package com.itechart.security.web.util;

import com.itechart.security.model.dto.SecuredGroupDto;
import com.itechart.security.model.dto.UserDefaultAclEntryDto;

/**
 * Created by siarhei.rudzevich on 2/16/2017.
 */
public class SmgProfileConverter {

    public static UserDefaultAclEntryDto convertToAcl(Boolean isAdmin, SecuredGroupDto securedGroupDto) {
        UserDefaultAclEntryDto acl = new UserDefaultAclEntryDto();
        acl.setPrincipalId(securedGroupDto.getId());
        acl.setPrincipalTypeName("group");
        acl.setName(securedGroupDto.getName());
        acl.setCanAdmin(isAdmin);
        acl.setCanRead(!isAdmin);
        acl.setCanDelete(false);
        acl.setCanWrite(false);
        acl.setCanCreate(false);
        return acl;
    }



}
