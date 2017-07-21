package com.itechart.security.business.service;

import com.itechart.security.business.model.dto.ContactDto;
import com.itechart.security.business.model.dto.VacancyStatisticDto;
import com.itechart.security.business.service.enums.FileType;

import java.io.File;
import java.util.Date;
import java.util.List;

public interface ReportService {

    File report(ContactDto contact, FileType fileType);

    File vacancyReport(List<VacancyStatisticDto> vacancyStatistics, Date startDate, Date endDate);
}
