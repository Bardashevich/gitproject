package com.itechart.security.web.service.impl;

import com.itechart.security.model.dto.SecuredGroupDto;
import com.itechart.security.service.GroupService;
import com.itechart.security.web.model.dto.SmgProfileDto;
import com.itechart.security.web.model.smg.*;
import com.itechart.security.web.service.SmgProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.itechart.security.web.model.smg.SmgResponse.getResponse;

/**
 * Created by siarhei.rudzevich on 2/15/2017.
 */
@Service
public class SmgProfileServiceImpl implements SmgProfileService{

    @Autowired
    private CrmEditorServiceImpl crmEditor;

    @Autowired
    private GroupService groupService;

    private static final String SMG_REST_URL = "https://smg.itechart-group.com/MobileServiceNew/MobileService.svc";
    private static final Logger logger = LoggerFactory.getLogger(SmgProfileServiceImpl.class);

    @Override
    public SmgProfileDto getSmgProfileById (String username, String password, Integer profileId) throws IOException {
        Integer smgSessionId = getSession(username, password);
        URL url = new URL(String.format(
                SMG_REST_URL + "/GetEmployeeDetails?sessionId=%d&profileId=%d",
                smgSessionId,
                profileId));
        SmgProfileResponse response = SmgProfileResponse.getResponse(url, SmgProfileResponse.class);
        return response.getProfile();
    }

    @Override
    public Integer getSession(String userName, String password) throws IOException {
        SmgSessionResponse smgSession = SmgSessionResponse.getResponse(
                new URL(String.format(
                        SMG_REST_URL + "/Authenticate?username=%s&password=%s",
                        userName, password)),
                SmgSessionResponse.class);
        return smgSession.getSessionId();
    }

    @Override
    public List<SmgProfileDto> getAllSmgProfiles (String userName, String password) throws IOException {
        Integer sessionId = getSession(userName, password);
        URL url = new URL(String.format(
                SMG_REST_URL + "/GetEmployeeDetailsListByDeptId?sessionId=%d&departmentId=0",
                sessionId));
        SmgProfilesResponse response = SmgProfilesResponse.getResponse(url, SmgProfilesResponse.class);
        return response.getProfiles();
    }

    public List<SmgDepartment> getAllDepartments(Integer sessionId) throws IOException {
        URL url = new URL(String.format(
                SMG_REST_URL + "/GetAllDepartments?sessionId=%s",
                sessionId));
        SmgDepartmentsResponse response = getResponse(url, SmgDepartmentsResponse.class);
        return response.getDepts();
    }

    @Override
    public Map<Integer, SecuredGroupDto> getMapOfDepartments(String userName, String password) {
        List<SecuredGroupDto> oldGroups = groupService.getGroups();
        List<SmgDepartment> departments;
        Map<Integer, SecuredGroupDto> map = new HashMap<>();
        try {
            departments = getAllDepartments(getSession(userName, password));
            for (SmgDepartment department : departments) {
                Long deptId = department.getIdOfGroupFromList(oldGroups);
                if (deptId == null) {
                    groupService.create(department.convertToCrmGroup(null));
                    oldGroups = groupService.getGroups();
                    for (SecuredGroupDto newGroup : oldGroups) {
                        if (newGroup.getName().equals(department.getDepCode())) {
                            deptId = newGroup.getId();
                        }
                    }
                }
                map.put(department.getId(), department.convertToCrmGroup(deptId));
            }
        } catch (IOException e) {
            logger.error("can't parse departments {}", e);
        }
        return map;
    }

}
