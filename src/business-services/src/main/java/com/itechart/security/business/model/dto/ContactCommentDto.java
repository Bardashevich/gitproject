package com.itechart.security.business.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ContactCommentDto {
    private Long id;
    private Long authorId;
    private String author;
    private Date date;
    private String text;
    private Date dateDeleted;
    private String contact;
}
