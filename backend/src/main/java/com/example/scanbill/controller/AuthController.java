package com.example.scanbill.controller;

import com.example.scanbill.model.Store;
import com.example.scanbill.model.User;
import com.example.scanbill.service.AuthService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register-store")
    public ResponseEntity<?> registerStore(@RequestBody StoreRegistrationRequest request) {
        System.out.println("Received registration request for: " + request.getStoreName());
        try {
            Store store = authService.registerStore(
                    request.getStoreName(),
                    request.getLocation(),
                    request.getAdminUsername(),
                    request.getAdminPassword());
            System.out.println("Store registered successfully: " + store.getId());
            return ResponseEntity.ok(store);
        } catch (Exception e) {
            System.err.println("Registration failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth Service is Reachable");
    }

    @GetMapping("/stores")
    public ResponseEntity<?> getAllStores() {
        try {
            return ResponseEntity.ok(authService.getAllStores());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/bootstrap-super-admin")
    public ResponseEntity<?> bootstrap(@RequestBody LoginRequest request) {
        try {
            User user = authService.registerSuperAdmin(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class StoreRegistrationRequest {
        private String storeName;
        private String location;
        private String adminUsername;
        private String adminPassword;
    }
}
