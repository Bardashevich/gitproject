package com.itechart.common.model.filter;

public class TextFilter extends PagingFilter {

    private String id;

    private String group;

    private String text;

    public String getId() { return id; }

    public void setId(String id) { this.id = id; }

    public String getGroup() { return group; }

    public void setGroup(String group) { this.group = group; }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
