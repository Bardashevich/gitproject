package com.itechart.security.web.service;

import com.itechart.security.model.dto.SecuredGroupDto;
import com.itechart.security.model.dto.SecuredUserDto;
import com.itechart.security.model.dto.UserDefaultAclEntryDto;
import com.itechart.security.web.model.dto.SmgProfileDto;

import java.util.Set;

public interface CrmEditorService {

    void exportProfileToCrm(String pass, SmgProfileDto profile, SecuredGroupDto department);

    SecuredGroupDto initExecutivesGroup();

    SecuredUserDto saveUser(SmgProfileDto profile, SecuredGroupDto department, Set<UserDefaultAclEntryDto> newAcls, String pass);

    Long saveContact(SmgProfileDto profile, Long userId);

    SecuredUserDto createUserForSaving(SmgProfileDto profile, SecuredGroupDto department, Set<UserDefaultAclEntryDto> newAcls);

    Set<UserDefaultAclEntryDto> createAcls(SmgProfileDto profile, SecuredGroupDto department);
}
