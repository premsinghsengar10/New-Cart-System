package com.example.scanbill.controller;

import com.example.scanbill.model.Order;
import com.example.scanbill.repository.OrderRepository;
import com.example.scanbill.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    public OrderController(OrderRepository orderRepository, OrderService orderService) {
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getAllOrders(@RequestParam String storeId) {
        return orderRepository.findByStoreId(storeId);
    }

    @PostMapping("/checkout/{userId}")
    public Order checkout(
            @PathVariable String userId,
            @RequestParam String customerName,
            @RequestParam String customerMobile,
            @RequestParam String storeId,
            @RequestParam(required = false) String idempotencyKey) {
        return orderService.checkout(userId, customerName, customerMobile, storeId, idempotencyKey);
    }
}
