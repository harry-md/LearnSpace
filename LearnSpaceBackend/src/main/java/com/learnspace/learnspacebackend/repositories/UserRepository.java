package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.pojo.UserRole;

import java.util.List;

public interface UserRepository {
    User getUserByUsername(String username);

    boolean authenticate(String username, String password);

    boolean checkUsernameExist(String username);

    User register(User u);

    User getUserById(Integer id);

    void update(User user);

    int countAllUser();

    List<User> getContactsEnrolled(int userId, UserRole role);
}
