package com.itechart.security.business.dao.impl;

import com.itechart.common.dao.impl.BaseHibernateDao;
import com.itechart.common.model.filter.PagingFilter;
import com.itechart.security.business.dao.LanguageDao;
import com.itechart.security.business.model.persistent.Language;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public class LanguageDaoImpl extends BaseHibernateDao<Language, Long, PagingFilter> implements LanguageDao {

    @Override
    public void delete(Long id) {
        Language language = getHibernateTemplate().get(Language.class, id);
        if (language != null) {
            language.setDateDeleted(new Date());
            getHibernateTemplate().update(language);
        }
    }
}
