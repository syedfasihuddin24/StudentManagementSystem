package com.sms.service;

import com.sms.entity.Student;
import com.sms.repository.AttendanceRepository;
import com.sms.repository.GradeRepository;
import com.sms.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;
    private final AttendanceRepository attendanceRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public Student createStudent(Student student) {
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (studentRepository.existsByRollNumber(student.getRollNumber())) {
            throw new RuntimeException("Roll number already exists");
        }
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = getStudentById(id);
        student.setName(studentDetails.getName());
        student.setEmail(studentDetails.getEmail());
        student.setRollNumber(studentDetails.getRollNumber());
        student.setDepartment(studentDetails.getDepartment());
        student.setYear(studentDetails.getYear());
        student.setDateOfBirth(studentDetails.getDateOfBirth());
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        gradeRepository.findByStudentId(id).forEach(grade -> gradeRepository.delete(grade));
        attendanceRepository.findByStudentId(id).forEach(attendance -> attendanceRepository.delete(attendance));
        studentRepository.deleteById(id);
    }
}