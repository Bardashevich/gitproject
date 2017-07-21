package com.itechart.security.web.controller;

import com.itechart.security.business.model.dto.ContactDto;
import com.itechart.security.business.service.ContactService;
import com.itechart.security.core.userdetails.UserDetails;
import com.itechart.security.web.util.FileUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URL;

import static org.springframework.web.bind.annotation.RequestMethod.GET;


@RestController
public class ImageController {

    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

    @Autowired
    private ContactService contactService;

    @RequestMapping(value = "/images/contact/{contactId}", method = GET)
    public void downloadAttachment(@PathVariable Long contactId,
                                   HttpServletResponse response) {
        logger.debug("downloading image for contact {}", contactId);
        ContactDto contact;
        if (contactId != null && contactId > 0){
            contact = contactService.get(contactId);
            setContactImageToResponse(contact, response);
        }
    }

    @RequestMapping(value = "/images/user", method = GET)
    public void downloadAvatar(HttpServletResponse response) {
        UserDetails     userDetails = (UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ContactDto contactDto = contactService.getByUserId(userDetails.getUserId());
        setContactImageToResponse(contactDto, response);
    }

    private void setContactImageToResponse(ContactDto contactDto, HttpServletResponse response) {
        FileUtil.fixSSLHandshakeException();
        response.setHeader("Cache-Control", "no-cache");
        if (contactDto != null && StringUtils.isNotBlank(contactDto.getPhotoUrl())){
            try {
                URL file = new URL(contactDto.getPhotoUrl());
                FileUtil.copyImageToResponse(file, response);
            } catch (IOException ex) {
                logger.error("can't download image for contact with id {} ", contactDto.getId());
                throw new RuntimeException("image wasn't loaded");
            }
        }
    }
}
