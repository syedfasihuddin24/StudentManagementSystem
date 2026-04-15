package com.sms;

import com.sms.entity.User;
import com.sms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@sms.com")) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@sms.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
            System.out.println("✅ Admin account created: admin@sms.com / admin123");
        } else {
            System.out.println("✅ Admin account already exists.");
        }
    }
}
