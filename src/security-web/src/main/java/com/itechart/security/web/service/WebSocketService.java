package com.itechart.security.web.service;

import com.itechart.security.business.model.dto.ContactDto;

public interface WebSocketService {
    void sendMessage(ContactDto dto);
}
