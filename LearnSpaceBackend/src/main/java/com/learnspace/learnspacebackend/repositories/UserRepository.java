package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.User;

import java.util.List;
import java.util.Map;

public interface UserRepository {

    User getUserByUsername(String username);

    boolean checkUsernameExist(String username);

    User register(User u);

    List<User> getAllUsers(Map<String, String> params);

    User getUserById(Integer id);

    void update(User user);

    User getUserReference(int id);
}
