package com.itechart.security.business.model.enums;

/**
 * Created by artsiom.marenau on 12/14/2016.
 */
public enum RoleType {
    HR("HR"),
    ADMIN("ADMIN"),
    MANAGER("MANAGER"),
    OTHER("OTHER");

    private String value;

    public static RoleType findByName(String roleType) {
        for (RoleType role : RoleType.values()) {
            if (role.name().equals(roleType)) {
                return role;
            }
        }
        throw new RuntimeException("RoleType was not found for name: " + roleType);
    }

    RoleType(String value) {
        this.value = value;
    }
}
