package com.itechart.security.business.model.dto.utils;

import com.itechart.security.business.model.dto.dashboard.DashItemDto;
import com.itechart.security.business.model.persistent.dashboard.CustomDashItem;
import com.itechart.security.business.model.persistent.dashboard.DashItem;
import com.itechart.security.business.model.persistent.dashboard.DefaultDashItem;

/**
 * Created by artsiom.marenau on 12/8/2016.
 */
public class DashboardConverter {

    public static DashItemDto convertDefaultDashItem(DefaultDashItem item){
        DashItemDto dto = new DashItemDto();
        dto.setId(item.getDashItem().getId());
        dto.setName(item.getDashItem().getName());
        dto.setCol(item.getCol());
        dto.setRow(item.getRow());
        dto.setVisible(true);
        return dto;
    }

    public static DashItemDto convertCustomDashItem(CustomDashItem item){
        DashItemDto dto = new DashItemDto();
        dto.setId(item.getDashItem().getId());
        dto.setName(item.getDashItem().getName());
        dto.setCol(item.getCol());
        dto.setRow(item.getRow());
        dto.setVisible(item.getVisible());
        return dto;
    }

    public static CustomDashItem convertDashItemDto(DashItemDto dto){
        DashItem item = new DashItem();
        item.setId(dto.getId());
        item.setName(dto.getName());

        CustomDashItem customProp = new CustomDashItem();
        customProp.setDashItem(item);
        customProp.setCol(dto.getCol());
        customProp.setRow(dto.getRow());
        customProp.setVisible(dto.getVisible());
        return customProp;
    }

}
