package com.itechart.security.business.exception;

public class BusinessServiceException extends RuntimeException {
    public BusinessServiceException(String text, Throwable e){
        super(text, e);
    }

    public BusinessServiceException(Throwable e){
        super(e);
    }
}
