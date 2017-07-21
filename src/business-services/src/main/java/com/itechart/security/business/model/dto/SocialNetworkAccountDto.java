package com.itechart.security.business.model.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class SocialNetworkAccountDto {

    private Long id;

    private Long socialNetwork;

    private String url;

    private Date dateDeleted;
}
