package com.itechart.security.web.service.impl;

import com.itechart.security.business.model.dto.ContactDto;
import com.itechart.security.web.service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
public class WebSocketServiceImpl implements WebSocketService {

    private SimpMessagingTemplate simpMessagingTemplate;

    @PreAuthorize("hasAnyRole('HR', 'DEPARTMENT_MANAGER', 'TUTOR')")
    public void sendMessage(ContactDto dto) {
        simpMessagingTemplate.convertAndSend("/topic/greetings", dto);
    }

    @Autowired
    public void setSimpMessagingTemplate(SimpMessagingTemplate simpMessagingTemplate){
        this.simpMessagingTemplate = simpMessagingTemplate;
    }
}
