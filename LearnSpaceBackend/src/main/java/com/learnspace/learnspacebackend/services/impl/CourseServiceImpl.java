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
import com.learnspace.learnspacebackend.repositories.ChapterRepository;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    private LessonProgressRepository progressRepository;

    @Autowired
    private LessonProgressMapper progressMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private R2Service r2Service;

    @Override
    public PaginatedResponseDto<CourseListDto> getCourses(Map<String, String> params) {
        List<Course> courses = courseRepository.getAllCourses(params);
        List<Integer> courseIds = courses.stream().map(Course::getId).toList();

        Map<Integer, Double> avgRatings = reviewRepository.avgRatings(courseIds);
        Map<Integer, Long> enrollmentCounts = enrollmentRepository.getEnrollmentCounts(courseIds);
        Map<Integer, Long> chapterCounts = chapterRepository.countChapters(courseIds);
        Map<Integer, Long> lessonCounts = lessonRepository.countLessons(courseIds);

        List<CourseListDto> results = courses.stream()
                .map(c -> {
                    CourseListDto course = courseMapper.toListDto(c);
                    Double avgRating = avgRatings.get(c.getId());
                    Long enrollmentCount = enrollmentCounts.getOrDefault(c.getId(), 0L);
                    Long chapterCount = chapterCounts.getOrDefault(c.getId(), 0L);
                    Long lessonCount = lessonCounts.getOrDefault(c.getId(), 0L);

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
    public CourseDto updateCourse(int id, CoursePatchDto courseDto) {
        Course existCourse = courseRepository.getCourseById(id);
        User teacher = getLoggedInTeacher();
        verifyCourseOwner(existCourse, teacher);

        courseMapper.updateEntityFromDto(existCourse, courseDto);

        if (courseDto.categoryId() != null) {
            Category category = categoryRepository.getCateById(courseDto.categoryId());
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
        List<Course> courses = courseRepository.getEnrolledCoursesByStudent(principal.getId());

        List<Integer> courseIds = courses.stream().map(Course::getId).toList();
        Map<Integer, Long> chapterCounts = chapterRepository.countChapters(courseIds);
        Map<Integer, Long> lessonCounts = lessonRepository.countLessons(courseIds);
        Map<Integer, Long> completedCounts =
                progressRepository.countCompletedLessons(principal.getId(), courseIds);

        return courses.stream()
                .map(c -> {
                    Long chapterCount = chapterCounts.getOrDefault(c.getId(), 0L);
                    Long lessonCount = lessonCounts.getOrDefault(c.getId(), 0L);
                    Long completedCount = completedCounts.getOrDefault(c.getId(), 0L);

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
