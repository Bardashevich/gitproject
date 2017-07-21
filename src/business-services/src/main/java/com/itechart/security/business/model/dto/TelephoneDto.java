package com.itechart.security.business.model.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class TelephoneDto {
    private Long id;

    private String number;

    private String type;

    private Date dateDeleted;

    public TelephoneDto () {}
}
