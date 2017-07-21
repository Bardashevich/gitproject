package com.itechart.security.web.service.impl;

import com.itechart.security.business.model.dto.ContactDto;
import com.itechart.security.business.service.ContactService;
import com.itechart.security.model.dto.RoleDto;
import com.itechart.security.model.dto.SecuredGroupDto;
import com.itechart.security.model.dto.SecuredUserDto;
import com.itechart.security.model.dto.UserDefaultAclEntryDto;
import com.itechart.security.service.GroupService;
import com.itechart.security.service.RoleService;
import com.itechart.security.service.UserService;
import com.itechart.security.web.model.dto.SmgProfileDto;
import com.itechart.security.web.service.CrmEditorService;
import com.itechart.security.web.util.ScrapperUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static com.itechart.security.web.util.ScrapperUtils.getDepartmentManeger;
import static com.itechart.security.web.util.ScrapperUtils.getHR;
import static com.itechart.security.web.util.ScrapperUtils.getManagerOrSpecialistFromList;
import static com.itechart.security.web.util.SmgProfileConverter.convertToAcl;
import static org.springframework.util.StringUtils.isEmpty;

@Service
public class CrmEditorServiceImpl implements CrmEditorService {

    private static final Logger log = LoggerFactory.getLogger(CrmEditorServiceImpl.class);

    @Autowired
    private UserService userService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private ContactService contactService;


    @Override
    public void exportProfileToCrm(String pass, SmgProfileDto profile, SecuredGroupDto department) {
        if (!isEmpty(profile.getDomenName())) {
            SecuredUserDto user;
            Set<UserDefaultAclEntryDto> newAcls = createAcls(profile, department);
            log.info("creating contact and user in CRM with userName {}", profile.getDomenName());
            user = saveUser(profile, department, newAcls, pass);
            saveContact(profile, user.getId());
            if (profile.isDepartmentManager()) {
                department.setManager(user);
            }
        }
    }

    @Override
    public SecuredGroupDto initExecutivesGroup() {
        List<SecuredGroupDto> oldGroups = groupService.getGroups();
        SecuredGroupDto group = new SecuredGroupDto();
        group.setName("DEPARTMENT_MANAGERs");
        group.setDescription("Administration of iTechArt");
        Long id = ScrapperUtils.getIdOfGroupFromList(oldGroups, group);
        if (id == null) {
            groupService.create(group);
            oldGroups = groupService.getGroups();
            for (SecuredGroupDto newGroup : oldGroups) {
                if (newGroup.getName().equals(group.getName())) {
                    id = newGroup.getId();
                }
            }
        }
        group.setId(id);
        return group;
    }

    @Override
    public SecuredUserDto saveUser(SmgProfileDto profile, SecuredGroupDto department, Set<UserDefaultAclEntryDto> newAcls, String pass) {
        SecuredUserDto user = createUserForSaving(profile, department, newAcls);
        user.setPassword(pass);
        Long userId = userService.createUser(user);
        user.setId(userId);
        return user;
    }

    @Override
    public Long saveContact(SmgProfileDto profile, Long userId) {
        ContactDto contact = profile.convertToContact();
        contact.setUserId(userId);
        return contactService.saveContactBySmgData(contact);
    }

    @Override
    public SecuredUserDto createUserForSaving(SmgProfileDto profile, SecuredGroupDto department, Set<UserDefaultAclEntryDto> newAcls) {
        SecuredUserDto user = profile.convertToUser();
        List<UserDefaultAclEntryDto>  aclList = new ArrayList<>();
        for (UserDefaultAclEntryDto acl : newAcls) {
            aclList.add(acl);
        }
        user.setAcls(aclList);
        Set<SecuredGroupDto> groups = user.getGroups();
        Set<RoleDto> userRoles = user.getRoles();
        Boolean isDepartmentManager = profile.isDepartmentManager();
        Boolean isManager = profile.isManager();
        Boolean isHr = profile.isHR();
        groups.add(department);
        List<RoleDto> rolesDto = roleService.getRoles();
        if (isDepartmentManager) {
            groups.add(initExecutivesGroup());
            userRoles.add(getDepartmentManeger(isDepartmentManager, rolesDto));
        }
        if (isHr) {
            userRoles.add(getHR(isHr, rolesDto));
        }
        userRoles.add(getManagerOrSpecialistFromList(isManager, rolesDto));
        return user;
    }

    @Override
    public Set<UserDefaultAclEntryDto> createAcls(SmgProfileDto profile, SecuredGroupDto department) {
        Set<UserDefaultAclEntryDto> acls = new HashSet<>();
        Boolean isDepartmentManager = profile.isDepartmentManager();
        acls.add(convertToAcl(isDepartmentManager, department));
        if (isDepartmentManager) {
            acls.add(convertToAcl(false, initExecutivesGroup()));
        } else {
            if (department.getManager() != null) {
                acls.add(convertToAcl(true, department));
            }
        }
        return acls;
    }
}
