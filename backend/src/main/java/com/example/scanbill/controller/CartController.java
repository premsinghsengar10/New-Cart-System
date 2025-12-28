package com.example.scanbill.controller;

import com.example.scanbill.model.Cart;
import com.example.scanbill.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {
    private final CartService cartService;

    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable String userId) {
        return cartService.getCartByUserId(userId);
    }

    @PostMapping("/{userId}/add")
    public Cart addToCart(@PathVariable String userId, @RequestParam String serialNumber) {
        return cartService.addToCart(userId, serialNumber);
    }

    @DeleteMapping("/{userId}/remove")
    public Cart removeFromCart(@PathVariable String userId, @RequestParam String serialNumber) {
        return cartService.removeFromCart(userId, serialNumber);
    }
}
