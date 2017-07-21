package com.itechart.security.web.controller;

import com.itechart.security.business.filter.VacancyFilter;
import com.itechart.security.business.model.dto.VacancyDto;
import com.itechart.security.business.model.dto.VacancyFilterDto;
import com.itechart.security.business.model.dto.VacancyPriorityDto;
import com.itechart.security.business.model.dto.VacancyStatisticDto;
import com.itechart.security.business.service.DictionaryService;
import com.itechart.security.business.service.RecruitmentOpportunityService;
import com.itechart.security.business.service.ReportService;
import com.itechart.security.business.service.VacancyService;
import com.itechart.security.web.model.dto.DataPageDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.Date;
import java.util.List;

import static com.itechart.security.business.model.dto.utils.VacancyConverter.convert;
import static org.springframework.web.bind.annotation.RequestMethod.*;

/**
 * Created by artsiom.marenau on 11/17/2016.
 */
@RestController
public class VacancyController {

    private static final Logger logger = LoggerFactory.getLogger(VacancyController.class);

    @Autowired
    VacancyService vacancyService;

    @Autowired
    private ReportService reportService;

    @Autowired
    private DictionaryService dictionaryService;

    @Autowired
    private RecruitmentOpportunityService recruitmentOpportunityService;

    @RequestMapping(value = "/vacancies/{vacancyId}", method = GET)
    public VacancyDto get(@PathVariable Long vacancyId) {
        return vacancyService.get(vacancyId);
    }

    @RequestMapping("/vacancies")
    public DataPageDto find(VacancyFilterDto filterDto) {
        VacancyFilter filter = convert(filterDto);
        DataPageDto<VacancyDto> page = new DataPageDto<>();
        List<VacancyDto> vacancyDtos = vacancyService.findVacancies(filter);
        page.setData(vacancyDtos);
        page.setTotalCount(vacancyService.countVacancies(filter));
        return page;
    }

    @RequestMapping(value = "/vacancies/{vacancyId}", method = DELETE)
    public void delete(@PathVariable Long vacancyId) {
        vacancyService.deleteById(vacancyId);
    }

    @RequestMapping(value = "/vacancies", method = PUT)
    public void update(@RequestBody VacancyDto dto) {
        vacancyService.updateVacancy(dto);
    }

    @RequestMapping(value = "/vacancies", method = POST)
    public Long create(@RequestBody VacancyDto dto) {
        Long contactId = vacancyService.saveVacancy(dto);
        return contactId;
    }

    @RequestMapping(value = "/dictionary/education/types", method = GET)
    public List<String> getEducationTypes(){
        return dictionaryService.getEducationTypes();
    }

    @RequestMapping(value = "/dictionary/priorities", method = GET)
    public List<VacancyPriorityDto> getPriorities(){
        return dictionaryService.getPriorities();
    }

    @RequestMapping(value = "/vacancies/{vacancyId}/update/date", method = PUT)
    public Date updateSearchDate(@PathVariable Long vacancyId) {
        return vacancyService.updateSearchDate(vacancyId);
    }

    @RequestMapping(value = "/vacancies/status/count/from/{start}/to/{end}", method = GET)
    public List countVacanciesByStatus(@PathVariable Long start, @PathVariable Long end){
        return vacancyService.countVacanciesByStatus(new Date(start), new Date(end));
    }

    @RequestMapping(value = "/vacancies/report/generate", method = POST)
    @ResponseBody
    public String generateReport(@RequestBody VacancyFilterDto filterDto){
        VacancyFilter filter = convert(filterDto);
        List<VacancyDto> vacancies = vacancyService.findVacancies(filter);
        Date startDate = new Date(filterDto.getDisplayedPeriodStart());
        Date endDate = new Date(filterDto.getDisplayedPeriodEnd());
        List<VacancyStatisticDto> vacancyStatistics =
                recruitmentOpportunityService.getOpportunityStatusByDateAndVacancy(vacancies, startDate, endDate);
        File file = reportService.vacancyReport(vacancyStatistics, startDate, endDate);
        return file.getAbsolutePath();
    }

}
