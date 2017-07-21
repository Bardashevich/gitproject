package com.itechart.security.business.service;

import com.itechart.security.business.model.dto.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
/*
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:businessServicesTestContext.xml"})*/
public class ReportServiceTest {

   /* @Autowired
    private ReportServiceImpl reportService;*/

    private ContactDto generateTestContact() {
        ContactDto contact = new ContactDto();

        contact.setFirstName("FirstName");
        contact.setLastName("LastName");
        contact.setPatronymic("Patronymic");
        contact.setNationality("Belarus");
        contact.setIndustry("IT");
        contact.setPhotoUrl("https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/4/000/16f/0df/2ac5983.jpg");

        contact.setDateOfBirth(new Date(705024000000L));

        Set<EmailDto> emails = new HashSet<>();
        EmailDto email = new EmailDto();
        email.setId(1000L);
        email.setName("test@mail.ru");
        email.setType("Home");
        emails.add(email);

        contact.setEmails(emails);

        Set<UniversityEducationDto> educations = new HashSet<>();

        UniversityEducationDto education1 = new UniversityEducationDto();
        education1.setType("Simple");
        education1.setName("Belarusian state University");
        education1.setFaculty("Mathematics and Informatics");
        education1.setSpeciality("Applied Mathematics");
        education1.setStartDate(new Date(1505024000000L));
        education1.setEndDate(2016);
        educations.add(education1);

        UniversityEducationDto education2 = new UniversityEducationDto();
        education2.setType("Simple");
        education2.setName("Belarusian state University");
        education2.setFaculty("Programming");
        education2.setSpeciality("Big data");
        education2.setStartDate(new Date(2605024000000L));
        educations.add(education2);

        contact.setEducations(educations);

        Set<WorkplaceDto> workplaces = new HashSet<>();

        WorkplaceDto workplace = new WorkplaceDto();
        workplace.setName("iTechArt");
        workplace.setPosition("developer");
        workplace.setStartDate(new Date(1505024000000L));
        workplace.setEndDate(new Date(2505024000000L));
        workplace.setComment("");
        workplaces.add(workplace);

        contact.setWorkplaces(workplaces);

        Set<SkillDto> skills = new HashSet<>();

        SkillDto skill = new SkillDto();
        skill.setName("Java");
        skills.add(skill);

        contact.setSkills(skills);

        return contact;
    }

   /* @Test
    public void testPdfReportGenerator() {
        reportService.report(generateTestContact(), FileType.PDF);
        Assert.assertTrue(true);
    }

    @Test
    public void testDocxReportGenerator() {
        reportService.report(generateTestContact(), FileType.DOCX);
        Assert.assertTrue(true);
    }

    @Test
    public void testXlsReportGenerator() {
        reportService.report(generateTestContact(), FileType.XLS);
        Assert.assertTrue(true);
    }*/
}