package com.itechart.security.business.dao.impl;

import com.itechart.common.dao.impl.BaseHibernateDao;
import com.itechart.security.business.dao.RecruitmentOpportunityDao;
import com.itechart.security.business.filter.RecruitmentOpportunityFilter;
import com.itechart.security.business.model.persistent.RecruitmentOpportunity;
import com.itechart.security.business.model.persistent.Vacancy;
import com.itechart.security.business.model.persistent.linkedin.LinkedInSearchContact;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;

/**
 * Created by pavel.urban on 11/17/2016.
 */
@Repository
public class RecruitmentOpportunityDaoImpl extends BaseHibernateDao<RecruitmentOpportunity, Long, RecruitmentOpportunityFilter> implements RecruitmentOpportunityDao {

    @Override
    public RecruitmentOpportunity getRecruitmentOportunityByLinkedInIdAndVacancyId(LinkedInSearchContact contact, Vacancy vacancy){
        List<?> result = getHibernateTemplate().find("from RecruitmentOpportunity c where c.linkedInId = ? and c.vacancy = ?"
                ,contact.getLinkedinId()
                ,vacancy
        );
        return !result.isEmpty() ? (RecruitmentOpportunity) result.get(0) : null;
    }

    @Override
    public List<RecruitmentOpportunity> findByVacancyId(Integer vacancyId) {
        String sql =
                "SELECT * FROM `recruitment_opportunity` WHERE `recruitment_opportunity`.vacancy_id = (:vacancyId) ";
        return getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql)
                .addEntity(RecruitmentOpportunity.class)
                .setParameter("vacancyId", vacancyId)
                .list();
    }

    @Override
    public List getOpportunityStatusByDate(Date start, Date end) {
        String sql =
                "SELECT DATE(status_date) AS date, status, count(*) AS count " +
                        "FROM recruitment_opportunity " +
                        "WHERE DATE(status_date) >= DATE(:startDate) AND DATE(status_date) <= DATE(:endDate) " +
                        "GROUP BY date, status";
        return getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql)
                .setParameter("startDate", start)
                .setParameter("endDate", end)
                .list();
    }

    @Override
    public List getOpportunityStatusByDateAndVacancy(Long vacancyId, Date start, Date end){
        String sql =
                "SELECT recruitment_opportunity_status_history.status, count(*) AS count " +
                        "FROM recruitment_opportunity LEFT JOIN recruitment_opportunity_status_history " +
                        "ON recruitment_opportunity.id = recruitment_opportunity_status_history.recruitment_opportunity_id " +
                        "WHERE status_date > :startDate AND status_date < :endDate " +
                        "AND vacancy_id = :vacancyId " +
                        "GROUP BY recruitment_opportunity_status_history.status";
        return getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql)
                .setParameter("startDate", start)
                .setParameter("endDate", end)
                .setParameter("vacancyId", vacancyId)
                .list();
    }

    public List getOpportunityStatisticData(Date start, Date end, Long vacancyId) {
        Query query;
        String sql =
                "SELECT status, count(*) AS count " +
                        "FROM recruitment_opportunity " +
                        "WHERE DATE(status_date) >= DATE(:startDate) " +
                        "AND DATE(status_date) <= DATE(:endDate) " +
                        "AND (status = 'CONTACT' OR status = 'MANAGER_REVIEW' OR status = 'ITERVIEW_SCHEDULED' OR status = 'MAKE_OFFER' OR status = 'ACCEPT') ";
        if (vacancyId > 0){
            sql += "AND vacancy_id = :vacancyId " +
                    "GROUP BY status";
            query = getSessionFactory()
                    .getCurrentSession()
                    .createSQLQuery(sql)
                    .setParameter("startDate", start)
                    .setParameter("endDate", end)
                    .setParameter("vacancyId", vacancyId);
        } else {
            sql +=  "GROUP BY status;";
            query = getSessionFactory()
                    .getCurrentSession()
                    .createSQLQuery(sql)
                    .setParameter("startDate", start)
                    .setParameter("endDate", end);

        }
        return query.list();
    }

    protected Criteria createFilterCriteria(Session session, RecruitmentOpportunityFilter filter) {
        Criteria criteria = session.createCriteria(RecruitmentOpportunity.class, "recruitmentOpportunity");
        if (StringUtils.hasText(filter.getText())) {
            criteria.add(Restrictions.ilike("recruitmentOpportunity.name", filter.getText(), MatchMode.ANYWHERE));
        }
        if (filter.getStatus() != null) {
            criteria.add(Restrictions.eq("recruitmentOpportunity.status", filter.getStatus()));
        }
        if (filter.getVacancyId() != 0) {
            criteria.add(Restrictions.eq("recruitmentOpportunity.vacancy.id", filter.getVacancyId()));
        }
        return criteria;
    }

}
