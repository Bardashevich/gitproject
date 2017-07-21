package com.itechart.security.web.security.ldap;

import com.itechart.security.web.service.LdapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.ldap.DefaultSpringSecurityContextSource;
import org.springframework.security.ldap.authentication.BindAuthenticator;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;

/**
 * Created by yury.sauchuk on 1/13/2017.
 */
public class CustomLdapAuthenticationProvider extends LdapAuthenticationProvider {

    private static final Logger logger = LoggerFactory.getLogger(CustomLdapAuthenticationProvider.class);

    private final String USER_NAME_POSTFIX = "@icx.local";

    @Autowired
    private DefaultSpringSecurityContextSource contextSource;

    @Autowired
    private LdapService ldapService;

    public CustomLdapAuthenticationProvider(BindAuthenticator authenticator) {
        super(authenticator);
    }

    @Override
    public Authentication authenticate(Authentication authentication)
            throws AuthenticationException {

        String username = authentication.getName().concat(USER_NAME_POSTFIX);
        String password = authentication.getCredentials().toString();

        contextSource.setUserDn(username);
        contextSource.setPassword(password);

        logger.info("Try to log in user with login {}", username);
        Authentication userAuthenticated = null;
        try {
            userAuthenticated = super.authenticate(authentication);
        } catch (InternalAuthenticationServiceException e) {
            logger.debug("Exception after ldap authenticate. ", e);
        }
        if (userAuthenticated != null) {
            logger.info("Create {} user by ldap data", username);
            userAuthenticated = ldapService.createUserByLdapData(userAuthenticated);
        }
        return userAuthenticated;
    }
}
