package com.example.scanbill.repository;

import com.example.scanbill.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByStoreId(String storeId);

    java.util.Optional<Order> findByIdempotencyKey(String idempotencyKey);
}
