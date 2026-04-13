package com.sms.service;

import com.sms.entity.Student;
import com.sms.entity.User;
import com.sms.repository.StudentRepository;
import com.sms.repository.UserRepository;
import com.sms.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public String login(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return jwtUtils.generateToken(email, user.getRole().name());
    }

    public User register(String name, String email, String password, User.Role role,
                         String rollNumber, String department, Integer year) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        User savedUser = userRepository.save(user);

        if (role == User.Role.STUDENT) {
            if (rollNumber != null && !rollNumber.isEmpty()) {
                if (studentRepository.existsByRollNumber(rollNumber)) {
                    throw new RuntimeException("Roll number already exists");
                }
            }
            Student student = new Student();
            student.setName(name);
            student.setEmail(email);
            student.setRollNumber(rollNumber);
            student.setDepartment(department);
            student.setYear(year);
            student.setUser(savedUser);
            studentRepository.save(student);
        }

        return savedUser;
    }
}