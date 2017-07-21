package com.itechart.security.business.dao.impl;

import com.itechart.common.dao.impl.BaseHibernateDao;
import com.itechart.security.business.dao.TaskDao;
import com.itechart.security.business.filter.TaskFilter;
import com.itechart.security.business.model.persistent.task.Task;
import com.itechart.security.core.annotation.AclFilter;
import com.itechart.security.core.annotation.AclFilterRule;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

import static com.itechart.security.core.model.acl.Permission.READ;

/**
 * @author yauheni.putsykovich
 */
@Repository
public class TaskDaoImpl extends BaseHibernateDao<Task, Long, TaskFilter> implements TaskDao {

    @Override
    @AclFilter(value = @AclFilterRule(type = Task.class, permissions = READ))
    public Long save(Task object) {
        return super.save(object);
    }

    @Override
    @AclFilter(value = @AclFilterRule(type = Task.class, permissions = READ))
    public Task get(Long id) {
        return super.get(id);
    }

    @Override
    @AclFilter(value = @AclFilterRule(type = Task.class, permissions = READ))
    public List<Task> find(TaskFilter filter) {
        return getHibernateTemplate().executeWithNativeSession(session -> {
            Criteria criteria = createFilterCriteria(filter, session);
            return executePagingDistinctCriteria(session, criteria, filter);
        });
    }

    @Override
    @AclFilter(value = @AclFilterRule(type = Task.class, permissions = READ))
    public int count(TaskFilter filter) {
        return super.count(filter);
    }

    public void saveOrUpdate(Task task){
        getHibernateTemplate().saveOrUpdate(task);
    }

    private Criteria createFilterCriteria(TaskFilter filter, Session session) {
        Criteria criteria = session.createCriteria(Task.class, "t");
        if (StringUtils.hasText(filter.getText())) {
            criteria.add(Restrictions.disjunction(
                    Restrictions.ilike("t.name", filter.getText(), MatchMode.ANYWHERE)
            ));
        }
        return criteria;
    }
}
