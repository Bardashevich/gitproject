package com.itechart.security.web.util;

import com.itechart.security.model.dto.SecuredGroupDto;
import com.itechart.security.model.dto.RoleDto;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.springframework.util.StringUtils.isEmpty;

public class ScrapperUtils {
    public static <T> boolean addElementsToSet(Set<T> firstSet, Set<T> secondSet) {
        if (firstSet == null) {
            firstSet = new HashSet<>();
        }
        return secondSet != null && firstSet.addAll(secondSet);
    }

    public static Long getIdOfGroupFromList(List<SecuredGroupDto> list, SecuredGroupDto securedGroupDto) {
        for (SecuredGroupDto curGroup : list) {
            if (curGroup.getName().equals(securedGroupDto.getName())) {
                return curGroup.getId();
            }
        }
        return null;
    }

    private static RoleDto findRoleInList(String role, List<RoleDto> roles) {
        for (RoleDto aRole : roles) {
            if (!isEmpty(aRole.getName()) && aRole.getName().equals(role)) {
                return aRole;
            }
        }
        return null;
    }

    private static RoleDto getManagerFromList(List<RoleDto> roles) {
        return findRoleInList("MANAGER", roles);
    }

    private static RoleDto getSpecialistFromList(List<RoleDto> roles) {
        return findRoleInList("SPECIALIST", roles);
    }

    public static RoleDto getDepartmentManeger(boolean isDepartmentMqanager, List<RoleDto> roles) {
        if (isDepartmentMqanager) {
            return findRoleInList("DEPARTMENT_MANAGER", roles);
        }
        return null;
    }

    public static RoleDto getHR(boolean isHR, List<RoleDto> roles) {
        if (isHR) {
            return findRoleInList("HR" , roles);
        }
        return null;
    }

    public static RoleDto getManagerOrSpecialistFromList(boolean isManager, List<RoleDto> roles) {
        if (isManager) {
            return getManagerFromList(roles);
        } else {
            return getSpecialistFromList(roles);
        }
    }



}
