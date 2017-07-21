package com.itechart.security.business.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itechart.security.business.dao.ContactDao;
import com.itechart.security.business.dao.LinkedInSearchContactDao;
import com.itechart.security.business.dao.RecruitmentOpportunityDao;
import com.itechart.security.business.dao.VacancyDao;
import com.itechart.security.business.model.dto.*;
import com.itechart.security.business.model.dto.utils.RecruitmentOpportunityConverter;
import com.itechart.security.business.model.enums.RecruitmentOpportunityType;
import com.itechart.security.business.model.persistent.*;
import com.itechart.security.business.model.persistent.linkedin.LinkedInSearchContact;
import com.itechart.security.business.service.ContactService;
import com.itechart.security.business.service.LinkedInService;
import com.itechart.security.business.service.ParsingService;
import com.itechart.security.business.service.RecruitmentOpportunityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.time.Instant;
import java.util.*;

import static com.itechart.security.business.model.dto.utils.RecruitmentOpportunityConverter.convert;

/**
 * Created by pavel.urban on 11/17/2016.
 */
@Service
public class RecruitmentOpportunityServiceImpl implements RecruitmentOpportunityService {

    private static final Logger log = LoggerFactory.getLogger(RecruitmentOpportunityServiceImpl.class);

    @Autowired
    private RecruitmentOpportunityDao recruitmentOpportunityDao;

    @Autowired
    private LinkedInSearchContactDao linkedInSearchContactDao;

    @Autowired
    private VacancyDao vacancyDao;

    @Autowired
    private ContactDao contactDao;

    @Autowired
    private ContactService contactService;

    @Autowired
    private LinkedInService linkedInService;

    @Autowired
    private ParsingService parsingService;

    @Value("${oportunity.status.logic}")
    private String opportunityStatusLogicStr;

    private JsonNode opportunityStatusLogicJson = null;


    @Override
    public String getOpportunityStatusLogicStr(){
        return this.opportunityStatusLogicStr;
    }

    @Override
    @Transactional
    public List getOpportunityStatusByDate(Date start, Date end) {
        return recruitmentOpportunityDao.getOpportunityStatusByDate(start, end);
    }

    @Override
    @Transactional
    public List getOpportunityStatisticData(Date start, Date end, Long vacancyId) {
        return recruitmentOpportunityDao.getOpportunityStatisticData(start, end, vacancyId);
    }

    @Override
    @Transactional(readOnly = false)
    public Long saveOpportunityWithAction(LinkedInCandidatDto candidat) {
        Vacancy vacancy = vacancyDao.get(candidat.getVacancyId());
        LinkedInSearchContact linkedInSearchContact = linkedInSearchContactDao.get(candidat.getLinkedInSearchResultId());
        RecruitmentOpportunity opportunity = recruitmentOpportunityDao.getRecruitmentOportunityByLinkedInIdAndVacancyId(linkedInSearchContact,vacancy);
        return opportunity == null ? createOpportunity(candidat, linkedInSearchContact, vacancy) : null;
    }

    @Override
    @Transactional(readOnly = false)
    public Long saveOpportunityWithCV(Integer vacancyId, ContactDto dto) {
        LinkedInSearchContact linkedInSearchContact = new LinkedInSearchContact();
        linkedInSearchContact.setFirstname(dto.getFirstName());
        linkedInSearchContact.setImageUri(dto.getPhotoUrl());
        linkedInSearchContact.setLastName(dto.getLastName());
        linkedInSearchContact.setPosition(dto.getPosition());
        Long id = linkedInService.saveOrUpdateLinkedInSearchContact(linkedInSearchContact);
        LinkedInCandidatDto candidat = new LinkedInCandidatDto();
        candidat.setLinkedInSearchResultId(id);
        candidat.setRecruitmentOpportunityType(RecruitmentOpportunityType.CONSIDER);
        candidat.setVacancyId(vacancyId);
        Vacancy vacancy = vacancyDao.get(candidat.getVacancyId());
        RecruitmentOpportunity opportunity = recruitmentOpportunityDao.getRecruitmentOportunityByLinkedInIdAndVacancyId(linkedInSearchContact,vacancy);
        return createOpportunityByCV(candidat, linkedInSearchContact, vacancy, dto.getId());
    }

    private Long createOpportunity(LinkedInCandidatDto candidat, LinkedInSearchContact linkedInSearchContact, Vacancy vacancy){
        RecruitmentOpportunity opportunity = new RecruitmentOpportunity(candidat.getRecruitmentOpportunityType(), candidat.getReason(), linkedInSearchContact, vacancy);
        Contact contact = contactDao.getByLinkedInId(linkedInSearchContact.getLinkedinId());
        Long contactId = null;
        if(contact == null){
            String workingLink = linkedInService.getWorkingLinkedInProfileLink(linkedInSearchContact.getProfileUri());
            if(!workingLink.equals("")) {
                contact = parsingService.parseAndCreateNewContact(workingLink, linkedInSearchContact.getLinkedinId());
                contactService.saveContactHistory(contact.getId(), true);
                contactId = contact.getId();
                updateLinkedInProfileLink(linkedInSearchContact,workingLink);
                opportunity.setContactWasCreated(true);
            }
        }else{
            checkLinkedInProfileAndUpdate(contact,linkedInSearchContact);
        }
        opportunity.setContact(contact);
        recruitmentOpportunityDao.save(opportunity);

        RecruitmentOpportunityStatusHistory status = new RecruitmentOpportunityStatusHistory(candidat.getRecruitmentOpportunityType(),candidat.getReason(),"",Date.from(Instant.now()),opportunity);
        Set<RecruitmentOpportunityStatusHistory> statuses = new HashSet<>();
        statuses.add(status);
        opportunity.setStatuses(statuses);
        recruitmentOpportunityDao.save(opportunity);

        return contactId;
    }

