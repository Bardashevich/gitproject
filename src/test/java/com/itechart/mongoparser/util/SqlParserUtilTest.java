package com.itechart.mongoparser.util;

import com.itechart.mongoparser.model.MongoQuery;
import com.itechart.mongoparser.model.ParsedQuery;
import com.mongodb.BasicDBObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(MockitoJUnitRunner.class)
public class SqlParserUtilTest {
    private SqlParserUtil sqlParserUtil = new SqlParserUtil();

    @Test
    public void parseQuery() throws Exception {
        String testQuery = "Select a, b from testCollection where a > 1 and b < 5 or c = 10 order by a asc, b desc limit 10";
        ParsedQuery result = sqlParserUtil.parseQuery(testQuery);
        assertNotNull(result);
        assertEquals("a", result.getFields().get(0));
        assertEquals("b", result.getFields().get(1));
        assertEquals("testCollection", result.getCollection());
        assertEquals("a > 1 and b < 5 or c = 10", result.getWhereStatement());
        assertEquals("a asc, b desc", result.getOrderByStatement());
        assertEquals("10", result.getLimit());
    }

    @Test
    public void generateMongoQuery() throws Exception {
        ParsedQuery parsedQuery = new ParsedQuery();
        parsedQuery.setCollection("testCollection");
        parsedQuery.setFields(Arrays.asList("a", "b"));
        parsedQuery.setWhereStatement("a > 1 and b < 5 or c = 10");
        parsedQuery.setOrderByStatement("a asc, b desc");
        parsedQuery.setLimit("10");

        MongoQuery mongoQuery = sqlParserUtil.generateMongoQuery(parsedQuery);
        assertNotNull(mongoQuery);
        assertEquals(1, mongoQuery.getProjection().get("a"));
        assertEquals(1, mongoQuery.getProjection().get("b"));
        assertEquals(1, mongoQuery.getSort().get("a"));
        assertEquals(-1, mongoQuery.getSort().get("b"));
        assertEquals(10, mongoQuery.getLimit().intValue());
        assertEquals(2, ((List) mongoQuery.getQuery().get("$or")).size());
        assertEquals(2, ((List) ((BasicDBObject) ((List) mongoQuery.getQuery().get("$or")).get(0)).get("$and")).size());
    }

}