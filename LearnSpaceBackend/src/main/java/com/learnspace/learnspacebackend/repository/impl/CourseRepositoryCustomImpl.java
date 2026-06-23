package com.learnspace.learnspacebackend.repository.impl;

import com.learnspace.learnspacebackend.entity.Chapter;
import com.learnspace.learnspacebackend.entity.Course;
import com.learnspace.learnspacebackend.entity.Enrollment;
import com.learnspace.learnspacebackend.entity.Lesson;
import com.learnspace.learnspacebackend.entity.LessonProgress;
import com.learnspace.learnspacebackend.repository.CourseRepositoryCustom;
import com.learnspace.learnspacebackend.repository.specifications.CourseSpecification;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class CourseRepositoryCustomImpl implements CourseRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Object[]> getCoursesWithStats(Map<String, String> params, Pageable pageable) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Object[]> query = builder.createQuery(Object[].class);

        Root<Course> root = query.from(Course.class);
        root.fetch("teacher");
        root.fetch("category");

        query.multiselect(
                root,
                root.get("avgRating"),
                root.get("enrollmentCount"),
                root.get("chapterCount"),
                root.get("lessonCount"));

        Specification<Course> spec = CourseSpecification.filterCourses(params);
        Predicate predicate = spec.toPredicate(root, query, builder);
        if (predicate != null) {
            query.where(predicate);
        }
        query.orderBy(
                builder.desc(root.get("avgRating")), builder.desc(root.get("enrollmentCount")));

        TypedQuery<Object[]> q = entityManager.createQuery(query);
        q.setFirstResult((int) pageable.getOffset());
        q.setMaxResults(pageable.getPageSize());
        return q.getResultList();
    }

    @Override
    public List<Object[]> getEnrolledCoursesByStudentId(int studentId) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Object[]> query = builder.createQuery(Object[].class);
        Root<Course> root = query.from(Course.class);

        root.fetch("teacher");
        root.fetch("category");
        Join<Course, Enrollment> enrollmentJoin = root.join("enrollments");

        Subquery<Long> countChapterQuery = query.subquery(Long.class);
        Root<Chapter> chapterRoot = countChapterQuery.from(Chapter.class);
        countChapterQuery
                .select(builder.count(chapterRoot))
                .where(builder.equal(chapterRoot.get("course"), root));

        Subquery<Long> countLessonQuery = query.subquery(Long.class);
        Root<Lesson> lessonRoot = countLessonQuery.from(Lesson.class);
        countLessonQuery
                .select(builder.count(lessonRoot))
                .where(builder.equal(lessonRoot.get("chapter").get("course"), root));

        Subquery<Long> countCompletedQuery = query.subquery(Long.class);
        Root<LessonProgress> progressRoot = countCompletedQuery.from(LessonProgress.class);
        countCompletedQuery.select(builder.count(progressRoot));
        countCompletedQuery.where(
                builder.equal(progressRoot.get("lesson").get("chapter").get("course"), root),
                builder.equal(progressRoot.get("student").get("id"), studentId),
                builder.equal(progressRoot.get("completed"), true));

        query.multiselect(root, countChapterQuery, countLessonQuery, countCompletedQuery)
                .where(builder.equal(enrollmentJoin.get("student").get("id"), studentId));

        query.orderBy(builder.desc(enrollmentJoin.get("createdAt")));
        return entityManager.createQuery(query).getResultList();
    }
}
