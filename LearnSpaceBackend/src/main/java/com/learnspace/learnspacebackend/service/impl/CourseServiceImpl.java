package com.learnspace.learnspacebackend.service.impl;

import com.learnspace.learnspacebackend.dto.course.CourseDto;
import com.learnspace.learnspacebackend.dto.course.CourseListDto;
import com.learnspace.learnspacebackend.dto.course.CoursePatchDto;
import com.learnspace.learnspacebackend.dto.course.MyCourseListDto;
import com.learnspace.learnspacebackend.dto.security.CustomUserDetails;
import com.learnspace.learnspacebackend.entity.Course;
import com.learnspace.learnspacebackend.entity.EnrollmentStatus;
import com.learnspace.learnspacebackend.entity.UserRole;
import com.learnspace.learnspacebackend.exception.ResourceNotFoundException;
import com.learnspace.learnspacebackend.mapper.CategoryMapper;
import com.learnspace.learnspacebackend.mapper.CourseMapper;
import com.learnspace.learnspacebackend.mapper.UserMapper;
import com.learnspace.learnspacebackend.repository.CategoryRepository;
import com.learnspace.learnspacebackend.repository.CourseRepository;
import com.learnspace.learnspacebackend.repository.EnrollmentRepository;
import com.learnspace.learnspacebackend.repository.LessonRepository;
import com.learnspace.learnspacebackend.repository.ReviewRepository;
import com.learnspace.learnspacebackend.repository.UserRepository;
import com.learnspace.learnspacebackend.repository.specifications.CourseSpecification;
import com.learnspace.learnspacebackend.service.CloudinaryService;
import com.learnspace.learnspacebackend.service.CourseService;
import com.learnspace.learnspacebackend.service.R2Service;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
@Transactional
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final UserMapper userMapper;
    private final CourseMapper courseMapper;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ReviewRepository reviewRepository;
    private final CloudinaryService cloudinaryService;
    private final R2Service r2Service;

    @Value("${course.page_size}")
    private int COURSE_PAGE_SIZE;

    @Override
    @Transactional(readOnly = true)
    public Page<CourseListDto> getCourses(Map<String, String> params) {
        int page = Integer.parseInt(params.getOrDefault("page", "1")) - 1;
        page = Math.max(0, page);

        Pageable pageable = PageRequest.of(page, COURSE_PAGE_SIZE);
        long totalElements = courseRepository.count(CourseSpecification.filterCourses(params));
        List<CourseListDto> results =
                courseRepository.getCoursesWithStats(params, pageable).stream()
                        .map(row -> {
                            Course c = (Course) row[0];
                            return new CourseListDto(
                                    c.getId(),
                                    c.getName(),
                                    c.getImage(),
                                    c.getPrice(),
                                    categoryMapper.toDto(c.getCategory()),
                                    userMapper.toSimpleUserDto(c.getTeacher()),
                                    (Double) row[1],
                                    (Long) row[2],
                                    (Long) row[3],
                                    (Long) row[4]);
                        })
                        .toList();

        return new PageImpl<>(results, pageable, totalElements);
    }

    private Course getCourseOrThrow(int courseId) {
        return courseRepository
                .findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("NOT_FOUND", "Không tìm thấy khóa học"));
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDto getCourse(int courseId) {
        Course course = getCourseOrThrow(courseId);
        CourseDto dto = courseMapper.toDto(course);
        Double avgRating = reviewRepository.getAverageRatingByCourseId(courseId);
        Long enrollCount = enrollmentRepository.countByCourseIdAndStatusIn(
                courseId, List.of(EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED));

        return new CourseDto(
                dto.id(),
                dto.name(),
                dto.description(),
                dto.image(),
                dto.introVideo(),
                dto.price(),
                dto.categoryId(),
                avgRating,
                enrollCount,
                dto.chapters(),
                dto.category(),
                dto.teacher(),
                dto.createdAt(),
                dto.updatedAt(),
                dto.imageFile(),
                dto.introVideoFile());
    }

    @Override
    @Transactional(readOnly = true)
    public Long countCourses(Map<String, String> params) {
        return courseRepository.count(CourseSpecification.filterCourses(params));
    }

    private CustomUserDetails getPrincipal() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private void isCourseOwner(int courseId) {
        CustomUserDetails principal = getPrincipal();
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + UserRole.ADMIN.name()));

        if (!isAdmin) {
            boolean isOwner = courseRepository.existsByIdAndTeacherId(courseId, principal.getId());
            if (!isOwner) {
                throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác này!");
            }
        }
    }

    @Override
    public CourseDto createCourse(CourseDto courseDto) throws IOException {
        if (!categoryRepository.existsById(courseDto.categoryId())) {
            throw new ResourceNotFoundException("NOT_FOUND", "Không tìm thấy danh mục");
        }

        Course course = courseMapper.toEntity(courseDto);
        course.setCategory(categoryRepository.getReferenceById(courseDto.categoryId()));
        course.setTeacher(userRepository.getReferenceById(getPrincipal().getId()));

        MultipartFile imageFile = courseDto.imageFile();
        if (imageFile != null && !imageFile.isEmpty()) {
            cloudinaryService.validateImageFile(imageFile);
        }
        MultipartFile introVideoFile = courseDto.introVideoFile();
        if (introVideoFile != null && !introVideoFile.isEmpty()) {
            cloudinaryService.validateVideoFile(introVideoFile);
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            course.setImage(cloudinaryService.uploadImage(imageFile));
        }
        if (introVideoFile != null && !introVideoFile.isEmpty()) {
            course.setIntroVideo(cloudinaryService.uploadVideo(introVideoFile));
        }

        Course savedCourse = courseRepository.save(course);
        return courseMapper.toDto(savedCourse);
    }

    @Override
    public CourseDto updateCourse(int courseId, CoursePatchDto courseDto) {
        isCourseOwner(courseId);

        Course course = getCourseOrThrow(courseId);
        courseMapper.updateEntityFromDto(course, courseDto);

        if (courseDto.categoryId() != null) {
            if (!categoryRepository.existsById(courseDto.categoryId())) {
                throw new ResourceNotFoundException("NOT_FOUND", "Không tìm thấy danh mục");
            }
            course.setCategory(categoryRepository.getReferenceById(courseDto.categoryId()));
        }

        MultipartFile imageFile = courseDto.imageFile();
        if (imageFile != null && !imageFile.isEmpty()) {
            cloudinaryService.validateImageFile(imageFile);
        }

        MultipartFile introVideoFile = courseDto.introVideoFile();
        if (introVideoFile != null && !introVideoFile.isEmpty()) {
            cloudinaryService.validateVideoFile(introVideoFile);
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            cloudinaryService.deleteImage(course.getImage());
            course.setImage(cloudinaryService.uploadImage(imageFile));
        }

        if (introVideoFile != null && !introVideoFile.isEmpty()) {
            cloudinaryService.deleteVideo(course.getIntroVideo());
            course.setIntroVideo(cloudinaryService.uploadVideo(introVideoFile));
        }

        return courseMapper.toDto(courseRepository.save(course));
    }

    @Override
    public void deleteCourse(int courseId) {
        isCourseOwner(courseId);

        Course course = getCourseOrThrow(courseId);

        List<String> lessonVideoUrls = lessonRepository.getVideoUrlsByCourseId(courseId);
        r2Service.deleteVideos(lessonVideoUrls);

        if (course.getImage() != null) {
            cloudinaryService.deleteImage(course.getImage());
        }

        if (course.getIntroVideo() != null) {
            cloudinaryService.deleteVideo(course.getIntroVideo());
        }

        courseRepository.deleteById(courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MyCourseListDto> getEnrolledCourses() {
        CustomUserDetails principal = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Object[]> courses = courseRepository.getEnrolledCoursesByStudentId(principal.getId());
        return courses.stream()
                .map(row -> {
                    Course c = (Course) row[0];
                    Long chapterCount = (Long) row[1];
                    Long lessonCount = (Long) row[2];
                    Long completedCount = (Long) row[3];
                    CourseListDto course = courseMapper.toListDto(c);
                    return new MyCourseListDto(
                            course.id(),
                            course.name(),
                            course.image(),
                            course.price(),
                            course.category(),
                            course.teacher(),
                            chapterCount,
                            lessonCount,
                            completedCount);
                })
                .toList();
    }
}
