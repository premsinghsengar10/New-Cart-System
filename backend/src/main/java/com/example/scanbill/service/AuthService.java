package com.example.scanbill.service;

import com.example.scanbill.model.Role;
import com.example.scanbill.model.Store;
import com.example.scanbill.model.User;
import com.example.scanbill.repository.StoreRepository;
import com.example.scanbill.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;

    public AuthService(UserRepository userRepository, StoreRepository storeRepository) {
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
    }

    public Store registerStore(String storeName, String location, String adminUsername, String adminPassword) {
        // 0. Database Readiness Check
        try {
            storeRepository.count();
            userRepository.count();
        } catch (Exception e) {
            throw new RuntimeException("Database Connection Error: Cannot reach MongoDB. Ensure mongod is running.");
        }

        // 1. Create Store
        Store store = new Store();
        store.setName(storeName);
        store.setLocation(location);
        Store savedStore = storeRepository.save(store);

        // 2. Create Store Admin
        User admin = new User();
        admin.setUsername(adminUsername);
        admin.setPassword(adminPassword); // In production, use BCrypt
        admin.setRole(Role.ADMIN);
        admin.setStoreId(savedStore.getId());
        userRepository.save(admin);

        return savedStore;
    }

    public User login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }

    public User registerSuperAdmin(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Super Admin already exists");
        }
        User superAdmin = new User();
        superAdmin.setUsername(username);
        superAdmin.setPassword(password);
        superAdmin.setRole(Role.SUPER_ADMIN);
        return userRepository.save(superAdmin);
    }

    public java.util.List<Store> getAllStores() {
        return storeRepository.findAll();
    }
}
