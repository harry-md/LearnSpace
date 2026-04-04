package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.User;

public interface UserRepository {
    User getUserByUsername(String username);

    User register(User u);
}
