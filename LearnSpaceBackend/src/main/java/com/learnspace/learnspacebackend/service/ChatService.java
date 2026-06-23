package com.learnspace.learnspacebackend.service;

import com.learnspace.learnspacebackend.dto.user.SimpleUserDto;

import java.util.List;

public interface ChatService {
    List<SimpleUserDto> getContactsEnrolled(int userId);
}
