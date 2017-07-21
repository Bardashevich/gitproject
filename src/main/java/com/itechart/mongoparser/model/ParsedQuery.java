package com.itechart.mongoparser.model;

import lombok.Data;

import java.util.List;

/**
 * Model for parsed and splitted SQL query.
 */
@Data
public class ParsedQuery {
    private List<String> fields;
    private String collection;
    private String whereStatement;
    private String orderByStatement;
    private String limit;
}
