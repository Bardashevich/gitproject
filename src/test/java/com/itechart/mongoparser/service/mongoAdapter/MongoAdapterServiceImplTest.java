package com.itechart.mongoparser.service.mongoAdapter;

import com.itechart.mongoparser.model.MongoQuery;
import com.itechart.mongoparser.model.ParsedQuery;
import com.itechart.mongoparser.util.SqlParserUtil;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class MongoAdapterServiceImplTest {

    @InjectMocks
    private MongoAdapterService mongoAdapterService = new MongoAdapterServiceImpl();
    @Mock
    private SqlParserUtil sqlParserUtil;
    @Mock
    private MongoTemplate mongoTemplate;

    @Test
    public void convertSqlAndApply() throws Exception {
        String testQuery = "Select * from test";

        DBCursor dbCursorMock = mock(DBCursor.class);
        DBCollection dbCollectionMock = mock(DBCollection.class);
        ParsedQuery testParsedQuery = new ParsedQuery();
        testParsedQuery.setCollection("testCollection");
        MongoQuery testMongoQuery = new MongoQuery();
        List<DBObject> expectedResult = new ArrayList<>();
        expectedResult.add(new BasicDBObject());

        when(sqlParserUtil.parseQuery(eq(testQuery))).thenReturn(testParsedQuery);
        when(mongoTemplate.getCollection(eq(testParsedQuery.getCollection()))).thenReturn(dbCollectionMock);
        when(sqlParserUtil.generateMongoQuery(eq(testParsedQuery))).thenReturn(testMongoQuery);
        when(dbCollectionMock.find(eq(testMongoQuery.getQuery()), eq(testMongoQuery.getProjection()))).thenReturn(dbCursorMock);
        when(dbCursorMock.sort(eq(testMongoQuery.getSort()))).thenReturn(dbCursorMock);
        when(dbCursorMock.limit(eq(testMongoQuery.getLimit()))).thenReturn(dbCursorMock);
        when(dbCursorMock.toArray()).thenReturn(expectedResult);

        Collection<DBObject> result = mongoAdapterService.convertSqlAndExecute(testQuery);
        assertEquals(expectedResult, result);
    }

}