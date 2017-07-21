package com.itechart.security.business.service.impl;

import com.itechart.security.business.dao.*;
import com.itechart.security.business.filter.ContactFilter;
import com.itechart.security.business.model.dto.ContactCommentDto;
import com.itechart.security.business.model.dto.ContactDto;
import com.itechart.security.business.model.dto.HistoryEntryDto;
import com.itechart.security.business.model.dto.NationalityDto;
import com.itechart.security.business.model.dto.utils.DtoConverter;
import com.itechart.security.business.model.enums.ObjectTypes;
import com.itechart.security.business.model.persistent.Attachment;
import com.itechart.security.business.model.persistent.Contact;
import com.itechart.security.business.model.persistent.ContactComment;
import com.itechart.security.business.model.persistent.ObjectKey;
import com.itechart.security.business.service.ContactService;
import com.itechart.security.business.service.FileService;
import com.itechart.security.business.service.HistoryEntryService;
import com.itechart.security.core.userdetails.UserDetails;
import com.itechart.security.dao.AclEntryDao;
import com.itechart.security.dao.GroupDao;
import com.itechart.security.model.dto.SecuredUserDto;
import com.itechart.security.model.persistent.ObjectType;
import com.itechart.security.service.ObjectTypeService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.validator.routines.UrlValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import static com.itechart.security.business.model.dto.utils.DtoConverter.*;

/**
 * @author andrei.samarou
 */
@Service
public class ContactServiceImpl implements ContactService {

    private static final Logger logger = LoggerFactory.getLogger(ContactServiceImpl.class);

    @Autowired
    private ContactCommentDao contactCommentDao;

    @Autowired
    private AclEntryDao aclEntryDao;

    @Autowired
    private ContactDao contactDao;

    @Autowired
    private EmailDao emailDao;

    @Autowired
    private LanguageDao languageDao;

    @Autowired
    private AddressDao addressDao;

    @Autowired
    private MessengerAccountDao messengerAccountDao;

    @Autowired
    private SocialNetworkAccountDao socialNetworkAccountDao;

    @Autowired
    private TelephoneDao telephoneDao;

    @Autowired
    private WorkplaceDao workplaceDao;

    @Autowired
    private AttachmentDao attachmentDao;

    @Autowired
    private UniversityEducationDao universityEducationDao;

    @Autowired
    private NationalityDao nationalityDao;

    @Autowired
    private FileService fileService;

    @Autowired
    private HistoryEntryService historyEntryService;

    @Autowired
    private ObjectTypeService objectTypeService;

    @Autowired
    private GroupDao groupDao;

    @Override
    @Transactional (readOnly = true)
    public List<NationalityDto> getNationalities(){
        List<NationalityDto> nationalities = DtoConverter.convertNationalities(nationalityDao.loadAll());
        logger.debug("GET ALL NATIONALITIES" + nationalities.toString());
        return nationalities;
    }

    @Override
    @Transactional
    public List<ContactDto> findContacts(ContactFilter filter) {
        List<Contact> contacts = contactDao.find(filter);
        return convertContacts(contacts);
    }

    @Override
    @Transactional
    public List<ContactDto> getContactsByUserGroup(String userGroupName){
        List<Long> ids = groupDao.getUserIdsByGroupName(userGroupName);
        List<Contact> contactList = contactDao.getByUserId(ids);
        return convertContacts(contactList);
    }

    @Override
    @Transactional
    public List<ContactDto> getContactsByUserGroupByFilter(ContactFilter filter){
        List<Contact> contactList = contactDao.getContactByGroupName(filter);
        return convertContacts(contactList);
    }

    @Override
    @Transactional
    public List<ContactCommentDto> getCommentsByContactIdByFilter(Long contactId, ContactFilter filter){
        List<ContactComment> commentList = contactCommentDao.getCommentByContactIdBy(contactId, filter);
        return convertContactCommentList(commentList);
    }

