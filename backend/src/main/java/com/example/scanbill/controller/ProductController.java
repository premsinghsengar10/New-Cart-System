package com.example.scanbill.controller;

import com.example.scanbill.model.InventoryItem;
import com.example.scanbill.model.Product;
import com.example.scanbill.repository.ProductRepository;
import com.example.scanbill.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final com.example.scanbill.service.ProductService productService;

    public ProductController(ProductRepository productRepository, CartService cartService,
            com.example.scanbill.service.ProductService productService) {
        this.productRepository = productRepository;
        this.cartService = cartService;
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts(@RequestParam String storeId) {
        return productRepository.findByStoreId(storeId);
    }

    @PostMapping
    public Product createProduct(@RequestBody ProductRequest request) {
        Product product = new Product();
        product.setBarcode(request.getBarcode());
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setBasePrice(request.getBasePrice());
        product.setStoreId(request.getStoreId());

        return productService.addProductWithStock(product, request.getInitialStock());
    }

    @GetMapping("/{barcode}")
    public Product getProduct(@PathVariable String barcode) {
        return productRepository.findByBarcode(barcode).orElseThrow();
    }

    @GetMapping("/{barcode}/units")
    public List<InventoryItem> getAvailableUnits(@PathVariable String barcode, @RequestParam String storeId) {
        return cartService.getAvailableUnits(barcode, storeId);
    }

    @lombok.Data
    public static class ProductRequest {
        private String barcode;
        private String name;
        private double price;
        private String category;
        private String imageUrl;
        private double basePrice;
        private String storeId;
        private int initialStock;
    }
}
