package com.sms.controller;

import com.sms.entity.Attendance;
import com.sms.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getAttendanceByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudent(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Attendance>> getAttendanceByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByCourse(courseId));
    }

    @GetMapping("/percentage/{studentId}/{courseId}")
    public ResponseEntity<Double> getAttendancePercentage(@PathVariable Long studentId, @PathVariable Long courseId) {
        return ResponseEntity.ok(attendanceService.getAttendancePercentage(studentId, courseId));
    }

    @PostMapping
    public ResponseEntity<?> markAttendance(@RequestBody Attendance attendance) {
        try {
            return ResponseEntity.ok(attendanceService.markAttendance(attendance));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok("Attendance deleted successfully");
    }
}