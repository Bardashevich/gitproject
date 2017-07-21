package com.itechart.security.web.controller;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itechart.security.business.filter.ContactFilter;
import com.itechart.security.business.model.dto.*;
import com.itechart.security.business.model.enums.ObjectTypes;
import com.itechart.security.business.service.*;
import com.itechart.security.business.service.enums.FileType;
import com.itechart.security.model.dto.AclEntryDto;
import com.itechart.security.web.model.dto.DataPageDto;
import com.itechart.security.web.service.WebSocketService;
import org.apache.commons.collections.map.HashedMap;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import static com.itechart.security.business.model.dto.utils.ContactConverter.convert;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@RestController
@PreAuthorize("hasAnyRole('MANAGER', 'SPECIALIST')")
public class ContactController extends SecuredController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    @Autowired
    private ContactService contactService;

    @Autowired
    private DictionaryService dictionaryService;

    @Autowired
    private FileService fileService;

    @Autowired
    private ParsingService parsingService;

    @Autowired
    private ReportService reportService;

    @Autowired
    private WebSocketService webSocketService;

    @Autowired
    private RecruitmentOpportunityService recruitmentOpportunityService;


    @RequestMapping("/contacts/{contactId}/actions/{value}")
    public boolean isAllowed(@PathVariable Long contactId, @PathVariable String value) {
        return super.isAllowed(contactId, value);
    }

    @RequestMapping(value = "/contacts/{contactId}", method = GET)
    public ContactDto get(@PathVariable Long contactId) {
        return contactService.get(contactId);
    }

    @RequestMapping(value = "/contacts/current/contact", method = GET)
    public ContactDto getCurrentUserContact() {
        return contactService.getCurrentUserContact();
    }

    @RequestMapping(value = "/contacts/user/{userId}", method = GET)
    public ContactDto getByUserId(@PathVariable Long userId) {
        return contactService.getByUserId(userId);
    }

    @RequestMapping(value = "/contacts/nationalities", method = GET)
    public List<NationalityDto> getNationalities() {
        logger.debug("GETTING NATIONALITIES");
        return contactService.getNationalities();
    }

    @RequestMapping(value = "/contacts/email/{email}", method = GET)
    public String getContactByEmail(@PathVariable String email) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
        ContactDto contact = contactService.getByEmail(email);
        return mapper.writeValueAsString(contact);
    }

    @PreAuthorize("hasPermission(#dto.getId(), 'sample.Contact', 'WRITE')")
    @RequestMapping(value = "/contacts", method = PUT)
    public void update(@RequestBody ContactDto dto) {

        contactService.updateContact(dto);
        sendMessageForRoles(dto);
    }

    @RequestMapping(value = "/contacts/list", method = POST)
    public DataPageDto find(@RequestBody ContactFilterDto filterDto) {
        ContactFilter filter = convert(filterDto);
        DataPageDto<ContactDto> page = new DataPageDto<>();
        List<ContactDto> contactDtos;
        contactDtos = contactService.findContacts(filter);
        page.setTotalCount(contactService.countContacts(filter));
        page.setData(contactDtos);
        return page;
    }


    @RequestMapping(value = "/contacts/students/list", method = POST)
    public DataPageDto findStudents(@RequestBody ContactFilterDto filterDto) {
        ContactFilter filter = convert(filterDto);
        DataPageDto<ContactDto> page = new DataPageDto<>();
        List<ContactDto> contactDtos;
        contactDtos = contactService.getContactsByUserGroupByFilter(filter);
        Integer countUnreadComments = contactService.getCountUnreadComments();
        page.setTotalCount(contactService.getCountStudentsByFilter(filter));
        page.setCountUnreadComments(countUnreadComments);
        page.setData(contactDtos);
        return page;
    }

    @RequestMapping(value = "/contacts/comments/list", method = POST)
    public DataPageDto findComments(@RequestBody ContactFilterDto filterDto) {
        ContactFilter filter = convert(filterDto);
        DataPageDto<ContactCommentDto> page = new DataPageDto<>();
        Long contactId = 10L;
        if (filter.getId() != null) {
            contactId = Long.parseLong(filter.getId());
        }
        List<ContactCommentDto> commentDtoList  = contactService.getCommentsByContactIdByFilter(contactId, filter);
        page.setTotalCount(contactService.getCountCommentsByContactIdByFilter(contactId, filter));
        page.setData(commentDtoList);
        return page;
    }

    @RequestMapping(value = "/contacts/unread/comments/list", method = POST)
    public DataPageDto findUnreadComments(@RequestBody ContactFilterDto filterDto) {
        ContactFilter filter = convert(filterDto);
        DataPageDto<ContactCommentDto> page = new DataPageDto<>();
        Integer countUnreadComments = contactService.getCountUnreadComments();
        List<ContactCommentDto> commentDtoList  = contactService.getUnreadCommentsByFilter(filter);
        page.setCountUnreadComments(countUnreadComments);
        page.setTotalCount(countUnreadComments);
        page.setData(commentDtoList);
        contactService.setCountUnreadCommentsInZero();
        return page;
    }

    @RequestMapping(value = "/contacts/unread/comments/zero", method = PUT)
    public void setCountUnreadCommentsInZero() {
        contactService.setCountUnreadCommentsInZero();
    }

    @RequestMapping(value = "/contacts", method = POST)
    public Long create(@RequestBody ContactDto dto) {
        Long contactId = contactService.saveContact(dto);
        super.createAcl(contactId);
        sendMessageForRoles(dto);
        return contactId;
    }

    @RequestMapping(value = "/contacts/{contactId}", method = DELETE)
    @PreAuthorize("hasPermission(#contactId, 'sample.Contact', 'DELETE')")
    public void delete(@PathVariable Long contactId) {
        super.deleteAcl(contactId);
        contactService.deleteById(contactId);
    }

    @RequestMapping(value = "/contacts/comment", method = PUT)
    public void addComment(@RequestBody ContactDto dto) {
        contactService.addComment(dto);
        sendMessageForRoles(dto);
    }

    @RequestMapping("/contacts/{contactId}/acls")
    public List<AclEntryDto> getAcls(@PathVariable Long contactId) {
        return super.getAcls(contactId);
    }

    @RequestMapping(value = "/contacts/{contactId}/acls", method = PUT)
    public void createOrUpdateAcls(@PathVariable Long contactId, @RequestBody List<AclEntryDto> aclEntries) {
        super.createOrUpdateAcls(contactId, aclEntries);
    }

    @RequestMapping(value = "/contacts/{contactId}/acls/{principalId}", method = DELETE)
    public void deleteAcl(@PathVariable Long contactId, @PathVariable Long principalId) {
        super.deleteAcl(contactId, principalId);
    }

    @RequestMapping(value = "/contacts/{contactId}/emails/{emailId}", method = DELETE)
    @PreAuthorize("hasPermission(#contactId, 'sample.Contact', 'DELETE')")
    public void deleteEmail(@PathVariable Long contactId, @PathVariable Long emailId) {
        contactService.deleteEmail(emailId);
    }

    @RequestMapping(value = "/contacts/{contactId}/languages/{languageId}", method = DELETE)
    @PreAuthorize("hasPermission(#contactId, 'sample.Contact', 'DELETE')")
    public void deleteLanguage(@PathVariable Long contactId, @PathVariable Long languageId) {
        contactService.deleteLanguage(languageId);
    }

    @RequestMapping(value = "/contacts/{contactId}/addresses/{addressId}", method = DELETE)
    @PreAuthorize("hasPermission(#contactId, 'sample.Contact', 'DELETE')")
    public void deleteAddress(@PathVariable Long contactId, @PathVariable Long addressId) {
        contactService.deleteAddress(addressId);
    }

    @RequestMapping(value = "/contacts/{contactId}/messengers/{messengerId}", method = DELETE)
    @PreAuthorize("hasPermission(#contactId, 'sample.Contact', 'DELETE')")
    public void deleteMessengerAccount(@PathVariable Long contactId, @PathVariable Long messengerId) {
        contactService.deleteMessengerAccount(messengerId);
    }

    @RequestMapping(value = "/contacts/{contactId}/social_networks/{socialNetworkId}", method = DELETE)
    @PreAuthorize("hasPermission(#contactId, 'sample.Contact', 'DELETE')")
    public void deleteSocialNetworkAccount(@PathVariable Long contactId, @PathVariable Long socialNetworkId) {
        contactService.deleteSocialNetworkAccount(socialNetworkId);
    }

    @RequestMapping(value = "/contacts/{contactId}/telephones/{telephoneId}", method = DELETE)
    @PreAuthorize("hasPermission(#contactId, 'sample.Contact', 'DELETE')")
    public void deleteTelephone(@PathVariable Long contactId, @PathVariable Long telephoneId) {
        contactService.deleteTelephone(telephoneId);
    }

    @RequestMapping(value = "/contacts/{contactId}/workplaces/{workplaceId}", method = DELETE)
    @PreAuthorize("hasPermission(#contactId, 'sample.Contact', 'DELETE')")
    public void deleteWorkplace(@PathVariable Long contactId, @PathVariable Long workplaceId) {
        contactService.deleteWorkplace(workplaceId);
    }

    @RequestMapping(value = "/contacts/{contactId}/attachments/{attachmentId}", method = DELETE)
    public void deleteAttachment(@PathVariable Long contactId, @PathVariable Long attachmentId) {
        logger.debug("deleting attachment for contact {}, attachment id {}", contactId, attachmentId);
        contactService.deleteAttachment(attachmentId);
    }

    @RequestMapping(value = "/contacts/{contactId}/skills/{skillId}", method = DELETE)
    @PreAuthorize("hasPermission(#contactId, 'sample.Contact', 'DELETE')")
    public void deleteSkill(@PathVariable Long contactId, @PathVariable Long skillId) {
        contactService.deleteSkill(skillId);
    }

    @RequestMapping(value = "/dictionary", method = GET)
    public DictionaryDto getDictionary() {
        return dictionaryService.getDictionary();
    }

    @RequestMapping(value = "/parser/linkedIn", method = GET)
    public ContactDto getFromSocialNetworkAccount(@RequestParam String url) throws IOException {
        return parsingService.parse(url);
    }

    @RequestMapping(value = "/parse/contact/cv/{vacancyId}/", method = POST)
    public Long getContactFromCV( @RequestParam("file") MultipartFile file, @PathVariable Integer vacancyId) {
        logger.debug("parsing cv");
        try {
            ContactDto dto = parsingService.parseCVProfile(new XWPFDocument(file.getInputStream()));
            Long contactId = contactService.saveContact(dto);
            dto.setId(contactId);
            Long id = recruitmentOpportunityService.saveOpportunityWithCV(vacancyId, dto);
            //TempFileUtil.saveTempFile(file.getInputStream());
            super.createAcl(contactId);
            return id;
        } catch (IOException e) {
            logger.error("can't upload cv file for parse", e);
            throw new RuntimeException("file upload failed", e);
        }
    }


    @Override
    public ObjectTypes getObjectType() {
        return ObjectTypes.CONTACT;
    }

    @RequestMapping(value = "/contacts/files/{contactId}/attachments/{attachmentId}/check", method = GET)
    public void checkFile(@PathVariable Long contactId, @PathVariable Long attachmentId) {
        logger.debug("checking attachment {} from contact {}", attachmentId, contactId);
        File file = fileService.getAttachment(contactId, attachmentId);
        if (!file.exists()) {
            throw new RuntimeException("error happened during file download");
        }
    }

    @RequestMapping(value = "/contacts/{contactId}/educations/{educationId}", method = DELETE)
    @PreAuthorize("hasPermission(#contactId, 'sample.Contact', 'DELETE')")
    public void deleteEducationInfo(@PathVariable Long contactId, @PathVariable Long educationId) {
        logger.debug("deleting info about universities education for contact {}, education id {}",
                contactId, educationId);
        contactService.deleteUniversityEducation(educationId);
    }

    @RequestMapping(value = "/contacts/list/all", method = GET)
    public List<ContactDto> getContactList() {
        return contactService.getContactList();
    }

    @RequestMapping(value = "/contacts/{contactId}/report/{reportType}", method = GET)
    @ResponseBody
    public void generateReport(@PathVariable Long contactId, @PathVariable String reportType, HttpServletResponse response) {
        logger.debug("generating report {} for contact {}", reportType, contactId);
        ContactDto contact = contactService.get(contactId);
        File file = reportService.report(contact, FileType.findByName(reportType));
        String fileName = contact.getFirstName() + File.separator + contact.getLastName() + "." + reportType;
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Disposition", "inline;filename*=UTF-8''" + fileName + ";");
        try {
            String mimeType = "application/" + reportType;
            response.setContentType(mimeType);
            InputStream in = new FileInputStream(file);
            FileCopyUtils.copy(in, response.getOutputStream());
        } catch (IOException ex) {
            throw new RuntimeException("error happened during file download", ex);
        }
    }

    @RequestMapping(value = "/contacts/reports", method = POST)
    @ResponseBody
    public Map<String, String> generateReports(@RequestBody ContactReportDto contactReportDto){
        Map<String, String> generatedReports = new HashedMap();
        contactReportDto.getContactsId().forEach(contactId->{
            ContactDto contact = contactService.get(contactId);
            File file = reportService.report(contact, FileType.findByName(contactReportDto.getReportType()));
            String fileName = contact.getFirstName() + File.separator + contact.getLastName() + "." +
                    contactReportDto.getReportType();
            generatedReports.put(fileName, file.getAbsolutePath());
        });
        return generatedReports;
    }

    @RequestMapping(value = "/contacts/group/{userGroupName}", method = GET)
    public List<ContactDto> getContactListByGroupName(@PathVariable String userGroupName){
        return  contactService.getContactsByUserGroup(userGroupName);
    }

    private void sendMessageForRoles(@RequestBody ContactDto dto) {
        try {
            webSocketService.sendMessage(dto);
            logger.info("sent message for userId: {}", dto.getId());
        } catch (AccessDeniedException e){
            logger.info("user haven't privileges. UserId: {}", dto.getId());
        }

    }



}
