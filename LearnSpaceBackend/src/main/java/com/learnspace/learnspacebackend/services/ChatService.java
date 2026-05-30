package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.user.SimpleUserDto;

import java.util.List;

public interface ChatService {
    List<SimpleUserDto> getContactsEnrolled(int userId);
}
