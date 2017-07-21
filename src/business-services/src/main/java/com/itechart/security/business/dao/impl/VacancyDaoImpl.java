package com.itechart.security.business.dao.impl;

import com.itechart.common.dao.impl.BaseHibernateDao;
import com.itechart.security.business.dao.VacancyDao;
import com.itechart.security.business.filter.VacancyFilter;
import com.itechart.security.business.model.persistent.Vacancy;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

/**
 * Created by artsiom.marenau on 11/17/2016.
 */
@Repository
public class VacancyDaoImpl extends BaseHibernateDao<Vacancy,Long,VacancyFilter> implements VacancyDao {

    public List<Vacancy> find(VacancyFilter filter) {
        return super.find(filter);
    }

    public int count(VacancyFilter filter) {
        return super.count(filter);
    }

    @Override
    public List countVacanciesByStatus(Date periodStart, Date periodEnd) {
        String sql =
                "SELECT COUNT(*) AS `count`, " +
                    "IF(ISNULL(close_date), " +
                        "IF (ISNULL(last_search_date),'opened','inProgress') " +
                    ", 'closed') AS `status` " +
                "FROM vacancy WHERE ISNULL(date_deleted) " +
                                   "AND open_date >= :period_start " +
                                   "AND open_date <= :period_end " +
                "GROUP BY `status`";
        return getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql)
                .setParameter("period_start", periodStart)
                .setParameter("period_end", periodEnd)
                .list();
    }

    @Override
    public void delete(Long id) {
        Vacancy vacancy = getHibernateTemplate().get(Vacancy.class, id);
        if (vacancy != null) {
            Date date = new Date();
            vacancy.setDateDeleted(date);
            vacancy.setCloseDate(date);
            update(vacancy);
        }
    }

    @Override
    protected Criteria createFilterCriteria(Session session, VacancyFilter filter) {
        Criteria criteria = session.createCriteria(Vacancy.class, "u").add(Restrictions.isNull("dateDeleted"));
        if ( !filter.isShowClosed()){
            criteria.add(Restrictions.isNull("closeDate"));
        }
        if (filter.getDisplayedPeriodStart() != null){
            criteria.add(Restrictions.ge("openDate", filter.getDisplayedPeriodStart()));
        }
        if (filter.getDisplayedPeriodEnd() != null){
            criteria.add(Restrictions.le("openDate", filter.getDisplayedPeriodEnd()));
        }
        if (filter.getHr() != null){
            criteria.add(Restrictions.eq("hr", filter.getHr()));
        }
        if (filter.getCreator() != null){
            criteria.add(Restrictions.eq("creator", filter.getCreator()));
        }
        return criteria;
    }

    @Override
    public Date updateLastSearchDate(Long vacancyId) {
        Date now = new Date();
        String sql = "UPDATE vacancy SET vacancy.last_search_date = :now WHERE vacancy.id = :vacancy_id";
        getSessionFactory()
                .getCurrentSession()
                .createSQLQuery(sql)
                .setParameter("vacancy_id",vacancyId)
                .setParameter("now", now)
                .executeUpdate();
        return now;
    }
}
