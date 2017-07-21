package com.itechart.security.business.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itechart.security.business.dao.ContactDao;
import com.itechart.security.business.dao.CountryDao;
import com.itechart.security.business.exception.BusinessServiceException;
import com.itechart.security.business.model.dto.*;
import com.itechart.security.business.model.dto.utils.SkillConverter;
import com.itechart.security.business.model.dto.utils.UniversityEducationConverter;
import com.itechart.security.business.model.dto.utils.WorkplaceConverter;
import com.itechart.security.business.model.enums.LanguageEnum;
import com.itechart.security.business.model.enums.LanguageLevelEnum;
import com.itechart.security.business.model.persistent.Address;
import com.itechart.security.business.model.persistent.Contact;
import com.itechart.security.business.model.persistent.Country;
import com.itechart.security.business.model.persistent.SocialNetworkAccount;
import com.itechart.security.business.model.persistent.linkedin.LinkedInSearchContact;
import com.itechart.security.business.model.persistent.linkedin.LinkedInSnippet;
import com.itechart.security.business.service.LinkedInService;
import com.itechart.security.business.service.ParsingService;
import com.itechart.security.business.service.RecruitmentOpportunityService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.poi.xwpf.usermodel.*;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.text.DateFormatSymbols;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ParsingServiceImpl implements ParsingService {
    private static final Logger log = LoggerFactory.getLogger(ParsingServiceImpl.class);

    private static final String SKYPE = "Skype";
    private static final long SKYPE_ID = 1L;
    private static final String LINKED_IN = "LinkedIn";
    private static final long LINKED_IN_ID = 2L;
    private static final String ICQ = "ICQ";
    private static final long ICQ_ID = 4L;
    private static final String FACEBOOK = "Facebook";
    private static final long FACEBOOK_ID = 1L;
    private static final String EMAIL_REGEX = "(.*)@(.*)";
    private static final String EMPLOYMENT_RU = "Занятость";
    private static final String EMPLOYMENT_EN = "Employment";
    private static final String SCHEDULE_RU = "График работы";
    private static final String SCHEDULE_EN = "Work schedule";
    private static final String TIME_FOR_ROUTE_RU = "Желательное время в пути до работы";
    private static final String TIME_FOR_ROUTE_EN = "travel time to work";
    private static final String COVERING_LETTER_RU = "Сопроводительное письмо";
    private static final String COVERING_LETTER_EN = "Сопроводительное письмо";
    private static final String POSITION_AND_SALARY_RU = "Желаемая должность и зарплата";
    private static final String POSITION_AND_SALARY_EN = "Desired position and salary";
    private static final String DEVELOPMENT_COURSES_RU = "Повышение квалификации, курсы";
    private static final String DEVELOPMENT_COURSES_EN = "Professional development, courses";
    private static final String CERTIFICATES_RU = "Электронные сертификаты";
    private static final String CERTIFICATES_EN = "Electronic certificates";
    private static final String TESTS_AND_EXAMS_RU = "Тесты, экзамены";
    private static final String TESTS_AND_EXAMS_EN = "Tests, examinations";
    private static final String EDUCATION_RU = "Образование";
    private static final String EDUCATION_EN = "Education";
    private static final String EXPERIENCE_RU = "Опыт работы";
    private static final String EXPERIENCE_EN = "Work experience";
    private static final String KEY_SKILLS_RU = "Ключевые навыки";
    private static final String KEY_SKILLS_EN = "Key skills";
    private static final String LANGUAGES_RU = "Знание языков";
    private static final String LANGUAGES_EN = "Languages";
    private static final String SKILLS_RU = "Навыки";
    private static final String SKILLS_EN = "Skills";
    private static final String MALE_RU = "Мужчина";
    private static final String MALE_EN = "Male";
    private static final String JPEG = "jpeg";
    private static final String JPG = "jpg";
    private static final String PNG = "png";
    private static final String GIF = "gif";
    private static final String BMP = "bmp";

    private static final int CONTACT_INFO_INDEX = 0;

    private final static String[] MONTHS = {"январь", "февраль", "март", "апрель", "май", "июнь",
            "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь", "january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"};

    private final static String[] BIRTH_DATE_MONTHS = {"января", "февраля", "марта", "апреля", "мая", "июня",
            "июля", "августа", "сентября", "октября", "ноября", "декабря", "january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"};

    private final static DateFormatSymbols DFS = new DateFormatSymbols(){
        @Override
        public String[] getMonths() {
            return MONTHS;
        }
    };

    private final static DateFormatSymbols BIRTH_DATE_DFS = new DateFormatSymbols(){
        @Override
        public String[] getMonths() {
            return BIRTH_DATE_MONTHS;
        }
    };

    private final static SimpleDateFormat MONTH_AND_YEAR_SDF = new SimpleDateFormat("MMMM yyyy", DFS);
    private final static SimpleDateFormat YEAR_SDF = new SimpleDateFormat("yyyy");
    private final static SimpleDateFormat BIRTH_DATE_SDF = new SimpleDateFormat("dd MMMM yyyy", BIRTH_DATE_DFS);

    @Autowired
    private CountryDao countryDao;

    @Autowired
    private LinkedInService linkedInService;

    @Autowired
    private ContactDao contactDao;

    @Autowired
    private RecruitmentOpportunityService recruitmentOpportunityService;

    @Override
    @Transactional
    public ContactDto parseCVProfile(XWPFDocument document) {
        ContactDto dto = new ContactDto();

        //load picture if exists
        if (document.getAllPictures().size() > 0){
            //todo save picture to right dir
            //loadPicture(document);
        }

        document.getBodyElements().forEach(u->{

            BodyElementType type = u.getElementType();

            if (BodyElementType.TABLE.equals(type)) {
                XWPFTable table = ((XWPFTable)u);

                //parse contact info
                if (table.getRow(CONTACT_INFO_INDEX).getCell(1) != null){
                    //With photo
                    parseContactInfoParagraph(dto, table.getRow(CONTACT_INFO_INDEX).getCell(1).getParagraphs());
                }else {
                    //Without photo
                    parseContactInfoParagraph(dto, table.getRow(CONTACT_INFO_INDEX).getCell(0).getParagraphs());
                }

                int i = 1; //start parsing index

                if (COVERING_LETTER_RU.equals(table.getRow(i).getCell(0).getText()) ||
                        COVERING_LETTER_EN.equals(table.getRow(i).getCell(0).getText())) {
                    log.debug("covering letter - "+table.getRow(++i).getCell(0).getText());
                    i++;
                }

                //parse contact position info
                if (POSITION_AND_SALARY_RU.equals(table.getRow(i).getCell(0).getText()) ||
                        POSITION_AND_SALARY_EN.equals(table.getRow(i).getCell(0).getText())) {
                    parseContactPositionParagraph(dto, table.getRow(++i).getCell(0).getParagraphs());
                    i++;
                    //dto.setPosition(table.getRow(i).getCell(0).getText());
                }

                //parse work experience
                if (table.getRow(i).getCell(0).getText().startsWith(EXPERIENCE_RU) ||
                        table.getRow(i).getCell(0).getText().startsWith(EXPERIENCE_EN)) {
                    i++;
                    HashSet<WorkplaceDto> workplaces = new HashSet<>();
                    while(table.getRow(i).getCell(1) != null) {
                        workplaces.add(parseWorkExperienceRow(table.getRow(i++)));
                    }
                    dto.setWorkplaces(workplaces);
                }

                //parse education
                if (EDUCATION_RU.equals(table.getRow(i).getCell(0).getText()) ||
                        EDUCATION_EN.equals(table.getRow(i).getCell(0).getText())) {
                    i++;
                    log.debug("education - "+table.getRow(i).getCell(0).getText());
                    i++;
                    HashSet<UniversityEducationDto> educations = new HashSet<>();
                    while(table.getRow(i).getCell(1) != null) {
                        educations.add(parseEducationRow(table.getRow(i++)));
                    }
                    dto.setEducations(educations);
                }

                //parse courses
                if (DEVELOPMENT_COURSES_RU.equals(table.getRow(i).getCell(0).getText()) ||
                        DEVELOPMENT_COURSES_EN.equals(table.getRow(i).getCell(0).getText())) {
                    i++;
                    log.debug("Courses");
                    while (table.getRow(i).getCell(1) != null) {
                        log.debug("year - "+table.getRow(i).getCell(0).getText());
                        log.debug("course - "+table.getRow(i).getCell(1).getText());
                        i++;
                    }
                }

                //parse tests, exams
                if (TESTS_AND_EXAMS_RU.equals(table.getRow(i).getCell(0).getText()) ||
                        TESTS_AND_EXAMS_EN.equals(table.getRow(i).getCell(0).getText())) {
                    i++;
                    log.debug("Tests and exams");
                    while (table.getRow(i).getCell(1) != null) {
                        log.debug("year - "+table.getRow(i).getCell(0).getText());
                        log.debug("test/exam - "+table.getRow(i).getCell(1).getText());
                        i++;
                    }
                }

                //parse certificates
                if (CERTIFICATES_RU.equals(table.getRow(i).getCell(0).getText()) ||
                        CERTIFICATES_EN.equals(table.getRow(i).getCell(0).getText())) {
                    i++;
                    log.debug("Certificates");
                    while (table.getRow(i).getCell(1) != null) {
                        log.debug("year - "+table.getRow(i).getCell(0).getText());
                        log.debug("certificate - "+table.getRow(i).getCell(1).getText());
                        i++;
                    }
                }

                //parse skills
                if (KEY_SKILLS_RU.equals(table.getRow(i).getCell(0).getText()) ||
                        KEY_SKILLS_EN.equals(table.getRow(i).getCell(0).getText())) {

                    i++;
                    LanguageDto languageDto;
                    HashSet<LanguageDto> languages = new HashSet<>();
                    HashSet<SkillDto> skills = new HashSet<>();
                    while (table.getRow(i) != null && table.getRow(i).getCell(1) != null) {

                        if (LANGUAGES_RU.equals(table.getRow(i).getCell(0).getText()) ||
                                LANGUAGES_EN.equals(table.getRow(i).getCell(0).getText())) {

                            String[] languageAndLevel;
                            log.debug("Languages");

                            //// TODO: 2/15/2017 add language for russian

                            for (XWPFParagraph language : table.getRow(i).getCell(1).getParagraphs()){

                                languageAndLevel = language.getText().split(" — ");
                                languageDto = new LanguageDto();

                                languageDto.setName(LanguageEnum.ENGLISH.name());
                                log.debug("language - "+languageAndLevel[0]);

                                languageDto.setLevel(LanguageLevelEnum.BEGINNER.name());
                                log.debug("level - "+languageAndLevel[1]);
                                languages.add(languageDto);
                            }
                        }

                        if (SKILLS_RU.equals(table.getRow(i).getCell(0).getText()) ||
                                SKILLS_EN.equals(table.getRow(i).getCell(0).getText())){

                            log.debug("Skills");
                            Arrays.stream(table.getRow(i).getCell(1).getText().split("  ")).forEach(s -> {
                                SkillDto skill = new SkillDto();
                                skill.setName(s);
                                skills.add(skill);
                            });
                        }
                        i++;
                    }
                    dto.setLanguages(languages);
                    dto.setSkills(skills);
                }
            }
        });
        return dto;
    }

    private static void parseContactInfoParagraph(ContactDto dto, List<XWPFParagraph> contactInfoParagraphs) {
        String paragraphText;

        String[] names = contactInfoParagraphs.get(0).getText().split(" ");
        dto.setFirstName(names[1]);
        dto.setLastName(names[0]);
        log.debug("surname - "+names[0]);
        log.debug("fname - "+names[1]);
        if (names.length > 2){
            dto.setPatronymic(names[2]);
            log.debug("sname - "+names[2]);
        }

        String[] genderAndAge = contactInfoParagraphs.get(1).getText().split(", ");
        if (MALE_RU.equals(genderAndAge[0]) || MALE_EN.equals(genderAndAge[0])) {
            dto.setIsMale(true);
        }else {
            dto.setIsMale(false);
        }
        log.debug("gender - "+genderAndAge[0]);

        try {
            if (genderAndAge.length > 1) {

                log.debug("age - " + genderAndAge[1]);
                log.debug("birthdate - " + genderAndAge[2]);

                if (genderAndAge[2].contains("on")) {
                    dto.setDateOfBirth(BIRTH_DATE_SDF.parse(genderAndAge[2].substring(8)));
                    log.debug("birthdate - " + BIRTH_DATE_SDF.parse(genderAndAge[2].substring(8)));
                } else {

                    if (MALE_RU.equals(genderAndAge[0])) {
                        dto.setDateOfBirth(BIRTH_DATE_SDF.parse(genderAndAge[2].substring(8)));
                        log.debug("birthdate - " + BIRTH_DATE_SDF.parse(genderAndAge[2].substring(8)));
                    }else {
                        dto.setDateOfBirth(BIRTH_DATE_SDF.parse(genderAndAge[2].substring(9)));
                        log.debug("birthdate - " + BIRTH_DATE_SDF.parse(genderAndAge[2].substring(9)));
                    }
                }
            }
        }
        catch (ParseException ex) {
            ex.printStackTrace();
        }

        TelephoneDto telephone;
        EmailDto email;
        MessengerAccountDto messengerAccount;
        SocialNetworkAccountDto socialNetworkAccount;
        HashSet<TelephoneDto> telephones = new HashSet<>();
        HashSet<EmailDto> emails = new HashSet<>();
        HashSet<MessengerAccountDto> messengerAccounts= new HashSet<>();
        HashSet<SocialNetworkAccountDto> socialNetworks = new HashSet<>();

        for (XWPFParagraph paragraph : contactInfoParagraphs){

            if (paragraph != null){

                paragraphText = paragraph.getText();

                if (paragraphText != null){

                    if (paragraphText.startsWith("+")){
                        telephone = new TelephoneDto();
                        telephone.setNumber(paragraphText.split(" — ")[0]);
                        telephones.add(telephone);
                        log.debug("telephone - "+paragraphText.split(" — ")[0]);
                    }
                    else if (paragraphText.matches(EMAIL_REGEX)){
                        email = new EmailDto();
                        email.setName(paragraphText.split(" — ")[0]);
                        emails.add(email);
                        log.debug("email - "+paragraphText.split(" — ")[0]);
                    }
                    else if (paragraphText.startsWith(SKYPE)){
                        messengerAccount = new MessengerAccountDto();
                        messengerAccount.setMessenger(SKYPE_ID);
                        messengerAccount.setUsername(paragraphText.split(" ")[1]);
                        messengerAccounts.add(messengerAccount);
                        log.debug("skype - "+paragraphText.split(" ")[1]);
                    }
                    else if (paragraphText.startsWith(LINKED_IN)){
                        socialNetworkAccount = new SocialNetworkAccountDto();
                        socialNetworkAccount.setSocialNetwork(LINKED_IN_ID);
                        socialNetworkAccount.setUrl(paragraphText.split(" ")[1]);
                        socialNetworks.add(socialNetworkAccount);
                        log.debug("linkedIn - "+paragraphText.split(" ")[1]);
                    }
                    else if (paragraphText.startsWith(ICQ)){
                        messengerAccount = new MessengerAccountDto();
                        messengerAccount.setMessenger(ICQ_ID);
                        messengerAccount.setUsername(paragraphText.split(" ")[1]);
                        messengerAccounts.add(messengerAccount);
                        log.debug("ICQ - "+paragraphText.split(" ")[1]);
                    }
                    else if (paragraphText.startsWith(FACEBOOK)){
                        socialNetworkAccount = new SocialNetworkAccountDto();
                        socialNetworkAccount.setSocialNetwork(FACEBOOK_ID);
                        socialNetworkAccount.setUrl(paragraphText.split(" ")[1]);
                        socialNetworks.add(socialNetworkAccount);
                        log.debug("facebook - "+paragraphText.split(" ")[1]);
                    }

                    dto.setTelephones(telephones);
                    dto.setEmails(emails);
                    dto.setMessengers(messengerAccounts);
                    dto.setSocialNetworks(socialNetworks);
                }
            }
        }
    }

    private static void parseContactPositionParagraph(ContactDto dto, List<XWPFParagraph> contactPositionParagraphs) {
        String paragraphText;

        log.debug("position - "+contactPositionParagraphs.get(0).getText());
        dto.setPosition(contactPositionParagraphs.get(0).getText());

        int i = 1;
        if (!"".equals(contactPositionParagraphs.get(i).getText())) {
            StringBuilder industry = new StringBuilder();
            while (!"".equals(contactPositionParagraphs.get(i).getText())){
                industry.append(contactPositionParagraphs.get(i).getText());
                industry.append(", ");
                log.debug("Professional sphere - "+contactPositionParagraphs.get(i++).getText());
            }
            dto.setIndustry(industry.substring(0,industry.length()-2));
        }

        for (XWPFParagraph paragraph : contactPositionParagraphs) {

            if (paragraph != null) {

                paragraphText = paragraph.getText();

                if (paragraphText.startsWith(EMPLOYMENT_RU) || paragraphText.startsWith(EMPLOYMENT_EN)){
                    log.debug("Занятость - "+paragraphText.split(": ")[1]);
                }
                else if (paragraphText.startsWith(SCHEDULE_RU) || paragraphText.startsWith(SCHEDULE_EN)){
                    log.debug("График работы - "+paragraphText.split(": ")[1]);
                }
                else if (paragraphText.startsWith(TIME_FOR_ROUTE_RU) || paragraphText.startsWith(TIME_FOR_ROUTE_EN)){
                    log.debug("Желательное время в пути до работы - "+paragraphText.split(": ")[1]);
                }
            }
        }
    }

    private static WorkplaceDto parseWorkExperienceRow(XWPFTableRow workExperienceRow) {
        log.debug("period of work - ");
        WorkplaceDto dto = new WorkplaceDto();
        String[] dates = workExperienceRow.getCell(0).getParagraphs().get(0).getText().split(" — ");
        dto.setStartDate(parseWorkPeriodDate(dates[0]));
        dto.setEndDate(parseWorkPeriodDate(dates[1]));

        List<XWPFParagraph> positionDescriptionParagraphs = workExperienceRow.getCell(2).getParagraphs();

        dto.setName(positionDescriptionParagraphs.get(0).getText());
        log.debug("company - " + positionDescriptionParagraphs.get(0).getText());

        if (positionDescriptionParagraphs.size() > 3) {

            log.debug("place, site - " + positionDescriptionParagraphs.get(1).getText());

            dto.setPosition(positionDescriptionParagraphs.get(2).getText());
            log.debug("position - " + positionDescriptionParagraphs.get(2).getText());

            dto.setComment(positionDescriptionParagraphs.get(3).getText());
            log.debug("responsibilities - " + positionDescriptionParagraphs.get(3).getText());
        } else {
            dto.setPosition(positionDescriptionParagraphs.get(1).getText());
            log.debug("position - " + positionDescriptionParagraphs.get(1).getText());

            dto.setComment(positionDescriptionParagraphs.get(2).getText());
            log.debug("responsibilities - " + positionDescriptionParagraphs.get(2).getText());
        }
        return dto;
    }

    private static UniversityEducationDto parseEducationRow(XWPFTableRow educationRow) {
        UniversityEducationDto dto = new UniversityEducationDto();

        dto.setEndDate(Integer.valueOf(educationRow.getCell(0).getText()));
        log.debug("graduate date - "+educationRow.getCell(0).getText());

        List<XWPFParagraph> educationParagraphs = educationRow.getCell(1).getParagraphs();

        dto.setName(educationParagraphs.get(0).getText());
        log.debug("university - "+educationParagraphs.get(0).getText());

        String[] facultyAndSpeciality = educationParagraphs.get(1).getText().split(", ");
        if (facultyAndSpeciality.length > 1){
            dto.setFaculty(facultyAndSpeciality[0]);
            log.debug("faculty - "+facultyAndSpeciality[0]);
            dto.setSpeciality(facultyAndSpeciality[1]);
            log.debug("speciality - "+facultyAndSpeciality[1]);
        }else {
            dto.setSpeciality(facultyAndSpeciality[0]);
            log.debug("speciality - "+facultyAndSpeciality[0]);
        }
        return dto;
    }

    private static Date parseWorkPeriodDate(String strDate) {
        Date date = null;
        try {

            if (strDate.startsWith("наст") || strDate.startsWith("till")) {
                date = new Date(System.currentTimeMillis());
            }
            else {
                date = MONTH_AND_YEAR_SDF.parse(strDate);
            }
            System.out.println(date);

        }catch (ParseException ex){
            ex.printStackTrace();
        }
        return date;
    }

    private static Date parseYearDate(String strDate) {
        Date date = null;
        try {

            date = YEAR_SDF.parse(strDate);
            System.out.println(date);

        }catch (ParseException ex){
            ex.printStackTrace();
        }
        return date;
    }

    private static void loadPicture(XWPFDocument document) {
        log.debug("Picture!!!");
        XWPFPictureData picture = document.getAllPictures().get(0);
        String picType = JPG;
        if (org.apache.poi.xwpf.usermodel.Document.PICTURE_TYPE_JPEG == picture.getPictureType()) {
            picType = JPEG;
        }
        else if (org.apache.poi.xwpf.usermodel.Document.PICTURE_TYPE_PNG == picture.getPictureType()) {
            picType = PNG;
        }
        else if (org.apache.poi.xwpf.usermodel.Document.PICTURE_TYPE_GIF == picture.getPictureType()) {
            picType = GIF;
        }
        else if (org.apache.poi.xwpf.usermodel.Document.PICTURE_TYPE_BMP == picture.getPictureType()) {
            picType = BMP;
        }
        try {
            ImageIO.write(ImageIO.read(new ByteArrayInputStream(picture.getData())),picType,new File("test."+picType));
        }catch (IOException ex){
            ex.printStackTrace();
        }
    }

    @Override
    @Transactional
    public LinkedInContactDto parse(String profileUrl) {
        log.debug("profile url = {}", profileUrl);
        Document document;
        LinkedInContactDto contact = new LinkedInContactDto();
        try {
            document = linkedInService.getLinkedinPage(profileUrl);
            if (Objects.isNull(document)) {
                return contact;
            }
            Pattern pattern = Pattern.compile("[a-zA-Z\\d\\s\\p{Punct}]*");
            Matcher matcher = pattern.matcher(getFirstName(document));
            if (matcher.matches()) {
                contact.setFirstNameEn(getFirstName(document));
            } else {
                contact.setFirstName(getFirstName(document));
            }
            matcher = pattern.matcher(getLastName(document));
            if (matcher.matches()) {
                contact.setLastNameEn(getLastName(document));
            } else {
                contact.setLastName(getLastName(document));
            }
            contact.setFullName(getFullName(document));
            contact.setLocation(getLocation(document));
            contact.setIndustry(getIndustry(document));
            contact.setSummary(getSummary(document));
            contact.setSkills(getSkillsDto(document));
            contact.setEducations(getUniversityEducationDto(document));
            contact.setPhotoUrl(getPicture(document));
            contact.setLanguages(getLanguages(document));
            contact.setWorkplaces(getWorkplaces(document, this::jobFilter));
            contact.setProjects(getProjects(document));
            Set<AddressDto> addressDtoSet = new HashSet<>();
            addressDtoSet.add(getAddressDto(contact.getLocation()));
            contact.setAddresses(addressDtoSet);
            contact.setLinkedInId(getLinkedInId(document));

        } catch (Exception e) {
            log.error("Can't get html page", profileUrl);
        }
        return contact;
    }

    @Override
    @Transactional
    public Contact parseAndCreateNewContact(String profileUrl, Long linkedInId) {
        log.debug("profile url = {}", profileUrl);
        Document document;
        Contact contact = new Contact();
        try {
            document = linkedInService.getLinkedinPage(profileUrl);
            if (Objects.isNull(document)) {
                return contact;
            }
            contact.setFirstName(getFirstName(document));
            contact.setLastName(getLastName(document));
            contact.setIndustry(getIndustry(document));
            contact.setPhotoUrl(getPicture(document));
            contact.setLinkedInId(linkedInId);
            contact.setId(contactDao.save(contact));
            contact.setSkills(SkillConverter.convert(getSkillsDto(document), contact));
            contact.setUniversityEducations(UniversityEducationConverter.convert(getUniversityEducationDto(document), contact));
            contact.setWorkplaces(WorkplaceConverter.convert(getWorkplaces(document, this::jobFilter), contact));
            Set<Address> addressSet = new HashSet<>();
            addressSet.add(getAddress(getLocation(document), contact));
            contact.setAddresses(addressSet);
            Set<SocialNetworkAccount> socialNetworkAccounts = new HashSet<>();
            SocialNetworkAccount social = new SocialNetworkAccount();
            social.setUrl(profileUrl);
            social.setContact(contact);
            socialNetworkAccounts.add(social);
            contact.setSocialNetworks(socialNetworkAccounts);
            contactDao.save(contact);
        } catch (Exception e) {
            log.error("Can't get html page", profileUrl);
        }
        return contact;
    }

    private Long getLinkedInId(Document page) {
        String pageStr = page.toString();
        int position = pageStr.indexOf("$.fn.Profile.memberId");
        String substr = pageStr.substring(position + 23, pageStr.indexOf("\"", position + 23));
        return Long.valueOf(substr);
    }

    private String getFullName(Document document) {
        return document.getElementById("name").text();
    }

    private List<String> splitNames(Document document) {
        return Arrays.asList(getFullName(document).split(" "));
    }


    private String getFirstName(Document document) {
        List<String> nameList = splitNames(document);
        return nameList.isEmpty() ? null : nameList.get(0);
    }

    private String getLastName(Document document) {
        List<String> nameList = splitNames(document);
        return nameList.size() <= 1 ? null : nameList.get(nameList.size() - 1);
    }

    private String getSummary(Document document) {
        Element summary = document.getElementById("summary-item-view");
        return Objects.isNull(summary) ? null : summary.getElementsByClass("description").text();
    }

    private String getLocation(Document document) {
        Element element = document.getElementById("location-container");
        return Objects.isNull(element) ? null : element.getElementsByClass("locality").text();
    }

    private String getIndustry(Document document) {
        Element element = document.getElementById("location-container");
        return Objects.isNull(element) ? null : element.getElementsByClass("industry").text();
    }

    private Set<SkillDto> getSkillsDto(Document document) {
        Element skillsTab = document.getElementById("skills-item-view");
        return Objects.isNull(skillsTab) ? new HashSet<>() : skillsTab.getElementsByClass("endorse-item-name").stream()
                .map(ParsingServiceImpl::getSkillDto).collect(Collectors.toSet());
    }

    private static SkillDto getSkillDto(Element element) {
        SkillDto dto = new SkillDto();
        dto.setName(element.text());
        return dto;
    }


    private Set<UniversityEducationDto> getUniversityEducationDto(Document document) {
        Element schools = document.getElementById("background-education");
        return Objects.isNull(schools) ? new HashSet<>() : schools.getElementsByClass("education").stream()
                .map(element -> {
                    UniversityEducationDto school = new UniversityEducationDto();
                    school.setName(element.getElementsByClass("summary").text());
                    school.setSpeciality(element.getElementsByClass("major").text());
                    List<Date> dates = getDateList(element.getElementsByClass("education-date").text());
                    school.setStartDate(getDate(dates, 0));
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(getDate(dates, 1));
                    school.setEndDate(cal.get(Calendar.YEAR));
                    school.setType("SIMPLE");
                    return school;
                }).collect(Collectors.toSet());
    }

    private String getPicture(Document document) {
        Elements photos = document.getElementsByClass("profile-picture");
        return photos.isEmpty() ? null : photos.select("img").attr("src");
    }

    private Set<LanguageDto> getLanguages(Document document) {
        Element languagesTabs = document.getElementById("languages-view");
        return Objects.isNull(languagesTabs) ? new HashSet<>() : languagesTabs.getElementsByClass("section-item").stream()
                .map(element -> {
                    LanguageDto language = new LanguageDto();
                    language.setName(element.select("span").first().text());
                    language.setLevel(element.getElementsByClass("languages-proficiency").text());
                    return language;
                }).collect(Collectors.toSet());
    }

    private Set<WorkplaceDto> getWorkplaces(Document document, Predicate<Element> filter) {
        Element experienceTab = document.getElementById("background-experience");
        return Objects.isNull(experienceTab) ? new HashSet<>() : experienceTab.getElementsByClass("editable-item").stream()
                .map(element -> {
                    WorkplaceDto workplace = new WorkplaceDto();
                    workplace.setPosition(element.getElementsByTag("h4").first().text());
                    workplace.setName(element.getElementsByClass("new-miniprofile-container").text());
                    String dateRange = element.getElementsByClass("experience-date-locale").text();
                    List<Date> dateList = getDateList(dateRange);
                    workplace.setStartDate(getDate(dateList, 0));
                    workplace.setEndDate(getDate(dateList, 1));
                    workplace.setComment(element.getElementsByClass("description").html());
                    return workplace;
                }).collect(Collectors.toSet());
    }


    private Set<ProjectDto> getProjects(Document document) {
        Element projectTab = document.getElementById("background-projects");
        return Objects.isNull(projectTab) ? new HashSet<>() : projectTab.getElementsByClass("editable-item").stream()
                .map(element -> {
                    ProjectDto project = new ProjectDto();
                    project.setName(element.getElementsByClass("summary").select("span").first().text());
                    project.setContributors(element.getElementsByClass("contributors").text());
                    project.setDate(element.getElementsByClass("projects-date").text());
                    project.setDesc(element.getElementsByClass("description").text());
                    return project;
                }).collect(Collectors.toSet());
    }


    private Date getDate(List<Date> dateList, int position) {
        return dateList.size() > position ? dateList.get(position) : null;
    }


    private AddressDto getAddressDto(String location) {
        AddressDto address = new AddressDto();
        List<String> addressStrings = parseLocation(location);

        if (!addressStrings.isEmpty()) {
            String countryName = addressStrings.get(addressStrings.size() - 1);
            countryName = convertCoutryNameToEnglish(countryName);
            Country country = countryDao.getByName(countryName);
            if (!Objects.isNull(country)) {
                address.setCountry(
                        countryDao.getByName(countryName)
                                .getId());
                if (addressStrings.size() == 2) address.setRegion(addressStrings.get(0));
                if (addressStrings.size() == 3) {
                    address.setRegion(addressStrings.get(1));
                    address.setCity(addressStrings.get(0));
                }
            } else {
                if (addressStrings.size() == 2) {
                    address.setRegion(addressStrings.get(1));
                    address.setCity(addressStrings.get(0));
                }
            }
        }

        return address;
    }

    private Address getAddress(String location, Contact contact) {
        Address address = new Address();
        address.setContact(contact);
        List<String> addressStrings = parseLocation(location);

        if (!addressStrings.isEmpty()) {
            String countryName = addressStrings.get(addressStrings.size() - 1);
            countryName = convertCoutryNameToEnglish(countryName);
            Country country = countryDao.getByName(countryName);
            if (!Objects.isNull(country)) {
                address.setCountry(
                        countryDao.getByName(countryName)
                );
                if (addressStrings.size() == 2) address.setRegion(addressStrings.get(0));
                if (addressStrings.size() == 3) {
                    address.setRegion(addressStrings.get(1));
                    address.setCity(addressStrings.get(0));
                }
            } else {
                if (addressStrings.size() == 2) {
                    address.setRegion(addressStrings.get(1));
                    address.setCity(addressStrings.get(0));
                }
            }
        }

        return address;
    }

    private List<String> parseLocation(String location) {
        return StringUtils.isBlank(location) ? new ArrayList<>()
                : Arrays.asList(location.split(", "));
    }


    private List<Date> getDateList(String dataRange) {
        return parseDataRange(dataRange)
                .stream().map(this::parseDateString)
                .collect(Collectors.toList());
    }

    private List<String> parseDataRange(String dateRange) {
        String[] startDate = dateRange.split(" – | \\(.+\\)");
        return Arrays.asList(startDate);
    }

    private Date parseDateString(String dateString) {
        String locale = "ru";
        if (dateString.equals("Present")) return null;
        Date date = null;
        Locale dflt = Locale.getDefault();
        Locale.setDefault(new Locale(locale));
        try {
            date = DateUtils.parseDate(dateString, "MMMM yyyy", "yyyy");
        } catch (ParseException e) {
            log.error("Can't parse date string = {}", dateString);
        } finally {
            Locale.setDefault(dflt);
        }
        return date;
    }

    private boolean jobFilter(Element element) {
        return element.attr("data-section").equals("currentPositionsDetails") ||
                element.attr("data-section").equals("pastPositionsDetails");
    }

    private String convertCoutryNameToEnglish(String country) {
        String[] locales = Locale.getISOCountries();
        for (String countryCode : locales) {
            Locale locale = new Locale("", countryCode);
            if (country.equals(locale.getDisplayCountry(new Locale("ru")))) {
                return locale.getDisplayCountry(new Locale("en"));
            }
        }
        return country;
    }

    @Override
    public Map<String,String> parseCookiesJson(String cookiesJsonStr){
        Map<String,String> cookies = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode cookiesJson = mapper.readTree(cookiesJsonStr);
            Iterator<String> keyList = cookiesJson.fieldNames();
            while(keyList.hasNext()){
                String key = keyList.next();
                String value = cookiesJson.get(key).asText();
                cookies.put(key,value);
            }
        }catch (Exception e){
            log.error("Can't parse cookiesJson string!!!");
        }
        return cookies;
    }

    @Override
    public List<LinkedInSearchContact> parseLinkedInResponseJson(String jsonStringData) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode allResults = mapper.readTree(jsonStringData)
                    .get("elements").get(0)
                    .get("elements");
            return parseLinkedInSearchContact(allResults);
        } catch (Exception e) {
            log.error("Can't parse json string!", e);
            throw new BusinessServiceException("Can't parse json string!", e);
        }
    }

    private List<LinkedInSearchContact> parseLinkedInSearchContact(JsonNode searchContactsJson) {
        List<LinkedInSearchContact> searchContacts = new ArrayList<>();
        for (int i = 0; i < searchContactsJson.size(); i++) {
            JsonNode elements = searchContactsJson.get(i);
            elements = elements.get("hitInfo").get("com.linkedin.voyager.search.SearchProfile");
            LinkedInSearchContact linkedInSearchContact = parseLinkedInSearchContactData(elements);
            searchContacts.add(linkedInSearchContact);
        }
        return searchContacts;
    }

    private LinkedInSearchContact parseLinkedInSearchContactData(JsonNode elements) {
        LinkedInSearchContact contact = new LinkedInSearchContact();
        JsonNode contactInfo = elements.get("miniProfile");
        String profileId = contactInfo.get("entityUrn").asText();
        Pattern pattern = Pattern.compile("(?=\\D)\\d+(?<=\\D)");
        Matcher matcher = pattern.matcher(profileId);
        if (matcher.find()) {
            contact.setId(Integer.parseInt(matcher.group()));
        }
        String firstName = contactInfo.get("firstName").asText();
        if ("".equals(firstName)){
            contact.setFirstname("Участник");
            contact.setLastName("LinkedIn");
        } else {
            contact.setFirstname(firstName);
            contact.setLastName(contactInfo.get("lastName").asText());
        }
        if (contactInfo.has("occupation")) {
            contact.setPosition(contactInfo.get("occupation").asText());
        }
        if (elements.has("location")) {
            contact.setLocation(elements.get("location").asText());
        }
        if (elements.has("industry")) {
            contact.setIndustry(elements.get("industry").asText());
        }
        if (contactInfo.has("picture")) {
            contact.setImageUri("https://media.licdn.com/mpr/mpr" + contactInfo.get("picture").get("com.linkedin.voyager.common.MediaProcessorImage").get("id").asText());
        } else {
            contact.setImageUri("./assets/images/noAva.png");
        }
        JsonNode snippets = elements.get("snippets");
        if (snippets != null){
            contact.setSnippets(addSnippetsToContact(snippets, contact));
        }
        JsonNode memberBadges = elements.get("memberBadges");
        String profileStr = memberBadges.get("entityUrn").asText();
        String profileUri = profileStr.split("urn:li:fs_memberBadges:")[1];
        contact.setProfileUri("https://www.linkedin.com/in/" + profileUri);
        String linkedInId = elements.get("backendUrn").asText();
        contact.setLinkedinId(Long.parseLong(linkedInId.split("urn:li:member:")[1]));
        return contact;
    }

    private List<LinkedInSnippet> addSnippetsToContact(JsonNode snippets, LinkedInSearchContact contact) {
        List<LinkedInSnippet> linkedInSnippets = new LinkedList<>();
        JsonNode heading = snippets.get(0).get("heading");
        LinkedInSnippet newSnippet = new LinkedInSnippet();
        addHeadingInfoToSnippet(heading, newSnippet);
        newSnippet.setFieldName("Now");
        newSnippet.setLinkedInSearchContact(contact);
        linkedInSnippets.add(newSnippet);
        return linkedInSnippets;
    }

    private void addHeadingInfoToSnippet(JsonNode heading, LinkedInSnippet newSnippet){
        if(heading != null){
            String text = heading.get("text").asText();
            String result = setBoldText(text, heading.get("annotations"));
            newSnippet.setBody(result);
        }
    }

    private String setBoldText(String text, JsonNode annotations) {
        int offset = 0;
        int bOpenLength = "<b>".length();
        int bCloseLength = "</b>".length();
        for(JsonNode annotation: annotations){
            int start = annotation.get("start").asInt();
            int end = annotation.get("end").asInt();
            text = insert(text, start + offset, "<b>");
            offset += bOpenLength;
            text = insert(text, end + offset, "</b>");
            offset += bCloseLength;
        }
        return text;
    }

    private String insert(String text, int position, String str){
        String newText = text.substring(0, position);
        newText += str + text.substring(position);
        return newText;
    }
}
