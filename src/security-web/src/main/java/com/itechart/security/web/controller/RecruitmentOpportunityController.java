package com.itechart.security.web.controller;

import com.itechart.security.business.model.dto.*;
import com.itechart.security.business.model.enums.ObjectTypes;
import com.itechart.security.business.service.RecruitmentOpportunityService;
import com.itechart.security.web.model.dto.DataPageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * Created by pavel.urban on 11/22/2016.
 */
@RestController
@PreAuthorize("hasAnyRole('MANAGER', 'SPECIALIST')")
public class RecruitmentOpportunityController extends SecuredController {

    @Override
    public ObjectTypes getObjectType() {
        return ObjectTypes.RECRUITMENT_OPPORTUNITY;
    }

    @Autowired
    private RecruitmentOpportunityService recruitmentOpportunityService;


    @RequestMapping(value = "/getRecruitmentOpportunitiesForVacancy", method = POST)
    public DataPageDto getRecruitmentOpportunitiesForVacancy(@RequestBody RecruitmentOpportunityFilterDto filterDto) {
        DataPageDto<RecruitmentOpportunityDto> page = new DataPageDto<>();
        List<RecruitmentOpportunityDto> recruitmentOpportunityDtos = recruitmentOpportunityService.findRecruitmentOpportunities(filterDto);
        page.setData(recruitmentOpportunityDtos);
        page.setTotalCount(recruitmentOpportunityService.countOpportunities(filterDto));
        return page;
    }

    @RequestMapping(value = "/updateOpportunity", method = POST)
    public boolean updateOpportunity(@RequestBody RecruitmentOpportunityDto dto) {
        recruitmentOpportunityService.updateOpportunity(dto);
        return true;
    }

    @RequestMapping(value = "/getOpportunityStatusLogicJSON", method = GET)
    public String getOpportunityStatusLogicStr(){
        return recruitmentOpportunityService.getOpportunityStatusLogicStr();
    }

    @RequestMapping(value = "/opportunity/statuses/from/{periodStart}/to/{periodEnd}", method = GET)
    public List getOpportunityStatusByDate(@PathVariable Long periodStart, @PathVariable Long periodEnd ){
        return recruitmentOpportunityService.getOpportunityStatusByDate(new Date(periodStart), new Date(periodEnd));
    }

    @RequestMapping(value = "/opportunity/statistic/from/{periodStart}/to/{periodEnd}/vacancy/{vacancyId}", method = GET)
    public List getOpportunityStatisticData(@PathVariable Long periodStart, @PathVariable Long periodEnd, @PathVariable Long vacancyId ){
        return recruitmentOpportunityService.getOpportunityStatisticData(new Date(periodStart), new Date(periodEnd), vacancyId);
    }
}