    @Override
    @Transactional
    public List<ContactCommentDto> getUnreadCommentsByFilter(ContactFilter filter){
        Contact author = contactDao.getByUserId(((UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal()).getUserId());
        if (author.getReadingCommentsDate() == null) {
            author.setReadingCommentsDate(new Date());
        }
        List<ContactComment> commentList = contactCommentDao.getUnreadCommentsByFilter(author, filter);
        return convertContactCommentList(commentList);
    }

    @Override
    @Transactional
    public Integer getCountStudentsByFilter(ContactFilter filter){
        Long id = groupDao.getIdByGroupName(filter.getGroup());
        return aclEntryDao.count(id);
    }

    @Override
    @Transactional
    public Integer getCountCommentsByContactIdByFilter(Long contactId, ContactFilter filter){
        return  contactCommentDao.getCountCommentByContactId(contactId);
    }

    @Override
    @Transactional
    public Integer getCountUnreadComments(){
        Contact author = contactDao.getByUserId(((UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal()).getUserId());
        return (author != null) ? author.getCountUnreadComments() : 0;
    }

    @Override
    @Transactional
    public Long saveContact(ContactDto contactDto) {
        Contact author = contactDao.getByUserId(((UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal()).getUserId());
        if ( contactDto.getComments() != null ){
            contactDto.getComments().forEach(comment -> comment.setAuthorId(author.getId()));
        }
        Contact contact = convert(contactDto);
        moveAvatarImageToTargetDirectory(contact);
        Long contactId = contactDao.save(contact);
        historyEntryService.startHistory(buildObjectKey(contactId));
        moveFilesToTargetDirectory(contact);
        return contactId;
    }

    @Override
    @Transactional(readOnly = true)
    public ContactDto get(Long id) {
        ContactDto contactDto = convert(contactDao.get(id));
        HistoryEntryDto historyEntry = historyEntryService.getLastModification(buildObjectKey(id));
        contactDto.setHistory(historyEntry);
        return contactDto;
    }

    @Override
    @Transactional(readOnly = true)
    public ContactDto getContactById(Long id) {
        Contact contact = contactDao.getContactById(id);
        ContactDto contactDto = convert(contact);
        return contactDto;
    }

    @Override
    @Transactional(readOnly = true)
    public ContactDto getCurrentUserContact() {
        Contact author = contactDao.getByUserId(((UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal()).getUserId());
        ContactDto contactDto = convert(author);
        return contactDto;
    }

    @Override
    @Transactional(readOnly = true)
    public ContactDto getByUserId(Long id) {
        Contact contact = contactDao.getByUserId(id);
        if (contact == null) {
            return null;
        }
        ContactDto contactDto = convert(contact);
        HistoryEntryDto historyEntry = historyEntryService.getLastModification(buildObjectKey(contactDto.getId()));
        contactDto.setHistory(historyEntry);
        return contactDto;
    }

    @Override
    @Transactional(readOnly = true)
    public ContactDto getByEmail(String email){
        Contact contact = contactDao.getByEmail(email);
        return contact != null? convert(contact):null;
    }

    private ObjectKey buildObjectKey(Long contactId) {
        ObjectType objectType = objectTypeService.getObjectTypeByName(ObjectTypes.CONTACT.getName());
        return new ObjectKey(objectType.getId(), contactId);
    }

    @Override
    @Transactional
    public void updateContact(ContactDto contactDto) {
        Contact author = contactDao.getByUserId(((UserDetails) SecurityContextHolder.getContext().getAuthentication()
                                                                                    .getPrincipal()).getUserId());
        contactDto.getComments().stream().filter(comment -> (comment.getId() == null))
                .forEach(comment -> comment.setAuthorId(author.getId()));
        Contact contact = convert(contactDto);
        moveAvatarImageToTargetDirectory(contact);
        contactDao.update(contact);
        moveFilesToTargetDirectory(contact);
        historyEntryService.updateHistory(getObjectIdentityId(contact.getId()));
    }

    @Override
    @Transactional
    public Long saveContactBySmgData(ContactDto contactDto) {
        Contact contact = convert(contactDto);
        contact.setCountUnreadComments(0);
        contact.setReadingCommentsDate(new Date());
        moveAvatarImageToTargetDirectory(contact);
        Long contactId = contactDao.save(contact);
        historyEntryService.startHistory(buildObjectKey(contactId));
        moveFilesToTargetDirectory(contact);
        return contactId;
    }

    @Override
    @Transactional
    public void setCountUnreadCommentsInZero() {
        Contact author = contactDao.getByUserId(((UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal()).getUserId());
        author.setReadingCommentsDate(new Date());
        author.setCountUnreadComments(0);
        contactDao.update(author);
    }

    @Override
    @Transactional
    public void addComment(ContactDto contactDto) {
        Contact author = contactDao.getByUserId(((UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal()).getUserId());
        contactDto.getComments().forEach(comment -> comment.setAuthorId(author.getId()));
        Contact contact = convert(contactDto);
        for (ContactComment comment : contact.getContactComments()){
            if ((comment.getId() == null) && (StringUtils.isNotEmpty(comment.getText()))){
                    contactCommentDao.save(comment);
                    author.setReadingCommentsDate(new Date());
                    contactDao.update(author);
                    contactDao.incCountUnreadComments();
            }
        }
        historyEntryService.updateHistory(getObjectIdentityId(contact.getId()));
    }

    @Override
    public void saveContactHistory(Long contactId, boolean isNewContact){
        if(isNewContact) historyEntryService.startHistory(buildObjectKey(contactId));
        historyEntryService.updateHistory(getObjectIdentityId(contactId));
    }

    private ObjectKey getObjectIdentityId(long contactId) {
        ObjectType objectType = objectTypeService.getObjectTypeByName(ObjectTypes.CONTACT.getName());
        return new ObjectKey(objectType.getId(), contactId);
    }

    private void moveFilesToTargetDirectory(Contact contact) {
        for (Attachment attachment : contact.getAttachments()) {
            if (attachment.getFilePath() != null) {
                try {
                    fileService.moveFileToContactDirectory(attachment.getFilePath(), contact.getId(), attachment.getId());
                } catch (IOException e) {
                    logger.error("can't save file to attachment directory for contactId: {}, attachmentId: {}, tempPath: {}", contact.getId(), attachment.getId(), attachment.getFilePath(), e);
                    throw new RuntimeException("error while saving attachment");
                }
            }
        }
    }

    private void moveAvatarImageToTargetDirectory(Contact contact){
        if(StringUtils.isNotBlank(contact.getPhotoUrl())
                && !isCorrectWebUrl(contact.getPhotoUrl())){
            try {
                fileService.moveImageToContactDirectory(contact);
            }catch(IOException e){
                logger.error("can't save image to attachment directory for contact: {}, tempPath: {}", contact.getId(), contact.getPhotoUrl());
            }
        }
    }

    private boolean isCorrectWebUrl(String url){
        String[] schemes = {"http", "https"};
        UrlValidator urlValidator = new UrlValidator(schemes);
        return urlValidator.isValid(url);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        contactDao.delete(id);
    }

    @Override
    @Transactional
    public void deleteEmail(Long id) {
        emailDao.delete(id);
    }

    @Override
    @Transactional
    public void deleteLanguage(Long id) {
        languageDao.delete(id);
    }

    @Override
    @Transactional
    public void deleteAddress(Long id) {
        addressDao.delete(id);
    }

    @Override
    @Transactional
    public void deleteMessengerAccount(Long id) {
        messengerAccountDao.delete(id);
    }

    @Override
    @Transactional
    public void deleteSocialNetworkAccount(Long id) {
        socialNetworkAccountDao.delete(id);
    }

    @Override
    @Transactional
    public void deleteTelephone(Long id) {
        telephoneDao.delete(id);
    }

    @Override
    @Transactional
    public void deleteWorkplace(Long id) {
        workplaceDao.delete(id);
    }

    @Override
    @Transactional
    public void deleteAttachment(Long id) {
        attachmentDao.delete(id);
    }

    @Override
    @Transactional
    public void deleteSkill(Long id) {
        contactDao.deleteSkill(id);
    }

    @Override
    @Transactional
    public int countContacts(ContactFilter filter) {
        return contactDao.count(filter);
    }

    @Override
    @Transactional
    public void deleteUniversityEducation(Long id){
        universityEducationDao.delete(id);
    }

    @Override
    @Transactional
    public List<ContactDto> getContactList() {
        return convertContacts(contactDao.loadAll());
    }

    @Override
    @Transactional
    public Long createContactFromUser(SecuredUserDto dto, Long userId) {
        dto.setId(userId);
        Contact contact = convert(dto);
        contact.setCountUnreadComments(0);
        contact.setReadingCommentsDate(new Date());
        Long contactId = contactDao.save(contact);
        historyEntryService.startHistory(buildObjectKey(contactId));
        return contactId;
    }
}
