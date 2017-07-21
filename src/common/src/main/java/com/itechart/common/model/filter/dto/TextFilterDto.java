package com.itechart.common.model.filter.dto;

public class TextFilterDto extends PagingFilterDto {

    private String text;

    private String group;

    private String id;

    public String getId() { return id; }

    public void setId(String id) { this.id = id; }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getGroup() { return group; }

    public void setGroup(String group) { this.group = group; }
}
