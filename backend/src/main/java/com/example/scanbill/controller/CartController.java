package com.example.scanbill.controller;

import com.example.scanbill.model.Cart;
import com.example.scanbill.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable String userId, @RequestParam String storeId) {
        return cartService.getCartByUserId(userId, storeId);
    }

    @PostMapping("/{userId}/add")
    public Cart addToCart(@PathVariable String userId, @RequestParam String serialNumber,
            @RequestParam String storeId) {
        return cartService.addToCart(userId, serialNumber, storeId);
    }

    @DeleteMapping("/{userId}/remove")
    public Cart removeFromCart(@PathVariable String userId, @RequestParam String serialNumber,
            @RequestParam String storeId) {
        return cartService.removeFromCart(userId, serialNumber, storeId);
    }
}
