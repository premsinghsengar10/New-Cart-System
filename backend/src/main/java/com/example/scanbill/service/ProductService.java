package com.example.scanbill.service;

import com.example.scanbill.model.Product;
import com.example.scanbill.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    private final com.example.scanbill.repository.InventoryItemRepository inventoryItemRepository;

    public Optional<Product> getProductByBarcode(String barcode) {
        return productRepository.findByBarcode(barcode);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByStoreId(String storeId) {
        return productRepository.findByStoreId(storeId);
    }

    public Product addProductWithStock(Product product, int initialStock) {
        Product savedProduct = productRepository.save(product);

        // Generate initial inventory items (units)
        List<com.example.scanbill.model.InventoryItem> items = new java.util.ArrayList<>();
        for (int i = 1; i <= initialStock; i++) {
            String serial = savedProduct.getBarcode() + "-" + String.format("%03d", i);
            items.add(new com.example.scanbill.model.InventoryItem(null, savedProduct.getBarcode(), serial, "AVAILABLE",
                    savedProduct.getStoreId(), null));
        }
        inventoryItemRepository.saveAll(items);

        return savedProduct;
    }
}
