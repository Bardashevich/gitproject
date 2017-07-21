package com.itechart.security.web.service.impl;

import com.itechart.security.web.service.JmsMessageSenderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.stereotype.Service;

import javax.jms.Destination;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;

/**
 * Created by artsiom.marenau on 2/9/2017.
 */
@Service
public class JmsMessageSenderServiceImpl implements JmsMessageSenderService {

    private static final Logger logger = LoggerFactory.getLogger(JmsMessageSenderServiceImpl.class);

    @Autowired
    private JmsTemplate jmsTemplate;

    /**
     * send text to default destination
     * @param text
     */
    public void send(final String text) {
        jmsTemplate.send(new MessageCreator() {
            @Override
            public Message createMessage(Session session) throws JMSException {
                return session.createTextMessage(text);
            }
        });
    }

    /**
     * Simplify the send by using convertAndSend
     * @param text
     */
    public void sendText(final String text) {
        jmsTemplate.convertAndSend(text);
    }

    /**
     * Send text message to a specified destination
     * @param text
     */
    public void send(final Destination dest, final String text) {
        jmsTemplate.send(dest,new MessageCreator() {
            @Override
            public Message createMessage(Session session) throws JMSException {
                return session.createTextMessage(text);
            }
        });
    }
}
