package com.learnspace.learnspacebackend.services;

import com.learnspace.learnspacebackend.dtos.ChapterDto;

import java.util.List;

public interface ChapterService {
    List<ChapterDto> getChapters(int courseId);
}
