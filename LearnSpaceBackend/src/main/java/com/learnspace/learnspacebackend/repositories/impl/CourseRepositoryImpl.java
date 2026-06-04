package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.*;
import com.learnspace.learnspacebackend.repositories.CourseRepository;

import jakarta.persistence.Query;
import jakarta.persistence.criteria.*;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
@Transactional
public class CourseRepositoryImpl implements CourseRepository {
    @Autowired
    private LocalSessionFactoryBean factory;

    @Value("${course.page_size}")
    private int COURSE_PAGE_SIZE;

    private List<Predicate> filter(
            Map<String, String> params, CriteriaBuilder b, Root<Course> root) {
        List<Predicate> predicates = new ArrayList<>();
        if (params == null) {
            return predicates;
        }

        String kw = params.get("kw");
        if (kw != null && !kw.isBlank()) {
            predicates.add(b.like(root.get("name"), String.format("%%%s%%", kw)));
        }

        String fromPrice = params.get("fromPrice");
        if (fromPrice != null && !fromPrice.isBlank()) {
            BigDecimal price = new BigDecimal(fromPrice);
            predicates.add(b.greaterThanOrEqualTo(root.get("price"), price));
        }

        String toPrice = params.get("toPrice");
        if (toPrice != null && !toPrice.isBlank()) {
            BigDecimal price = new BigDecimal(toPrice);
            predicates.add(b.lessThanOrEqualTo(root.get("price"), price));
        }

        String teacherName = params.get("teacherName");
        if (teacherName != null && !teacherName.isBlank()) {
            predicates.add(b.like(
                    root.get("teacher").get("fullName"), String.format("%%%s%%", teacherName)));
        }

        String categoryId = params.get("categoryId");
        if (categoryId != null && !categoryId.isBlank()) {
            Integer id = Integer.parseInt(categoryId);
            predicates.add(b.equal(root.get("category").get("id"), id));
        }

        String teacherId = params.get("teacherId");
        if (teacherId != null && !teacherId.isBlank()) {
            Integer id = Integer.parseInt(teacherId);
            predicates.add(b.equal(root.get("teacher").get("id"), id));
        }
        return predicates;
    }

    @Override
    public List<Object[]> getAllCourses(Map<String, String> params) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);
        Root<Course> root = q.from(Course.class);

        root.fetch("category");
        root.fetch("teacher");

        Subquery<Double> avgRatingQuery = q.subquery(Double.class);
        Root<Review> reviewRoot = avgRatingQuery.from(Review.class);
        avgRatingQuery
                .select(b.avg(reviewRoot.get("rating")))
                .where(b.equal(reviewRoot.get("course"), root));

        Subquery<Long> countEnrollmentQuery = q.subquery(Long.class);
        Root<Enrollment> enrollmentRoot = countEnrollmentQuery.from(Enrollment.class);
        countEnrollmentQuery
                .select(b.count(enrollmentRoot))
                .where(b.equal(enrollmentRoot.get("course"), root));

        Subquery<Long> countChapterQuery = q.subquery(Long.class);
        Root<Chapter> chapterRoot = countChapterQuery.from(Chapter.class);
        countChapterQuery
                .select(b.count(chapterRoot))
                .where(b.equal(chapterRoot.get("course"), root));

        Subquery<Long> countLessonQuery = q.subquery(Long.class);
        Root<Lesson> lessonRoot = countLessonQuery.from(Lesson.class);
        countLessonQuery
                .select(b.count(lessonRoot))
                .where(b.equal(lessonRoot.get("chapter").get("course"), root));

        q.multiselect(
                root,
                avgRatingQuery.getSelection(),
                countEnrollmentQuery.getSelection(),
                countChapterQuery.getSelection(),
                countLessonQuery.getSelection());

        List<Predicate> predicates = filter(params, b, root);
        if (!predicates.isEmpty()) {
            q.where(b.and(predicates.toArray(Predicate[]::new)));
        }

        q.orderBy(
                b.desc(avgRatingQuery.getSelection()), b.desc(countEnrollmentQuery.getSelection()));

        Query query = session.createQuery(q);
        if (params != null) {
            int page = Integer.parseInt(params.getOrDefault("page", "1"));
            int start = (page - 1) * COURSE_PAGE_SIZE;
            query.setFirstResult(start);
            query.setMaxResults(COURSE_PAGE_SIZE);
        }
        return query.getResultList();
    }

    public Long countCourses(Map<String, String> params) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Long> q = b.createQuery(Long.class);
        Root<Course> root = q.from(Course.class);

        q.select(b.count(root));
        List<Predicate> predicates = filter(params, b, root);
        if (!predicates.isEmpty()) {
            q.where(predicates.toArray(Predicate[]::new));
        }
        return session.createQuery(q).getSingleResult();
    }

    @Override
    public Course getCourseById(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Course> q = b.createQuery(Course.class);

        Root<Course> root = q.from(Course.class);
        root.fetch("category");
        root.fetch("teacher");

        Fetch<Course, Chapter> chaptersFetch = root.fetch("chapters", JoinType.LEFT);
        chaptersFetch.fetch("lessons", JoinType.LEFT);

        q.select(root).where(b.equal(root.get("id"), courseId));
        return session.createQuery(q).getSingleResult();
    }

    @Override
    public Course addOrUpdateCourse(Course course) {
        Session session = factory.getObject().getCurrentSession();
        if (course.getId() == null) {
            session.persist(course);
            return course;
        }
        Course merged = session.merge(course);
        return getCourseById(merged.getId());
    }

    @Override
    public void deleteCourse(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        Course c = session.get(Course.class, courseId);

        if (c != null) {
            session.remove(c);
        }
    }

    @Override
    public List<Object[]> getEnrolledCoursesByStudent(int studentId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder b = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = b.createQuery(Object[].class);

        Root<Course> root = q.from(Course.class);
        root.fetch("category");
        root.fetch("teacher");
        Join<Course, Enrollment> enrollmentJoin = root.join("enrollments");

        Subquery<Long> countChapterQuery = q.subquery(Long.class);
        Root<Chapter> chapterRoot = countChapterQuery.from(Chapter.class);
        countChapterQuery
                .select(b.count(chapterRoot))
                .where(b.equal(chapterRoot.get("course"), root));

        Subquery<Long> countLessonQuery = q.subquery(Long.class);
        Root<Lesson> lessonRoot = countLessonQuery.from(Lesson.class);
        countLessonQuery
                .select(b.count(lessonRoot))
                .where(b.equal(lessonRoot.get("chapter").get("course"), root));

        Subquery<Long> countCompletedQuery = q.subquery(Long.class);
        Root<LessonProgress> progressRoot = countCompletedQuery.from(LessonProgress.class);
        countCompletedQuery.select(b.count(progressRoot));
        countCompletedQuery.where(
                b.equal(progressRoot.get("lesson").get("chapter").get("course"), root),
                b.equal(progressRoot.get("student").get("id"), studentId),
                b.equal(progressRoot.get("completed"), true));

        q.multiselect(
                        root,
                        countChapterQuery.getSelection(),
                        countLessonQuery.getSelection(),
                        countCompletedQuery.getSelection())
                .where(b.equal(enrollmentJoin.get("student").get("id"), studentId));

        q.orderBy(b.desc(enrollmentJoin.get("createdAt")));
        return session.createQuery(q).getResultList();
    }
}
