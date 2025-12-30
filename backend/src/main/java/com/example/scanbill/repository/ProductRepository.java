package com.example.scanbill.repository;

import com.example.scanbill.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    Optional<Product> findByBarcode(String barcode);

    List<Product> findByStoreId(String storeId);
}
