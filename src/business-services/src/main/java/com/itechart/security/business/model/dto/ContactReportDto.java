package com.itechart.security.business.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class ContactReportDto {

    private String reportType;

    private List<Long> contactsId;
}
