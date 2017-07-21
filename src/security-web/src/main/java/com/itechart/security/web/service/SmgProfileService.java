package com.itechart.security.web.service;


import com.itechart.security.model.dto.SecuredGroupDto;
import com.itechart.security.web.model.dto.SmgProfileDto;
import com.itechart.security.web.model.smg.SmgDepartment;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created by siarhei.rudzevich on 2/15/2017.
 */
public interface SmgProfileService {

    SmgProfileDto getSmgProfileById(String username, String password, Integer profileId) throws IOException;

    List<SmgProfileDto> getAllSmgProfiles(String userName, String password) throws IOException;

    Integer getSession(String userName, String password) throws IOException;

    List<SmgDepartment> getAllDepartments(Integer sessionId) throws IOException;

    Map<Integer, SecuredGroupDto> getMapOfDepartments(String userName, String password);
}
