package com.itechart.security.business.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class MessengerAccountDto {

    private Long id;

    private Long messenger;

    private String username;

    private String description;

    private Date dateDeleted;

    public MessengerAccountDto() {}
}
