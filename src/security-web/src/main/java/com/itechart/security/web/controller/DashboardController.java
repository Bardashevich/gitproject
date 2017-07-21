package com.itechart.security.web.controller;

import com.itechart.security.business.model.dto.dashboard.DashItemDto;
import com.itechart.security.business.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

/**
 * Created by artsiom.marenau on 12/7/2016.
 */
@RestController
public class DashboardController  {

    @Autowired
    DashboardService dashboardService;

    @RequestMapping(value = "/dashboard/list", method = GET)
    public List getDashboardList(){
        return dashboardService.getDashItems(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @RequestMapping(value = "/dashboard/defaultList", method = GET)
    public List getDefaultDashboardList(){
        return dashboardService.getDefaultDashItems(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @RequestMapping(value = "/dashboard/update", method = PUT)
    public void updateDashItem(@RequestBody DashItemDto dto){
        dashboardService.updateDashItem(SecurityContextHolder.getContext().getAuthentication().getName(),dto);
    }

}