    private Long createOpportunityByCV(LinkedInCandidatDto candidat, LinkedInSearchContact linkedInSearchContact, Vacancy vacancy, Long contactId){
        RecruitmentOpportunity opportunity = new RecruitmentOpportunity(candidat.getRecruitmentOpportunityType(), candidat.getReason(), linkedInSearchContact, vacancy);
        Contact contact = contactDao.get(contactId);
        opportunity.setContact(contact);
        recruitmentOpportunityDao.save(opportunity);
        RecruitmentOpportunityStatusHistory status = new RecruitmentOpportunityStatusHistory(candidat.getRecruitmentOpportunityType(),candidat.getReason(),"",Date.from(Instant.now()),opportunity);
        Set<RecruitmentOpportunityStatusHistory> statuses = new HashSet<>();
        statuses.add(status);
        opportunity.setStatuses(statuses);
        recruitmentOpportunityDao.save(opportunity);
        return contactId;
    }

    private void updateLinkedInProfileLink(LinkedInSearchContact linkedInSearchContact,String profileLink){
        linkedInSearchContact.setProfileUri(profileLink);
        linkedInSearchContactDao.saveLinkedInSearchContact(linkedInSearchContact);
    }

    private void checkLinkedInProfileAndUpdate(Contact contact,LinkedInSearchContact linkedInSearchContact){
        String linkedInWorkingLink = getLinkedInUri(contact.getSocialNetworks());
        if(!linkedInWorkingLink.equals("")){
            updateLinkedInProfileLink(linkedInSearchContact,linkedInWorkingLink);
        }
    }

    private String getLinkedInUri(Set<SocialNetworkAccount> networks){
        for(SocialNetworkAccount network:networks){
            if(network.getUrl().indexOf("linkedin.com")!=-1) return network.getUrl();
        }
        return "";
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecruitmentOpportunityDto> findRecruitmentOpportunities(RecruitmentOpportunityFilterDto filter) {
        return RecruitmentOpportunityConverter.convert(recruitmentOpportunityDao.find(convert(filter)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecruitmentOpportunityDto> getRecruitmentOpportunityDtosByVacancyId(Integer vacancyId) {
        return RecruitmentOpportunityConverter.convert(recruitmentOpportunityDao.findByVacancyId(vacancyId));
    }

    @Override
    @Transactional(readOnly = true)
    public int countOpportunities(RecruitmentOpportunityFilterDto filter) {
        return recruitmentOpportunityDao.count(convert(filter));
    }

    @Override
    @Transactional(readOnly = false)
    public boolean updateOpportunity(RecruitmentOpportunityDto dto) {
        RecruitmentOpportunity opportunity = recruitmentOpportunityDao.get(dto.getId());
        if(checkOpportunityStatus(dto.getStatus(),opportunity.getStatus())) {
            opportunity.setStatus(dto.getStatus());
            opportunity.setStatusDate(Date.from(Instant.now()));
            opportunity.setReason(dto.getReason());
            opportunity.setComment(dto.getComment());
            RecruitmentOpportunityStatusHistory statusForHistory = new RecruitmentOpportunityStatusHistory(dto.getStatus(), dto.getReason(), dto.getComment(), Date.from(Instant.now()), opportunity);
            Set<RecruitmentOpportunityStatusHistory> statusesFromHistory = opportunity.getStatuses();
            statusesFromHistory.add(statusForHistory);
            opportunity.setStatuses(statusesFromHistory);

            recruitmentOpportunityDao.save(opportunity);
            return true;
        }else return false;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VacancyStatisticDto> getOpportunityStatusByDateAndVacancy(List<VacancyDto> vacancies, Date start, Date end){
        List<VacancyStatisticDto> reportData = new ArrayList<>();

        vacancies.forEach(vacancyDto -> {
            Map<String, Long> statMap = new HashMap();
            List<Object> list =
                    recruitmentOpportunityDao.getOpportunityStatusByDateAndVacancy(vacancyDto.getId(), start, end);

            putListToMap(list, statMap);

            VacancyStatisticDto statisticDto = new VacancyStatisticDto();
            statisticDto.setVacancy(vacancyDto);
            statisticDto.setStatistic(statMap);
            reportData.add(statisticDto);
        });
        return reportData;
    }

    private boolean checkOpportunityStatus(RecruitmentOpportunityType status,RecruitmentOpportunityType currentStatus){
        JsonNode logicJson = getOpportunityStatusLogicJson();
        JsonNode linkedStatuses = getStatusJsonById(currentStatus.toString(),logicJson).get("linkedStatuses");
        for(int i=0;i<linkedStatuses.size();i++){
            if(linkedStatuses.get(i).get("key").asText().equals(status.toString())) return true;
        }
        return false;
    }

    private JsonNode getStatusJsonById(String statusId, JsonNode logicJson){
        for(int i=0;i<logicJson.size();i++){
            if(logicJson.get(i).get("id").asText().equals(statusId)) return logicJson.get(i);
        }
        return null;
    }

    private JsonNode getOpportunityStatusLogicJson(){
        if(this.opportunityStatusLogicJson == null) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode logicJson = null;
            try {
                logicJson = mapper.readTree(this.opportunityStatusLogicStr);
                this.opportunityStatusLogicJson = logicJson;
            } catch (Exception e) {
                log.error("Can't parse json string!!!");
            }
        }
        return this.opportunityStatusLogicJson;
    }

    private void putListToMap(List list, Map<String, Long> statisticMap){
        list.forEach(item -> {
            Object[] o = (Object[]) item;
            String key = (String) o[0];
            BigInteger value = (BigInteger) o[1];
            statisticMap.put(key, value.longValue());
        });
    }

}
