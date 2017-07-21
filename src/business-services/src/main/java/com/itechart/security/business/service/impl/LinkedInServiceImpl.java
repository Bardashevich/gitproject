package com.itechart.security.business.service.impl;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itechart.security.business.dao.LinkedInSearchContactDao;
import com.itechart.security.business.exception.BusinessServiceException;
import com.itechart.security.business.model.dto.LinkedInAccountCredentialsDto;
import com.itechart.security.business.model.dto.LinkedInNextSearchResultDto;
import com.itechart.security.business.model.dto.LinkedInSearchDto;
import com.itechart.security.business.model.dto.LinkedInSearchResultDto;
import com.itechart.security.business.model.persistent.linkedin.LinkedInSearchContact;
import com.itechart.security.business.service.LinkedInService;
import com.itechart.security.business.service.ParsingService;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

public class LinkedInServiceImpl implements LinkedInService {

    private static Map<String, String> linkedInCookies = null;

    private static final Logger log = LoggerFactory.getLogger(LinkedInServiceImpl.class);
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36";

    private String linkedinUserLogin;
    private String linkedinUserPassword;

    @Autowired
    private ParsingService parsingService;
    @Autowired
    private LinkedInSearchContactDao linkedInSearchContactDao;

    @Override
    public Document getLinkedinPage(String url) {
        try {
            URI uri = new URI(url);
            return Jsoup.connect(uri.toASCIIString())
                    .cookies(getLinkedInCookies())
                    .userAgent(USER_AGENT)
                    .timeout(60 * 10000)
                    .get();
        } catch (IOException | URISyntaxException e) {
            log.error("Can't get html page", e);
            throw new BusinessServiceException("Can't get html page", e);
        }
    }

    private Map<String, String> getLinkedInCookies(){
        if(linkedInCookies == null){
            linkedInCookies = signin(linkedinUserLogin, linkedinUserPassword).cookies();
        }
        return linkedInCookies;
    }

    private Connection.Response signin(String login, String password){
        Connection.Response response = null;

        String LOGIN_URL = "https://www.linkedin.com/uas/login?goback=&trk=hb_signin";
        try {
            response = Jsoup
                    .connect(LOGIN_URL)
                    .method(Connection.Method.GET)
                    .execute();

            Document responseDocument = response.parse();
            Map<String, String> cookies = response.cookies();

            Map<String, String> bCookie = new HashMap<>();
            bCookie.put("bcookie", cookies.get("bcookie"));
            bCookie.put("bscookie", cookies.get("bscookie"));

            Element loginCsrfParam = responseDocument
                    .select("input[name=loginCsrfParam]")
                    .first();

            response = Jsoup.connect("https://www.linkedin.com/uas/login-submit")
                    .cookies(cookies)
                    .data("loginCsrfParam", loginCsrfParam.attr("value"))
                    .data("session_key", login)
                    .data("session_password", password)
                    .method(Connection.Method.POST)
                    .followRedirects(true)
                    .execute();
            response.cookies().putAll(bCookie);
        }catch (IOException e){
            log.error("Can't signin", LOGIN_URL);
        }
        return response;
    }

    @Override
    public String getLinkedinContactsJsonData(LinkedInSearchDto dto, URI uri){
        try {
            Map<String, String> cookies = parsingService.parseCookiesJson(dto.getCookiesStr());

            deleteQuotes(cookies, "bcookie");
            deleteQuotes(cookies, "bscookie");
            deleteQuotes(cookies, "JSESSIONID");

            Connection.Response response = Jsoup.connect(uri.toASCIIString())
                    .cookies(cookies)
                    .header("Csrf-Token", cookies.get("JSESSIONID"))
                    .header("x-restli-protocol-version", "2.0.0")
                    .ignoreContentType(true)
                    .method(Connection.Method.GET)
                    .userAgent(USER_AGENT)
                    .timeout(60 * 10000)
                    .execute();

            return response.body();
        } catch (IOException e) {
            log.error("Can't get contact Json data.", e);
            throw new BusinessServiceException("Can't get contact Json data.", e);
        }
    }

    private void deleteQuotes(Map<String, String> cookies, String key) {
        String value = cookies.get(key);
        if (!value.isEmpty()) {
            value = value.substring(1, value.length() - 1);
        }
        cookies.replace(key, value);
    }

    @Override
    public Map<String, String> getLinkedInAccountCookies(LinkedInAccountCredentialsDto credentialsDto){
        Map<String,String> cookies = signin(credentialsDto.getLogin(), credentialsDto.getPassword()).cookies();
        if(!cookies.containsKey("lidc")){
            cookies = new HashMap<>();
            cookies.put("errorMsg","Password or Login is incorrect!");
        }
        return cookies;
    }

    @Override
    public Long saveOrUpdateLinkedInSearchContact(LinkedInSearchContact contact){
        return linkedInSearchContactDao.saveLinkedInSearchContact(contact);
    }

