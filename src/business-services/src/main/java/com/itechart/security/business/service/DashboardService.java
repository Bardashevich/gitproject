package com.itechart.security.business.service;


import com.itechart.security.business.model.dto.dashboard.DashItemDto;


import java.util.List;


/**
 * Created by artsiom.marenau on 12/8/2016.
 */
public interface DashboardService {

    List<DashItemDto> getDashItems(String userName);

    List<DashItemDto> getDefaultDashItems(String userName);

    void updateDashItem(String userName, DashItemDto dto);
}
