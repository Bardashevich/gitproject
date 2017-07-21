package com.itechart.mongoparser.util;

import com.itechart.mongoparser.model.MongoQuery;
import com.itechart.mongoparser.model.ParsedQuery;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Util parser for implementation "SQL to mongo"
 */
@Component
public class SqlParserUtil {

    private static final String DELIMITER = ",";
    private static final String SELECT_KEY = "select ";
    private static final String FROM_SPLIT_KEY = " (?i)from ";
    private static final String WHERE_SPLIT_KEY = " (?i)where ";
    private static final String ORDER_BY_SPLIT_KEY = " (?i)order by ";
    private static final String LIMIT_SPLIT_KEY = " (?i)limit ";

    private static final String ALL_FIELDS_SYMBOL = "*";
    
    private static final String LOGICAL_AND_SPLIT_KEY = " (?i)AND ";
    private static final String LOGICAL_OR_SPLIT_KEY = " (?i)OR ";

    private static final String ASC_KEY = "(?i)ASC";
    private static final String DESC_KEY = "(?i)DESC";

    private static final String LOGICAL_AND = "$and";
    private static final String LOGICAL_OR = "$or";

    private static final Map<String, String> operators = new LinkedHashMap<>();

    public SqlParserUtil() {
        operators.put("<>", "$ne");
        operators.put("=>", "$gte");
        operators.put("<=", "$lte");
        operators.put(">=", "$lte");
        operators.put(">", "$gt");
        operators.put("<", "$lt");
        operators.put("=", "");
    }

    /**
     * Parse sql query into {@link ParsedQuery} model
     *
     * @param query sql query
     * @return parsed query as {@link ParsedQuery} model
     */
    public ParsedQuery parseQuery(String query) {
        ParsedQuery parsedQuery = new ParsedQuery();
        Map<String, String> queryMainParts = new HashMap<>();
        String queryResidue = query.substring(SELECT_KEY.length());
        String[] splittedQuery = queryResidue.split(FROM_SPLIT_KEY);
        parsedQuery.setFields(Arrays.asList(splittedQuery[0]
                .replaceAll("\\s", "").replaceAll("\\.\\*", "").split(DELIMITER)));
        queryResidue = splittedQuery[1];
        String previousKey = FROM_SPLIT_KEY;

        String[] tempSplittedQuery;
        tempSplittedQuery = queryResidue.split(WHERE_SPLIT_KEY);
        if (tempSplittedQuery.length == 2) {
            splittedQuery = tempSplittedQuery;
            queryMainParts.put(previousKey, splittedQuery[0]);
            queryResidue = splittedQuery[1];
            previousKey = WHERE_SPLIT_KEY;
        }
        tempSplittedQuery = queryResidue.split(ORDER_BY_SPLIT_KEY);
        if (tempSplittedQuery.length == 2) {
            splittedQuery = tempSplittedQuery;
            queryMainParts.put(previousKey, splittedQuery[0]);
            queryResidue = splittedQuery[1];
            previousKey = ORDER_BY_SPLIT_KEY;
        }
        tempSplittedQuery = queryResidue.split(LIMIT_SPLIT_KEY);
        if (tempSplittedQuery.length == 2) {
            splittedQuery = tempSplittedQuery;
            queryMainParts.put(previousKey, splittedQuery[0]);
            previousKey = LIMIT_SPLIT_KEY;
        }
        
        queryMainParts.put(previousKey, splittedQuery[1]);
        parsedQuery.setCollection(queryMainParts.get(FROM_SPLIT_KEY));
        parsedQuery.setWhereStatement(queryMainParts.get(WHERE_SPLIT_KEY));
        parsedQuery.setOrderByStatement(queryMainParts.get(ORDER_BY_SPLIT_KEY));
        parsedQuery.setLimit(queryMainParts.get(LIMIT_SPLIT_KEY));

        return parsedQuery;
    }

    /**
     * Convert {@link ParsedQuery} model into {@link MongoQuery} model
     *
     * @param parsedQuery parsed query model
     * @return result of converting {@link ParsedQuery}
     */
    public MongoQuery generateMongoQuery(ParsedQuery parsedQuery) {
        MongoQuery mongoQuery = new MongoQuery();

        if (!parsedQuery.getFields().contains(ALL_FIELDS_SYMBOL)) {
            parsedQuery.getFields().forEach(value -> mongoQuery.getProjection().put(value, 1));
            mongoQuery.getProjection().put("_id", 0);
        }

        if(parsedQuery.getWhereStatement() != null) {
            List<DBObject> orStatements = initOrStatements(parsedQuery);
            mongoQuery.setQuery(new BasicDBObject(LOGICAL_OR, orStatements));
        }

        if (parsedQuery.getOrderByStatement() != null) {
            Arrays.asList(parsedQuery.getOrderByStatement().split(DELIMITER)).forEach(statement -> {
                String[] splittedStatement = statement.trim().split(" ");
                if (splittedStatement[1].matches(ASC_KEY)) {
                    mongoQuery.getSort().put(splittedStatement[0], 1);
                } else if (splittedStatement[1].matches(DESC_KEY)) {
                    mongoQuery.getSort().put(splittedStatement[0], -1);
                }
            });
        }

        if (parsedQuery.getLimit() != null) {
            mongoQuery.setLimit(Integer.valueOf(parsedQuery.getLimit()));
        }

        return mongoQuery;
    }

    private List<DBObject> initOrStatements(ParsedQuery parsedQuery) {
        List<String> splittedOrStatement = Arrays.asList(parsedQuery.getWhereStatement().split(LOGICAL_OR_SPLIT_KEY));
        List<DBObject> result = new ArrayList<>();
        for (String orStatement : splittedOrStatement) {
            result.add(new BasicDBObject(LOGICAL_AND, initAndStatements(orStatement)));
        }
        return result;
    }

    private List<DBObject> initAndStatements(String orStatement) {
        List<DBObject> result = new ArrayList<>();
        List<String> splittedAndStatements = Arrays.asList(orStatement.split(LOGICAL_AND_SPLIT_KEY));
        for (String andStatement : splittedAndStatements) {
            for (String key : operators.keySet()) {
                if (andStatement.contains(key)) {
                    String[] splittedStatement = andStatement.split(key);
                    if (operators.get(key).isEmpty()) {
                        result.add(new BasicDBObject(splittedStatement[0].trim(),
                                StringUtils.isNumeric(splittedStatement[1].trim()) ? Double.valueOf(splittedStatement[1]) : splittedStatement[1].trim()));
                    } else {
                        DBObject statementOption = new BasicDBObject(operators.get(key),
                                StringUtils.isNumeric(splittedStatement[1].trim()) ? Double.valueOf(splittedStatement[1]) : splittedStatement[1].trim());
                        result.add(new BasicDBObject(splittedStatement[0].trim(), statementOption));
                    }
                    break;
                }
            }
        }
        return result;
    }
}
