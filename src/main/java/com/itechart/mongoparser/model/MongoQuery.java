package com.itechart.mongoparser.model;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import lombok.Data;

/**
 * Model for mongo query parts
 */
@Data
public class MongoQuery {
    private DBObject query;
    private DBObject projection;
    private DBObject sort;
    private Integer limit;

    public MongoQuery() {
        this.query = new BasicDBObject();
        this.projection = new BasicDBObject();
        this.sort = new BasicDBObject();
        this.limit = Integer.MAX_VALUE;
    }
}
