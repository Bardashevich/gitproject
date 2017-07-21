package com.itechart.security.business.service.impl;

import com.itechart.security.business.model.dto.ContactDto;
import com.itechart.security.business.model.dto.VacancyStatisticDto;
import com.itechart.security.business.service.ReportService;
import com.itechart.security.business.service.enums.FileType;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRCsvExporter;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.export.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.map.HashedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportServiceImpl.class);

    /**
     * Labels for parameters in jrxml
     */
    private final String NAME = "Name";
    private final String BIRTH_DATE = "BirthDate";
    private final String NATIONALITY = "Nationality";
    private final String PHOTO_URL = "PhotoURL";
    private final String INDUSTRY = "Industry";
    private final String SUB_REPORT_EMAIL_BEAN_LIST = "subReportEmailBeanList";
    private final String SUB_REPORT_EDUCATION_BEAN_LIST = "subReportEducationBeanList";
    private final String SUB_REPORT_PROF_EXPERIENCE_BEAN_LIST = "subReportProfExperienceBeanList";
    private final String SUB_REPORT_SKILLS = "subReportSkills";
    private final String EMAIL_SUBREPORT = "emailSubreport";
    private final String EDUCATION_SUBREPORT = "educationSubreport";
    private final String PROF_EXPERIENCE_SUBREPORT = "profExperienceSubreport";
    private final String DATE_FORMAT = "dateFormat";

    private final String DEFAULT_IMG_PATH = "resources/img/default_img.png";

    private String templatePath;
    private String dateFormatPattern;
    private String masterTemplateFile;
    private String emailTemplateFile;
    private String educationTemplateFile;
    private String profExperienceFile;
    private String vacanciesTemplateFile;
    private DateFormat dateFormat;

    private String getSkillNames(ContactDto contact) {
        String skills = "";
        if (!CollectionUtils.isEmpty(contact.getSkills())) {
            skills = contact.getSkills().stream().map((skill) -> skill.getName()).collect(Collectors.joining(", "));
        }
        return skills;
    }

    private JasperReport loadJasperReport(String fileName) throws IOException, JRException {

        JasperReport jr = null;
        try {
            ClassLoader classLoader = getClass().getClassLoader();
            URL reportUrl = classLoader.getResource(templatePath + "/" + fileName);
            jr = JasperCompileManager.compileReport(reportUrl.openStream());
        }catch (Exception e){
            log.debug(e.getLocalizedMessage());
        }
        return jr;
    }

    private Map<String, Object> generateParams(ContactDto contact) throws JRException, IOException {
        Map<String, Object> params = new HashedMap();

        String fullName = contact.getFirstName() + " " + contact.getLastName() +
                ((contact.getPatronymic() == null) ? "" : " " + contact.getPatronymic());
        dateFormat = new SimpleDateFormat(dateFormatPattern);

        params.put(NAME, fullName);
        params.put(BIRTH_DATE, (contact.getDateOfBirth() == null) ? "" : dateFormat.format(contact.getDateOfBirth()));
        params.put(NATIONALITY, (contact.getNationality() == null) ? "" : contact.getNationality());
        params.put(PHOTO_URL, (contact.getPhotoUrl() == null) ? DEFAULT_IMG_PATH : contact.getPhotoUrl());
        params.put(INDUSTRY, (contact.getIndustry() == null) ? "" : contact.getIndustry());
        params.put(SUB_REPORT_EMAIL_BEAN_LIST, new ArrayList(contact.getEmails()));
        params.put(SUB_REPORT_EDUCATION_BEAN_LIST, new ArrayList(contact.getEducations()));
        params.put(SUB_REPORT_PROF_EXPERIENCE_BEAN_LIST, new ArrayList(contact.getWorkplaces()));
        params.put(SUB_REPORT_SKILLS, getSkillNames(contact));

        params.put(EMAIL_SUBREPORT, loadJasperReport(emailTemplateFile));
        params.put(EDUCATION_SUBREPORT, loadJasperReport(educationTemplateFile));
        params.put(PROF_EXPERIENCE_SUBREPORT, loadJasperReport(profExperienceFile));
        params.put(DATE_FORMAT, dateFormat);

        return params;
    }

    private String generateFileName(ContactDto contact) {
        return contact.getFirstName() + " " + contact.getLastName();
    }

    /**
     * Removes report-files, if they exists
     *
     * @param filePath
     */
    private File prepareFolder(String filePath) {

        File file = null;

        try {
            file = File.createTempFile("tmp", filePath);
            file.deleteOnExit();
        } catch (IOException e) {
            log.error(e.getLocalizedMessage());
        }
        return file;
    }

    private File generateReports(JasperPrint jasperPrint, String fileName, FileType fileType) throws JRException {

        String filePath = fileName;
        File file = prepareFolder(filePath);

        JRAbstractExporter exporter = null;

        switch (fileType) {
            case PDF: {

                exporter = new JRPdfExporter();
                break;
            }
            case DOCX: {

                exporter = new JRDocxExporter();
                break;
            }
            case XLS: {

                exporter = new JRXlsExporter();
                SimpleXlsReportConfiguration xlsReportConfiguration = new SimpleXlsReportConfiguration();

                xlsReportConfiguration.setIgnorePageMargins(true);
                xlsReportConfiguration.setRemoveEmptySpaceBetweenRows(false);
                xlsReportConfiguration.setDetectCellType(false);

                exporter.setConfiguration(xlsReportConfiguration);

                break;
            }
        }

        if (exporter != null) {
            exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
            exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(file));
            exporter.exportReport();
        }

        return file;
    }

    private File generateVacanciesReport(JasperPrint jasperPrint) throws JRException{

        final String fileName = "vacancies.csv";
        File file = prepareFolder(fileName);

        JRAbstractExporter exporter = new JRCsvExporter();
        SimpleCsvExporterConfiguration csvReportConfiguration = new SimpleCsvExporterConfiguration();
        csvReportConfiguration.setWriteBOM(true);
        exporter.setConfiguration(csvReportConfiguration);

        exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        exporter.setExporterOutput(new SimpleWriterExporterOutput(file));
        exporter.exportReport();

        return file;
    }

    @Override
    public File report(ContactDto contact, FileType fileType) {

        File file = null;

        try {
            // Creates jasper template from jrxml template
            JasperReport jasperMainReport = loadJasperReport(masterTemplateFile);
            Map<String, Object> params = generateParams(contact);

            JasperPrint reportPrint = JasperFillManager.fillReport(jasperMainReport, params, new JREmptyDataSource(1));

            file = generateReports(reportPrint, generateFileName(contact), fileType);
        } catch (JRException e) {
            log.error(e.getLocalizedMessage());
        } catch (IOException e) {
            log.error(e.getLocalizedMessage());
        }
        return file;
    }

    @Override
    public File vacancyReport(List<VacancyStatisticDto> vacancyStatistics, Date startDate, Date endDate) {

        File file = null;
        try {

            JasperReport jasperReport = loadJasperReport(vacanciesTemplateFile);
            Map<String, Object> params = new HashedMap();

            dateFormat = new SimpleDateFormat(dateFormatPattern);
            params.put(DATE_FORMAT, dateFormat);
            params.put("startDate", startDate);
            params.put("endDate", endDate);

            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(vacancyStatistics);

            JasperPrint reportPrint = JasperFillManager.fillReport(jasperReport, params, dataSource);

            file = generateVacanciesReport(reportPrint);
        } catch (JRException e) {
            log.error(e.getLocalizedMessage());
        } catch (IOException e){
            log.error(e.getLocalizedMessage());
        }
        return file;
    }

    public void setTemplatePath(String templatePath) {
        this.templatePath = templatePath;
    }

    public void setDateFormatPattern(String dateFormatPattern) {
        this.dateFormatPattern = dateFormatPattern;
    }

    public void setMasterTemplateFile(String masterTemplateFile) {
        this.masterTemplateFile = masterTemplateFile;
    }

    public void setEmailTemplateFile(String emailTemplateFile) {
        this.emailTemplateFile = emailTemplateFile;
    }

    public void setEducationTemplateFile(String educationTemplateFile) {
        this.educationTemplateFile = educationTemplateFile;
    }

    public void setProfExperienceFile(String profExperienceFile) {
        this.profExperienceFile = profExperienceFile;
    }

    public void setVacanciesTemplateFile(String vacanciesTemplateFile) {
        this.vacanciesTemplateFile = vacanciesTemplateFile;
    }
}
