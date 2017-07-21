package com.itechart.security.model.dto;

import java.util.List;

public class SecuredGroupDto extends PublicGroupDto {

    private List<PublicUserDto> members;
    private SecuredUserDto manager;



    public SecuredGroupDto() {
    }

    public SecuredUserDto getManager() { return manager; }

    public void setManager(SecuredUserDto manager) { this.manager = manager; }

    public List<PublicUserDto> getMembers() {
        return members;
    }

    public void setMembers(List<PublicUserDto> members) {
        this.members = members;
    }

}