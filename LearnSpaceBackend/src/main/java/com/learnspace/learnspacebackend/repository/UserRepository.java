package com.learnspace.learnspacebackend.repository;

import com.learnspace.learnspacebackend.entity.User;
import com.learnspace.learnspacebackend.entity.UserRole;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository
        extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("SELECT e.student FROM Enrollment e WHERE e.course.teacher.id = :teacherId")
    List<User> findStudentsByTeacherId(@Param("teacherId") int teacherId);

    @Query("SELECT e.course.teacher FROM Enrollment e WHERE e.student.id = :studentId")
    List<User> findTeachersByStudentId(@Param("studentId") int studentId);

    default List<User> getContactsEnrolled(int userId, UserRole role) {
        if (role == UserRole.STUDENT) {
            return findTeachersByStudentId(userId);
        }
        if (role == UserRole.TEACHER) {
            return findStudentsByTeacherId(userId);
        }
        return Collections.emptyList();
    }
}
