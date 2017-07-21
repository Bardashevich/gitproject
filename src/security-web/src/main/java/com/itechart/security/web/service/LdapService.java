package com.itechart.security.web.service;

import com.itechart.security.core.userdetails.UserDetails;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.Authentication;

/**
 * Created by siarhei.rudzevich on 2/13/2017.
 */
public interface LdapService {

    UserDetails loadUserByLdapData(DirContextOperations ctx, String username);

    Authentication createUserByLdapData(Authentication userAuthenticated);
}
