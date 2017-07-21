package com.itechart.security.web.service.impl;

import com.itechart.security.business.service.ContactService;
import com.itechart.security.business.service.SmgProfileMapService;
import com.itechart.security.core.authority.RoleAuthority;
import com.itechart.security.core.model.SecurityRole;
import com.itechart.security.core.userdetails.UserDetails;
import com.itechart.security.core.userdetails.UserDetailsImpl;
import com.itechart.security.model.dto.RoleDto;
import com.itechart.security.model.dto.SecuredGroupDto;
import com.itechart.security.model.dto.SecuredUserDto;
import com.itechart.security.model.persistent.User;
import com.itechart.security.service.GroupService;
import com.itechart.security.service.RoleService;
import com.itechart.security.service.UserService;
import com.itechart.security.web.model.dto.SmgProfileDto;
import com.itechart.security.web.service.LdapService;
import com.itechart.security.web.service.SmgProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

import static com.itechart.security.model.util.UserConverter.convert;
import static org.springframework.util.StringUtils.isEmpty;
/**
 * Created by siarhei.rudzevich on 2/13/2017.
 */
@Service
public class LdapServiceImpl implements LdapService {

    private static final Logger logger = LoggerFactory.getLogger(LdapServiceImpl.class);

    @Autowired
    private RoleService roleService;

    @Autowired
    ContactService contactService;

    @Autowired
    private UserService userService;

    @Autowired
    private SmgProfileService smgProfileService;

    @Autowired
    private SmgProfileMapService smgProfileMapService;

    @Autowired
    private CrmEditorServiceImpl crmEditor;

    @Autowired
    private GroupService groupService;

    @Override
    public UserDetails loadUserByLdapData(DirContextOperations ctx, String username) {
        SecuredUserDto dto = new SecuredUserDto();
        List<RoleDto> list = roleService.getRoles();
        Set<RoleDto> rolesUser = new HashSet<>();
        for (RoleDto roleDto : list) {
            if (roleDto.getName().equals("USER")) {
                rolesUser.add(roleDto);
            }
        }
        dto.setRoles(rolesUser);
        User user = convert(dto);
        Set<GrantedAuthority> authorities = new HashSet<>();
        Set<? extends SecurityRole> roles = user.getRoles();
        if (roles != null && roles.size() > 0) {
            for (SecurityRole role : roles) {
                authorities.add(new RoleAuthority(role));
            }
        }
        return new UserDetailsImpl(user.getId(), username, username, user.isActive(), authorities);
    }

    @Override
    public Authentication createUserByLdapData(Authentication userAuthenticated) {
        Integer profileId = smgProfileMapService.getProfileIdByDomenName(userAuthenticated.getName());
        if (profileId != null && isEmpty(userService.getUser(userAuthenticated.getName()))) {
            try {
                Map<Integer, SecuredGroupDto> departmentsMap = smgProfileService.getMapOfDepartments(userAuthenticated.getName(), userAuthenticated.getCredentials().toString());
                SmgProfileDto profile = smgProfileService.getSmgProfileById(userAuthenticated.getName(), userAuthenticated.getCredentials().toString(), profileId);
                SecuredGroupDto group = departmentsMap.get(profile.getDeptId());
                if (group.getName().equals("HRM")) {
                    List<SecuredGroupDto> oldGroups = groupService.getGroups();
                    Integer index = 0;
                    while (index < oldGroups.size()) {
                        if (oldGroups.get(index).getName().equals("HRs")) {
                            group = oldGroups.get(index);
                            index = oldGroups.size();
                        }
                        index++;
                    }
                }
                crmEditor.exportProfileToCrm(userAuthenticated.getCredentials().toString(), profile, group);
            }catch (IOException e){
                logger.debug("Can't load profile by id from smg" , e);
            }
        } else {
            userAuthenticated = null;
        }
        return userAuthenticated;
    }


}
