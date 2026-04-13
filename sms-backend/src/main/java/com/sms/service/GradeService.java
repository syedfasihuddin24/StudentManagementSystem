package com.sms.service;

import com.sms.entity.Grade;
import com.sms.repository.GradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GradeService {

    private final GradeRepository gradeRepository;

    public List<Grade> getAllGrades() {
        return gradeRepository.findAll();
    }

    public List<Grade> getGradesByStudent(Long studentId) {
        return gradeRepository.findByStudentId(studentId);
    }

    public List<Grade> getGradesByCourse(Long courseId) {
        return gradeRepository.findByCourseId(courseId);
    }

    public Grade saveGrade(Grade grade) {
        List<Grade> existing = gradeRepository.findByStudentIdAndCourseId(
            grade.getStudent().getId(), grade.getCourse().getId());
        if (!existing.isEmpty()) {
            throw new RuntimeException("Grade already exists for this student and course!");
        }

        double marks = grade.getMarks();
        String letterGrade;
        double gpa;

        if (marks >= 90) { letterGrade = "A+"; gpa = 4.0; }
        else if (marks >= 80) { letterGrade = "A"; gpa = 4.0; }
        else if (marks >= 70) { letterGrade = "B"; gpa = 3.0; }
        else if (marks >= 60) { letterGrade = "C"; gpa = 2.0; }
        else if (marks >= 50) { letterGrade = "D"; gpa = 1.0; }
        else { letterGrade = "F"; gpa = 0.0; }

        grade.setGrade(letterGrade);
        grade.setGpa(gpa);
        grade.setPassed(marks >= 50);

        return gradeRepository.save(grade);
    }

    public void deleteGrade(Long id) {
        gradeRepository.deleteById(id);
    }
}