package com.example.scanbill.controller;

import com.example.scanbill.model.InventoryItem;
import com.example.scanbill.model.Product;
import com.example.scanbill.repository.ProductRepository;
import com.example.scanbill.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductRepository productRepository;
    private final CartService cartService;

    @GetMapping
    public List<Product> getAllProducts(@RequestParam String storeId) {
        return productRepository.findByStoreId(storeId);
    }

    @GetMapping("/{barcode}")
    public Product getProduct(@PathVariable String barcode) {
        return productRepository.findByBarcode(barcode).orElseThrow();
    }

    @GetMapping("/{barcode}/units")
    public List<InventoryItem> getAvailableUnits(@PathVariable String barcode, @RequestParam String storeId) {
        return cartService.getAvailableUnits(barcode, storeId);
    }
}
