package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.CourseDto;
import com.learnspace.learnspacebackend.dtos.CourseListDto;
import com.learnspace.learnspacebackend.dtos.CoursePatchDto;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
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
    public List<CourseListDto> getCourses(Map<String, String> params) {
        return courseRepository.getAllCourses(params, false).stream()
                .map(courseMapper::toListDto)
                .toList();
    }

    @Override
    public CourseDto getCourse(int id) {
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
        CustomUserDetails principal = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.getUserById(principal.getId());
    }

    private void verifyCourseOwner(Course course, User teacher) {
        if (!course.getTeacher().getId().equals(teacher.getId())) {
            throw new AccessDeniedException("Bạn không có quyền chỉnh sửa khóa học này");
        }
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public CourseDto createCourse(CourseDto courseDto) {
        Course course = courseMapper.toEntity(courseDto);

        if (courseDto.categoryId() != null) {
            Category category = categoryRepository.getCateById(courseDto.categoryId());
            if (category == null) {
                throw new ResourceNotFoundException(
                        "Không tìm thấy danh mục " + courseDto.categoryId());
            }
            course.setCategory(category);
        }

        course.setTeacher(getLoggedInTeacher());

        Course savedCourse = courseRepository.createOrUpdate(course);
        return courseMapper.toDto(savedCourse);
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public CourseDto updateCourse(int id, CoursePatchDto courseDto) {
        Course existCourse = courseRepository.getCourseById(id);
        if (existCourse == null) {
            throw new ResourceNotFoundException("Không tìm thấy khóa học cần cập nhật");
        }

        User teacher = getLoggedInTeacher();
        verifyCourseOwner(existCourse, teacher);

        courseMapper.updateEntityFromDto(existCourse, courseDto);

        if (courseDto.categoryId() != null) {
            Category category = categoryRepository.getCateById(courseDto.categoryId());
            if (category == null) {
                throw new ResourceNotFoundException(
                        "Không tìm thấy danh mục " + courseDto.categoryId());
            }
            existCourse.setCategory(category);
        }
        return courseMapper.toDto(courseRepository.createOrUpdate(existCourse));
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public void deleteCourse(int id) {
        Course existCourse = courseRepository.getCourseById(id);
        if (existCourse == null) {
            throw new ResourceNotFoundException("Không tìm thấy khóa học để xóa");
        }

        User teacher = getLoggedInTeacher();
        verifyCourseOwner(existCourse, teacher);

        courseRepository.deleteCourse(id);
    }
}
