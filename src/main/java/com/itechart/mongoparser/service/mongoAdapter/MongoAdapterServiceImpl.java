package com.itechart.mongoparser.service.mongoAdapter;

import com.itechart.mongoparser.model.MongoQuery;
import com.itechart.mongoparser.model.ParsedQuery;
import com.itechart.mongoparser.util.SqlParserUtil;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MongoAdapterServiceImpl implements MongoAdapterService {

    @Autowired
    private SqlParserUtil sqlParserUtil;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<DBObject> convertSqlAndExecute(String query) {
        ParsedQuery parsedQuery = sqlParserUtil.parseQuery(query);
        DBCollection dbCollection = mongoTemplate.getCollection(parsedQuery.getCollection());
        MongoQuery mongoQuery = sqlParserUtil.generateMongoQuery(parsedQuery);
        DBCursor dbCursor = dbCollection.find(mongoQuery.getQuery(), mongoQuery.getProjection()).sort(mongoQuery.getSort()).limit(mongoQuery.getLimit());
        return dbCursor.toArray();
    }


}
