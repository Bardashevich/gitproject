package com.itechart.security.web.controller;

import com.itechart.security.business.exception.BusinessServiceException;
import com.itechart.security.business.model.dto.*;
import com.itechart.security.business.model.enums.ObjectTypes;
import com.itechart.security.business.service.LinkedInService;
import com.itechart.security.business.service.RecruitmentOpportunityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@PreAuthorize("hasAnyRole('MANAGER', 'SPECIALIST')")
public class LinkedInController extends SecuredController {

    private static final Logger logger = LoggerFactory.getLogger(LinkedInController.class);

    @Autowired
    private RecruitmentOpportunityService recruitmentOpportunityService;

    @Autowired
    private LinkedInService linkedInService;

    @RequestMapping(value = "/getLinkedInCookies", method = POST)
    public Map<String,String> getLinkedInCookies(@RequestBody LinkedInAccountCredentialsDto credentialsDto) throws IOException {
        logger.debug("Get LinkedInCookies for {} with password {}", credentialsDto.getLogin(), credentialsDto.getPassword());
        Map<String, String> linkedInAccountCookies = linkedInService.getLinkedInAccountCookies(credentialsDto);
        return linkedInAccountCookies;
    }

    @RequestMapping(value = "/searchLinkedInContacts", method = POST)
    public LinkedInSearchResultDto findLinkedinContacts(@RequestBody LinkedInSearchDto dto) {
        logger.debug("Find Linkedin contacts by dto: {}", dto);
        return linkedInService.findLinkedinContacts(dto);
    }

    @RequestMapping(value = "/searchNextLinkedInContacs", method = POST)
    public LinkedInSearchResultDto findNextLinkedinContacts(@RequestBody LinkedInNextSearchResultDto dto) {
        return linkedInService.findNextLinkedInContacts(dto);
    }

    @ExceptionHandler(value = BusinessServiceException.class)
    public ResponseEntity<String> fieldHasErrors(BusinessServiceException error){
        return new ResponseEntity<>(
                error.getMessage(), new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/saveOpportunity", method = POST)
    public Long saveActionForOpportunity(@RequestBody LinkedInCandidatDto linkedInCandidatsDto) throws IOException {
        Long contacId = recruitmentOpportunityService.saveOpportunityWithAction(linkedInCandidatsDto);
        /* Check contactId for null, if not null then contact just create and we need to save acls */
        if(contacId != null) super.createAcl(contacId);
        return contacId;
    }

    @Override
    public ObjectTypes getObjectType() {
        return ObjectTypes.CONTACT;
    }
}
