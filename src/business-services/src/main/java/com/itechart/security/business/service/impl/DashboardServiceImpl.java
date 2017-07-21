package com.itechart.security.business.service.impl;

import com.itechart.security.business.dao.dashboard.CustomDashItemDao;
import com.itechart.security.business.dao.dashboard.DefaultDashItemDao;
import com.itechart.security.business.model.dto.dashboard.DashItemDto;
import com.itechart.security.business.model.dto.utils.DashboardConverter;
import com.itechart.security.business.model.persistent.dashboard.CustomDashItem;
import com.itechart.security.business.model.persistent.dashboard.DashItem;
import com.itechart.security.business.service.DashboardService;
import com.itechart.security.dao.UserDao;
import com.itechart.security.model.persistent.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by artsiom.marenau on 12/8/2016.
 */
@Service
public class DashboardServiceImpl implements DashboardService {

    private static final Logger logger = LoggerFactory.getLogger(DashboardServiceImpl.class);

    @Autowired
    CustomDashItemDao customDashItemDao;

    @Autowired
    DefaultDashItemDao defaultDashItemDao;

    @Autowired
    UserDao userDao;

    @Override
    @Transactional
    public List<DashItemDto> getDashItems(String userName){
        List<DashItemDto> dtos;
        List<Long> roleIds = new ArrayList<>();

        User user = userDao.findByName(userName);
        user.getRoles().forEach(u->roleIds.add(u.getId()));

        List<CustomDashItem> customProps = customDashItemDao.listCustomItems(user.getId());
        if ( customProps.isEmpty() ){
            dtos = defaultDashItemDao.listDefaultDashProperties(roleIds).
                    stream().map(DashboardConverter::convertDefaultDashItem).collect(Collectors.toList());
        }else {
            dtos = customProps.stream().map(DashboardConverter::convertCustomDashItem).collect(Collectors.toList());
        }
        return dtos;
    }

    @Override
    @Transactional
    public List<DashItemDto> getDefaultDashItems(String userName){
        List<DashItemDto> dtos;
        List<Long> roleIds = new ArrayList<>();
        User user = userDao.findByName(userName);
        user.getRoles().forEach(u->roleIds.add(u.getId()));
        dtos = defaultDashItemDao.listDefaultDashProperties(roleIds).
                    stream().map(DashboardConverter::convertDefaultDashItem).collect(Collectors.toList());
        return dtos;
    }

    @Override
    @Transactional
    public void updateDashItem(String userName, DashItemDto dto){
        Long userId = userDao.findByName(userName).getId();
        CustomDashItem customItem = customDashItemDao.getCustomDashItem(userId,dto.getId());

        if ( customItem == null ){
            DashItem dashItem = new DashItem();
            dashItem.setId(dto.getId());
            dashItem.setName(dto.getName());

            customItem = new CustomDashItem();
            customItem.setUserId(userId);
            customItem.setDashItem(dashItem);
        }

        customItem.setRow(dto.getRow());
        customItem.setCol(dto.getCol());
        customItem.setVisible(dto.getVisible());
        customDashItemDao.saveUpdateCustomProperty(customItem);
    }

}
