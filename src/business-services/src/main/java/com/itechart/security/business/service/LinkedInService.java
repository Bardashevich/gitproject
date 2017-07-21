package com.itechart.security.business.service;


import com.itechart.security.business.model.dto.LinkedInAccountCredentialsDto;
import com.itechart.security.business.model.dto.LinkedInNextSearchResultDto;
import com.itechart.security.business.model.dto.LinkedInSearchDto;
import com.itechart.security.business.model.dto.LinkedInSearchResultDto;
import com.itechart.security.business.model.persistent.linkedin.LinkedInSearchContact;
import org.jsoup.nodes.Document;

import java.net.URI;
import java.util.Map;

public interface LinkedInService {

    Document getLinkedinPage(String url);

    String getLinkedinContactsJsonData(LinkedInSearchDto dto, URI uri);

    String getWorkingLinkedInProfileLink(String profileUri);

    Map<String, String> getLinkedInAccountCookies(LinkedInAccountCredentialsDto credentialsDto);

    Long saveOrUpdateLinkedInSearchContact(LinkedInSearchContact contact);

    LinkedInSearchResultDto findLinkedinContacts(LinkedInSearchDto dto);

    LinkedInSearchResultDto findNextLinkedInContacts(LinkedInNextSearchResultDto dto);
}
