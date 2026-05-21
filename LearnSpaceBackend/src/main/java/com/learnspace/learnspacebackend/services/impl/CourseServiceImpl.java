package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.CourseDto;
import com.learnspace.learnspacebackend.dtos.CourseListDto;
import com.learnspace.learnspacebackend.dtos.CustomUserDetails;
import com.learnspace.learnspacebackend.exceptions.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mappers.CourseMapper;
import com.learnspace.learnspacebackend.pojo.Category;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.repositories.CategoryRepository;
import com.learnspace.learnspacebackend.repositories.CourseRepository;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.CourseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<CourseDto> getAllCoursesWithDetail(Map<String, String> params) {
        return courseRepository.getAllCourses(params, true).stream()
                .map(courseMapper::toDto)
                .toList();
    }

    @Override
    public List<CourseListDto> getAllCourses(Map<String, String> params) {
        return courseRepository.getAllCourses(params, false).stream()
                .map(courseMapper::toListDto)
                .toList();
    }

    @Override
    public CourseDto getCourseById(int id) {
        Course course = courseRepository.getCourseById(id);
        if (course == null) {
            throw new ResourceNotFoundException("Không tìm thấy khóa học");
        }
        return courseMapper.toDto(course);
    }

    @Override
    public Long countCourses(Map<String, String> params) {
        return courseRepository.countCourses(params);
    }

    private User getLoggedInTeacher() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Bạn cần đăng nhập!");
        }

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        int teacherId = principal.getId();
        return userRepository.getUserReference(teacherId);
    }

    private void checkAndSetRelationship(Course course, CourseDto courseDto) {
        if (courseDto.categoryId() != null) {
            Category category = categoryRepository.getCateById(courseDto.categoryId());
            if (category == null) {
                throw new ResourceNotFoundException(
                        "Không tìm thấy danh mục #" + courseDto.categoryId());
            }
            course.setCategory(category);
        }

        User teacher = getLoggedInTeacher();
        course.setTeacher(teacher);
    }

    @Override
    public CourseDto create(CourseDto courseDto) {
        Course course = courseMapper.toEntity(courseDto);

        this.checkAndSetRelationship(course, courseDto);

        Course savedCourse = courseRepository.createOrUpdate(course);
        return courseMapper.toDto(savedCourse);
    }

    @Override
    public CourseDto update(int id, CourseDto courseDto) {
        Course existCourse = courseRepository.getCourseById(id);
        if (existCourse == null) {
            throw new ResourceNotFoundException("Không tìm thấy khóa học cần cập nhật");
        }

        User teacher = getLoggedInTeacher();

        if (existCourse.getTeacher() == null
                || !existCourse.getTeacher().getId().equals(teacher.getId())) {
            throw new AccessDeniedException("Bạn không có quyền chỉnh sửa khóa học này");
        }

        courseMapper.updateEntityFromDto(existCourse, courseDto);

        this.checkAndSetRelationship(existCourse, courseDto);
        return courseMapper.toDto(courseRepository.createOrUpdate(existCourse));
    }

    @Override
    public void deleteCourse(int id) {
        Course existCourse = courseRepository.getCourseById(id);
        if (existCourse == null) {
            throw new ResourceNotFoundException("Không tìm thấy khóa học để xóa");
        }

        User teacher = getLoggedInTeacher();

        if (existCourse.getTeacher() == null
                || !existCourse.getTeacher().getId().equals(teacher.getId())) {
            throw new AccessDeniedException("Bạn không có quyền xóa khóa học này");
        }

        courseRepository.deleteCourse(id);
    }
}
