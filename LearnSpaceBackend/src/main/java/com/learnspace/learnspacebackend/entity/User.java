package com.learnspace.learnspacebackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Size(max = 255)
    private String username;

    @NotNull
    @Size(max = 255)
    private String password;

    @NotNull
    @ColumnDefault("'STUDENT'")
    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.STUDENT;

    @Size(max = 255)
    @NotNull
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Size(max = 255)
    @NotNull
    private String email;

    @Size(max = 255)
    @ColumnDefault(
            "'https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png'")
    private String avatar =
            "https://res.cloudinary.com/dsc8rzpbg/image/upload/v1779015408/user_c0b6wf.png";

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    Set<Enrollment> enrollments;

    @ColumnDefault("false")
    private Boolean verified = false;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
