package com.learnspace.learnspacebackend.repositories;

import com.learnspace.learnspacebackend.pojo.Comment;

import java.util.List;

public interface CommentLessonRepository {
    List<Comment> getLessionComment(int lessonId);
    Comment createComment(int lessonId);
}
