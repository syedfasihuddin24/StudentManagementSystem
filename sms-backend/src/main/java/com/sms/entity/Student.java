package com.sms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String rollNumber;

    @Column(nullable = false, unique = true)
    private String email;

    private LocalDate dateOfBirth;

    private String department;

    private Integer year;

    private String photoUrl;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}