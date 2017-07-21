package com.itechart.security.business.service.impl;

import com.itechart.security.business.dao.ContactDao;
import com.itechart.security.business.dao.VacancyDao;
import com.itechart.security.business.filter.VacancyFilter;
import com.itechart.security.business.model.dto.VacancyDto;
import com.itechart.security.business.model.persistent.Contact;
import com.itechart.security.business.model.persistent.Vacancy;
import com.itechart.security.business.service.VacancyService;
import com.itechart.security.core.userdetails.UserDetails;
import com.itechart.security.dao.UserDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

import static com.itechart.security.business.model.dto.utils.DtoConverter.convert;
import static com.itechart.security.business.model.dto.utils.DtoConverter.convertVacancies;
/**
 * Created by artsiom.marenau on 11/17/2016.
 */
@Service
public class VacancyServiceImpl implements VacancyService {
    private static final Logger logger = LoggerFactory.getLogger(VacancyServiceImpl.class);

    @Autowired
    private VacancyDao vacancyDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ContactDao contactDao;

    @Override
    @Transactional
    public List<VacancyDto> findVacancies(VacancyFilter filter) {
        
        Contact author = contactDao.getByUserId(((UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal()).getUserId());
        for (GrantedAuthority ob : ((UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal()).getAuthorities()) {
            String authority = ob.getAuthority();
            if (authority.contains("ROLE")) {
                String role = authority.substring(5, authority.length());
                if (role.equals("HR")){
                    filter.setHr(author);
                } else {
                    if (role.equals("DEPARTMENT_MANAGER")) {
                        filter.setCreator(author);
                    }
                }
            }
        }
        List<Vacancy> vacancies = vacancyDao.find(filter);
        return convertVacancies(vacancies);
    }

    @Override
    @Transactional
    public List countVacanciesByStatus(Date periodStart, Date periodEnd) {
        return vacancyDao.countVacanciesByStatus(periodStart, periodEnd);
    }

    @Override
    @Transactional
    public VacancyDto get(Long id) {
        return convert(vacancyDao.get(id));
    }

    @Override
    @Transactional
    public int countVacancies(VacancyFilter filter) {
        return vacancyDao.count(filter);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        vacancyDao.delete(id);
    }

    @Override
    @Transactional
    public void updateVacancy(VacancyDto vacancyDto) {
        Vacancy vacancy = convert(vacancyDto);
        vacancyDao.update(vacancy);
    }

    @Override
    @Transactional
    public Long saveVacancy(VacancyDto dto) {
        Vacancy vacancy = convert(dto);
        return vacancyDao.save(vacancy);
    }

    @Override
    @Transactional
    public Date updateSearchDate(Long vacancyId) {
        return vacancyDao.updateLastSearchDate(vacancyId);
    }
}
