package com.sms.service;

import com.sms.entity.Attendance;
import com.sms.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public List<Attendance> getAttendanceByCourse(Long courseId) {
        return attendanceRepository.findByCourseId(courseId);
    }

    public Attendance markAttendance(Attendance attendance) {
        List<Attendance> existing = attendanceRepository.findByStudentIdAndCourseId(
            attendance.getStudent().getId(), attendance.getCourse().getId());
        boolean alreadyMarked = existing.stream()
            .anyMatch(a -> a.getDate().equals(attendance.getDate()));
        if (alreadyMarked) {
            throw new RuntimeException("Attendance already marked for this student, course and date!");
        }
        return attendanceRepository.save(attendance);
    }

    public double getAttendancePercentage(Long studentId, Long courseId) {
        Long total = attendanceRepository.countTotalByStudentAndCourse(studentId, courseId);
        Long present = attendanceRepository.countPresentByStudentAndCourse(studentId, courseId);
        if (total == 0) return 0;
        return (present * 100.0) / total;
    }

    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }
}