    @Override
    public String getWorkingLinkedInProfileLink(String profileUri){
        try {
            URI uri = new URI(profileUri);
            Document document = Jsoup.connect(uri.toASCIIString())
                    .cookies(getLinkedInCookies())
                    .userAgent(USER_AGENT)
                    .timeout(60 * 10000)
                    .get();
            String script = document.getElementById("wrapper").toString().replaceAll(" ","");
            int position = script.indexOf("newUrlWithVanity='/in/");
            if(position != -1) {
                String linkedInUserId = script.substring(position + 21, script.indexOf("'", position + 21));
                return "https://www.linkedin.com/in" + linkedInUserId;
            }
        } catch (IOException | URISyntaxException e) {
            log.error("Can't get html page", profileUri);
        }
        return "";
    }

    @Override
    public LinkedInSearchResultDto findLinkedinContacts(LinkedInSearchDto dto) {
        String uri = "https://www.linkedin.com/voyager/api/search/cluster";
        uri += generateURIParams(dto);
        try {
            LinkedInSearchResultDto linkedInSearchResult = getLinkedInSearchResultDto(dto, new URI(uri));
            return saveLinkedInSearchresults(linkedInSearchResult);
        } catch (URISyntaxException e) {
            log.error("Can't find LinkedIn contacts", e);
            throw new BusinessServiceException("Can't find LinkedIn contacts", e);
        }
    }

    @Override
    public LinkedInSearchResultDto findNextLinkedInContacts(LinkedInNextSearchResultDto dto) {
        try {
            URI uri = new URI(dto.getNextLink());
            LinkedInSearchDto searchDto = new LinkedInSearchDto();
            searchDto.setCookiesStr(dto.getCookiesStr());
            LinkedInSearchResultDto searchResult = getLinkedInSearchResultDto(searchDto, uri);
            return saveLinkedInSearchresults(searchResult);
        } catch (URISyntaxException e) {
            log.error("Can't find LinkedIn contacts", dto.getNextLink(), e);
            throw new BusinessServiceException("Can't find LinkedIn contacts", e);
        }
    }

    private LinkedInSearchResultDto saveLinkedInSearchresults(LinkedInSearchResultDto searchResultDto){
        for(LinkedInSearchContact contact : searchResultDto.getContacts()){
            contact.setId(saveOrUpdateLinkedInSearchContact(contact));
        }
        return searchResultDto;
    }

    private String generateURIParams(LinkedInSearchDto dto) {
        String uriParams = "?q=guided&origin=FACETED_SEARCH&count=10&start=0";
        uriParams += "&searchId=" + new Date().getTime();
        uriParams += "&keywords=" + dto.getKeyWords();
        String guides = "&guides=List(v->PEOPLE";
        if (isNotEmpty(dto.getFirstName())) {
            guides += ",firstName->" + dto.getFirstName();
        }
        if (isNotEmpty(dto.getLastName())) {
            guides += ",lastName->" + dto.getLastName();
        }
        if (isNotEmpty(dto.getPosition())) {
            guides += ",title->" + dto.getPosition();
        }
        if (isNotEmpty(dto.getCompany())) {
            guides += ",company->" + dto.getCompany();
        }
        if (isNotEmpty(dto.getLocation())) {
            guides += ",facetGeoRegion->" + dto.getLocation() + ":0";
        }
        guides += ")";
        uriParams += guides;
        uriParams = uriParams.trim().replaceAll("[ ]", "%20");
        uriParams = uriParams.replaceAll("[>]", "%3E");
        uriParams = uriParams.replaceAll("[:]", "%3A");
        return uriParams;
    }

    private int getRandomId() {
        return new Random().nextInt(Integer.MAX_VALUE);
    }

    private boolean isNotEmpty(String str) {
        return str != null && !"".equals(str);
    }

    private LinkedInSearchResultDto getLinkedInSearchResultDto(LinkedInSearchDto dto, URI uri) {
        String contactsJsonData = getLinkedinContactsJsonData(dto, uri);
        List<LinkedInSearchContact> linkedInSearchContacts = parsingService.parseLinkedInResponseJson(contactsJsonData);
        String nextLinkedInPageLink = getNextLinkedInPageLink(uri.toString(), contactsJsonData);
        return new LinkedInSearchResultDto(nextLinkedInPageLink, linkedInSearchContacts);
    }

    private String getNextLinkedInPageLink(String oldURI, String contactsJsonData) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(contactsJsonData);
            int total = jsonNode
                    .get("elements")
                    .get(0)
                    .get("total").asInt();
            int start = jsonNode
                    .get("paging")
                    .get("start").asInt();
            if (total == start){
                return "LAST PAGE";
            }
            int count = jsonNode
                    .get("paging")
                    .get("count").asInt();
            int newStartPosition = start + count;
            if (newStartPosition > total){
                newStartPosition = total;
            }
            return oldURI.replaceAll("(?<=&start=)[0-9]+(?=&)", Integer.toString(newStartPosition));
        } catch (IOException e) {
            log.error("Can't create next LinkedIn page link", e);
            throw new BusinessServiceException("Can't create next LinkedIn page link", e);
        }
    }

    public void setLinkedinUserLogin(String linkedinUseLogin) {
        this.linkedinUserLogin = linkedinUseLogin;
    }

    public void setLinkedinUserPassword(String linkedinUserPassword) {
        this.linkedinUserPassword = linkedinUserPassword;
    }

}

