package com.learnspace.learnspacebackend.repositories.impl;

import com.learnspace.learnspacebackend.pojo.Chapter;
import com.learnspace.learnspacebackend.pojo.Course;
import com.learnspace.learnspacebackend.pojo.Enrollment;
import com.learnspace.learnspacebackend.pojo.Lesson;
import com.learnspace.learnspacebackend.pojo.LessonProgress;
import com.learnspace.learnspacebackend.pojo.Review;
import com.learnspace.learnspacebackend.repositories.CourseRepository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Fetch;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

import org.hibernate.Session;
import org.hibernate.query.Query;
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

    @Value("${course.pageSize}")
    private int COURSE_PAGE_SIZE_KEY;

    private List<Predicate> buildPredicates(
            Map<String, String> params, CriteriaBuilder builder, Root<Course> root) {
        List<Predicate> predicates = new ArrayList<>();
        if (params == null) {
            return predicates;
        }

        String kw = params.get("kw");
        if (kw != null && !kw.isBlank()) {
            predicates.add(builder.like(
                    builder.lower(root.get("name")),
                    String.format("%%%s%%", kw.trim().toLowerCase())));
        }

        String fromPrice = params.get("fromPrice");
        if (fromPrice != null && !fromPrice.isBlank()) {
            BigDecimal price = parsePrice(fromPrice);
            if (price != null) {
                predicates.add(builder.greaterThanOrEqualTo(root.get("price"), price));
            }
        }

        String toPrice = params.get("toPrice");
        if (toPrice != null && !toPrice.isBlank()) {
            BigDecimal price = parsePrice(toPrice);
            if (price != null) {
                predicates.add(builder.lessThanOrEqualTo(root.get("price"), price));
            }
        }

        String categoryId = params.get("categoryId");
        if (categoryId != null && !categoryId.isBlank()) {
            Integer id = parseId(categoryId);
            if (id != null) {
                predicates.add(builder.equal(root.get("category").get("id"), id));
            }
        }

        String teacherId = params.get("teacherId");
        if (teacherId != null && !teacherId.isBlank()) {
            Integer id = parseId(teacherId);
            if (id != null) {
                predicates.add(builder.equal(root.get("teacher").get("id"), id));
            }
        }

        String teacherName = params.get("teacherName");
        if (teacherName != null && !teacherName.isBlank()) {
            Expression<String> fullName = builder.concat(
                    builder.concat(root.get("teacher").get("firstName"), " "),
                    root.get("teacher").get("lastName"));
            predicates.add(builder.like(
                    builder.lower(fullName),
                    String.format("%%%s%%", teacherName.trim().toLowerCase())));
        }

        return predicates;
    }

    @Override
    public List<Object[]> getAllCourses(Map<String, String> params) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = builder.createQuery(Object[].class);
        Root<Course> root = q.from(Course.class);

        root.fetch("category", JoinType.INNER);
        root.fetch("teacher", JoinType.INNER);

        Subquery<Double> avgRatingSubquery = q.subquery(Double.class);
        Root<Review> reviewRoot = avgRatingSubquery.from(Review.class);
        avgRatingSubquery
                .select(builder.avg(reviewRoot.get("rating")))
                .where(builder.equal(reviewRoot.get("course"), root));

        Subquery<Long> enrollmentCountSubquery = q.subquery(Long.class);
        Root<Enrollment> enrollmentRoot = enrollmentCountSubquery.from(Enrollment.class);
        enrollmentCountSubquery
                .select(builder.count(enrollmentRoot))
                .where(builder.and(
                        builder.equal(enrollmentRoot.get("course"), root),
                        enrollmentRoot.get("status").in("ACTIVE", "COMPLETED")));

        Subquery<Long> chapterCountSubquery = q.subquery(Long.class);
        Root<Chapter> chapterRoot = chapterCountSubquery.from(Chapter.class);
        chapterCountSubquery
                .select(builder.count(chapterRoot))
                .where(builder.equal(chapterRoot.get("course"), root));

        Subquery<Long> lessonCountSubquery = q.subquery(Long.class);
        Root<Lesson> lessonRoot = lessonCountSubquery.from(Lesson.class);
        Join<Lesson, Chapter> lessonJoin = lessonRoot.join("chapter");
        lessonCountSubquery
                .select(builder.count(lessonRoot))
                .where(builder.equal(lessonJoin.get("course"), root));

        q.multiselect(
                root,
                avgRatingSubquery.getSelection(),
                enrollmentCountSubquery.getSelection(),
                chapterCountSubquery.getSelection(),
                lessonCountSubquery.getSelection());

        List<Predicate> predicates = buildPredicates(params, builder, root);
        if (!predicates.isEmpty()) {
            q.where(builder.and(predicates.toArray(Predicate[]::new)));
        }

        q.orderBy(
                builder.desc(avgRatingSubquery.getSelection()),
                builder.desc(enrollmentCountSubquery.getSelection()));

        Query<Object[]> query = session.createQuery(q);
        if (params != null) {
            int page = Integer.parseInt(params.getOrDefault("page", "1"));
            int start = (page - 1) * COURSE_PAGE_SIZE_KEY;
            query.setFirstResult(start);
            query.setMaxResults(COURSE_PAGE_SIZE_KEY);
        }
        return query.getResultList();
    }

    public Long countCourses(Map<String, String> params) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Long> q = builder.createQuery(Long.class);
        Root<Course> root = q.from(Course.class);

        q.select(builder.countDistinct(root));

        List<Predicate> predicates = buildPredicates(params, builder, root);
        if (!predicates.isEmpty()) {
            q.where(builder.and(predicates.toArray(Predicate[]::new)));
        }

        Query<Long> query = session.createQuery(q);
        return query.getSingleResultOrNull();
    }

    private BigDecimal parsePrice(String price) {
        try {
            return new BigDecimal(price);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private Integer parseId(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    @Override
    public Course getCourseById(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Course> q = builder.createQuery(Course.class);

        Root<Course> root = q.from(Course.class);
        root.fetch("category", JoinType.INNER);
        root.fetch("teacher", JoinType.INNER);

        Fetch<Course, Chapter> chaptersFetch = root.fetch("chapters", JoinType.LEFT);
        Fetch<Chapter, Lesson> lessonFetch = chaptersFetch.fetch("lessons", JoinType.LEFT);

        q.select(root).where(builder.equal(root.get("id"), courseId));
        return session.createQuery(q).getSingleResultOrNull();
    }

    @Override
    public boolean existCourse(int courseId) {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery("SELECT 1 FROM Course c WHERE c.id = :courseId", Integer.class)
                        .setParameter("courseId", courseId)
                        .setMaxResults(1)
                        .getSingleResultOrNull()
                != null;
    }

    @Override
    public Course createOrUpdate(Course course) {
        Session session = factory.getObject().getCurrentSession();
        if (course.getId() == null) {
            session.persist(course);
            return course;
        }
        return session.merge(course);
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
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> q = builder.createQuery(Object[].class);

        Root<Course> root = q.from(Course.class);
        root.fetch("category", JoinType.INNER);
        root.fetch("teacher", JoinType.INNER);

        Join<Course, Enrollment> enrollmentJoin = root.join("enrollments", JoinType.INNER);

        Subquery<Long> chapterCountSubquery = q.subquery(Long.class);
        Root<Chapter> chapterRoot = chapterCountSubquery.from(Chapter.class);
        chapterCountSubquery
                .select(builder.count(chapterRoot))
                .where(builder.equal(chapterRoot.get("course"), root));

        Subquery<Long> lessonCountSubquery = q.subquery(Long.class);
        Root<Lesson> lessonRoot = lessonCountSubquery.from(Lesson.class);
        Join<Lesson, Chapter> lessonJoin = lessonRoot.join("chapter");
        lessonCountSubquery
                .select(builder.count(lessonRoot))
                .where(builder.equal(lessonJoin.get("course"), root));

        Subquery<Long> completedLessonCount = q.subquery(Long.class);
        Root<LessonProgress> progressRoot = completedLessonCount.from(LessonProgress.class);
        completedLessonCount
                .select(builder.count(progressRoot))
                .where(builder.and(
                        builder.equal(progressRoot.get("enrollment"), enrollmentJoin),
                        builder.equal(progressRoot.get("completed"), true)));

        q.multiselect(
                        root,
                        chapterCountSubquery.getSelection(),
                        lessonCountSubquery.getSelection(),
                        completedLessonCount.getSelection())
                .where(builder.equal(enrollmentJoin.get("student").get("id"), studentId));

        q.orderBy(builder.desc(enrollmentJoin.get("createdAt")));

        return session.createQuery(q).getResultList();
    }
}
