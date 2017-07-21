package com.itechart.security.web.security.ldap;

import com.itechart.security.web.service.LdapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.ldap.userdetails.LdapUserDetailsMapper;

import java.util.Collection;

public class LdapUserDetailsContextMapper extends LdapUserDetailsMapper {

    private static final Logger logger = LoggerFactory.getLogger(LdapUserDetailsContextMapper.class);

    @Autowired
    private LdapService ldapService;

    @Override
    public UserDetails mapUserFromContext(DirContextOperations ctx, String username,
                                          Collection<? extends GrantedAuthority> authorities) {
        logger.debug("Load user {} from database", username);
        return ldapService.loadUserByLdapData(ctx, username);

    }
}
