package com.sms.repository;

import com.sms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByDepartment(String department);
    List<Course> findByTeacherId(Long teacherId);
    Boolean existsByCode(String code);
}