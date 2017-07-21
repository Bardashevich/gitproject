package com.itechart.security.business.service;

import com.itechart.security.business.model.dto.ContactDto;
import com.itechart.security.business.model.persistent.Contact;
import com.itechart.security.business.model.persistent.linkedin.LinkedInSearchContact;
import org.apache.poi.xwpf.usermodel.XWPFDocument;

import java.util.List;
import java.util.Map;

public interface ParsingService {

     ContactDto parseCVProfile(XWPFDocument document);

     ContactDto parse(String url);

     Contact parseAndCreateNewContact(String uri, Long linkedInId);

     List<LinkedInSearchContact> parseLinkedInResponseJson(String jsonStringData);

     Map<String,String> parseCookiesJson(String cookiesJsonStr);
}
