package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.course.CourseDto;
import com.learnspace.learnspacebackend.dtos.course.CourseListDto;
import com.learnspace.learnspacebackend.dtos.course.CoursePatchDto;
import com.learnspace.learnspacebackend.dtos.course.MyCourseListDto;
import com.learnspace.learnspacebackend.dtos.pagination.PaginatedResponseDto;
import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
import com.learnspace.learnspacebackend.mappers.CourseMapper;
import com.learnspace.learnspacebackend.mappers.PaginatedResponseMapper;
import com.learnspace.learnspacebackend.pojo.Category;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.UserRole;
import com.learnspace.learnspacebackend.repositories.CategoryRepository;
import com.learnspace.learnspacebackend.repositories.CourseRepository;
import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;
import com.learnspace.learnspacebackend.repositories.LessonRepository;
import com.learnspace.learnspacebackend.repositories.ReviewRepository;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.CloudinaryService;
import com.learnspace.learnspacebackend.services.CourseService;
import com.learnspace.learnspacebackend.services.R2Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class CourseServiceImpl implements CourseService {
    @Autowired
    private CourseRepository courseRepository;

    @Value("${course.page_size}")
    private int COURSE_PAGE_SIZE;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private R2Service r2Service;

    @Override
    public PaginatedResponseDto<CourseListDto> getCourses(Map<String, String> params) {
        List<CourseListDto> results = courseRepository.getAllCourses(params).stream()
                .map(row -> {
                    Course c = (Course) row[0];
                    Double avgRating = (Double) row[1];
                    Long enrollmentCount = (Long) row[2];
                    Long chapterCount = (Long) row[3];
                    Long lessonCount = (Long) row[4];
                    CourseListDto course = courseMapper.toListDto(c);

                    return new CourseListDto(
                            course.id(),
                            course.name(),
                            course.image(),
                            course.price(),
                            course.category(),
                            course.teacher(),
                            avgRating,
                            enrollmentCount,
                            chapterCount,
                            lessonCount);
                })
                .toList();
        return PaginatedResponseMapper.toPaginatedResponseDto(
                courseRepository.countCourses(params),
                Integer.parseInt(params.getOrDefault("page", "1")),
                COURSE_PAGE_SIZE,
                results);
    }

    @Override
    public CourseDto getCourse(int courseId) {
        Course course = courseRepository.getCourseById(courseId);
        CourseDto dto = courseMapper.toDto(course);
        Double avgRating = reviewRepository.getAverageRatingByCourse(courseId);
        Long enrollCount = enrollmentRepository.countEnrollments(courseId);

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
    public Long countCourses(Map<String, String> params) {
        return courseRepository.countCourses(params);
    }

    private CustomUserDetails getPrincipal() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private void checkCourseOwner(Course course) {
        CustomUserDetails principal = getPrincipal();
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + UserRole.ADMIN.name()));

        if (!course.getTeacher().getId().equals(principal.getId()) && !isAdmin) {
            throw new AccessDeniedException("Không có quyền sửa khóa học");
        }
    }

    @Override
    public CourseDto createCourse(CourseDto courseDto) throws IOException {
        Course course = courseMapper.toEntity(courseDto);
        Category category = categoryRepository.getCateById(courseDto.categoryId());
        course.setCategory(category);
        course.setTeacher(userRepository.getUserById(getPrincipal().getId()));

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

        Course savedCourse = courseRepository.addOrUpdateCourse(course);
        return courseMapper.toDto(savedCourse);
    }

    @Override
    public CourseDto updateCourse(int id, CoursePatchDto courseDto) throws IOException {
        Course course = courseRepository.getCourseById(id);
        checkCourseOwner(course);
        courseMapper.updateEntityFromDto(course, courseDto);

        if (courseDto.categoryId() != null) {
            Category category = categoryRepository.getCateById(courseDto.categoryId());
            course.setCategory(category);
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

        return courseMapper.toDto(courseRepository.addOrUpdateCourse(course));
    }

    @Override
    public void deleteCourse(int id) throws IOException {
        Course course = courseRepository.getCourseById(id);
        if (course == null) {
            throw new IllegalArgumentException("Không tìm thấy khóa học");
        }
        checkCourseOwner(course);

        List<String> lessonVideoUrls = lessonRepository.getVideoUrlsByCourseId(id);
        r2Service.deleteVideos(lessonVideoUrls);

        if (course.getImage() != null) {
            cloudinaryService.deleteImage(course.getImage());
        }

        if (course.getIntroVideo() != null) {
            cloudinaryService.deleteVideo(course.getIntroVideo());
        }

        courseRepository.deleteCourse(id);
    }

    @Override
    public List<MyCourseListDto> getEnrolledCourses() {
        CustomUserDetails principal = (CustomUserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Object[]> courses = courseRepository.getEnrolledCoursesByStudent(principal.getId());
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
