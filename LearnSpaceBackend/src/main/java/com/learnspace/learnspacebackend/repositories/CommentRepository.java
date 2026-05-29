package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Comment;

public interface CommentRepository {
    Comment getCommentById(int commentId);
}
