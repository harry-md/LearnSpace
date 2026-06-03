package com.learnspace.learnspacebackend.services.impl;

import com.learnspace.learnspacebackend.dtos.course.CourseDto;
import com.learnspace.learnspacebackend.dtos.course.CourseListDto;
import com.learnspace.learnspacebackend.dtos.course.CoursePatchDto;
import com.learnspace.learnspacebackend.dtos.course.MyCourseListDto;
import com.learnspace.learnspacebackend.dtos.pagination.PaginatedResponseDto;
import com.learnspace.learnspacebackend.dtos.progress.LessonProgressDto;
import com.learnspace.learnspacebackend.dtos.security.CustomUserDetails;
import com.learnspace.learnspacebackend.mappers.CourseMapper;
import com.learnspace.learnspacebackend.mappers.LessonProgressMapper;
import com.learnspace.learnspacebackend.mappers.PaginatedResponseMapper;
import com.learnspace.learnspacebackend.pojo.Category;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.LessonProgress;
import com.learnspace.learnspacebackend.pojo.User;
import com.learnspace.learnspacebackend.repositories.CategoryRepository;
import com.learnspace.learnspacebackend.repositories.CourseRepository;
import com.learnspace.learnspacebackend.repositories.EnrollmentRepository;
import com.learnspace.learnspacebackend.repositories.LessonProgressRepository;
import com.learnspace.learnspacebackend.repositories.LessonRepository;
import com.learnspace.learnspacebackend.repositories.ReviewRepository;
import com.learnspace.learnspacebackend.repositories.UserRepository;
import com.learnspace.learnspacebackend.services.CloudinaryService;
import com.learnspace.learnspacebackend.services.CourseService;
import com.learnspace.learnspacebackend.services.R2Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@Transactional
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
    private LessonProgressRepository progressRepository;

    @Autowired
    private LessonProgressMapper progressMapper;

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
                    Course course = (Course) row[0];
                    Double avgRating = (Double) row[1];
                    Long enrollmentCount = (Long) row[2];
                    Long chapterCount = (Long) row[3];
                    Long lessonCount = (Long) row[4];
                    CourseListDto base = courseMapper.toListDto(course);

                    return new CourseListDto(
                            base.id(),
                            base.name(),
                            base.image(),
                            base.price(),
                            base.category(),
                            base.teacher(),
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
        Double avgRating = reviewRepository.getAverageRatingByCourseId(courseId);
        Long enrollCount = enrollmentRepository.countEnrollmentsByCourse(courseId);
        LessonProgressDto latestProgress = null;

        Object p = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CustomUserDetails principal = p.equals("anonymousUser") ? null : (CustomUserDetails) p;
        if (principal != null) {
            LessonProgress l = progressRepository.getLessonProgressByStudentAndCourse(
                    principal.getId(), courseId);
            latestProgress = progressMapper.toDto(l);
        }

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
                latestProgress,
                dto.createdAt(),
                dto.updatedAt(),
                dto.imageFile(),
                dto.introVideoFile());
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
            throw new AccessDeniedException("Không sở hữu khóa học");
        }
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public CourseDto createCourse(CourseDto courseDto) {
        Course course = courseMapper.toEntity(courseDto);

        if (courseDto.categoryId() != null) {
            Category category = categoryRepository.getCateById(courseDto.categoryId());
            course.setCategory(category);
        }

        course.setTeacher(getLoggedInTeacher());

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
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public CourseDto updateCourse(int id, CoursePatchDto courseDto) {
        Course existCourse = courseRepository.getCourseById(id);
        User teacher = getLoggedInTeacher();
        verifyCourseOwner(existCourse, teacher);

        courseMapper.updateEntityFromDto(existCourse, courseDto);

        if (courseDto.categoryId() != null) {
            Category category = categoryRepository.getCateById(courseDto.categoryId());
            if (category == null) {
                throw new IllegalArgumentException("Không tìm thấy danh mục");
            }
            existCourse.setCategory(category);
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
            cloudinaryService.deleteImage(existCourse.getImage());
            existCourse.setImage(cloudinaryService.uploadImage(imageFile));
        }

        if (introVideoFile != null && !introVideoFile.isEmpty()) {
            cloudinaryService.deleteVideo(existCourse.getIntroVideo());
            existCourse.setIntroVideo(cloudinaryService.uploadVideo(introVideoFile));
        }

        return courseMapper.toDto(courseRepository.addOrUpdateCourse(existCourse));
    }

    @Override
    @PreAuthorize("hasRole('VERIFIED_TEACHER')")
    public void deleteCourse(int id) {
        Course course = courseRepository.getCourseById(id);
        if (course == null) {
            throw new IllegalArgumentException("Không tìm thấy khóa học");
        }

        User teacher = getLoggedInTeacher();
        verifyCourseOwner(course, teacher);

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

        return courseRepository.getEnrolledCoursesByStudent(principal.getId()).stream()
                .map(row -> {
                    Course course = (Course) row[0];
                    Long chapterCount = (Long) row[1];
                    Long lessonCount = (Long) row[2];
                    Long completedCount = (Long) row[3];
                    CourseListDto base = courseMapper.toListDto(course);

                    return new MyCourseListDto(
                            base.id(),
                            base.name(),
                            base.image(),
                            base.price(),
                            base.category(),
                            base.teacher(),
                            chapterCount,
                            lessonCount,
                            completedCount);
                })
                .toList();
    }
}
