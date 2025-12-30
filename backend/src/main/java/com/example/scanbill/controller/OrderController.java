package com.example.scanbill.controller;

import com.example.scanbill.model.Cart;
import com.example.scanbill.model.CartItem;
import com.example.scanbill.model.InventoryItem;
import com.example.scanbill.model.Order;
import com.example.scanbill.repository.CartRepository;
import com.example.scanbill.repository.InventoryItemRepository;
import com.example.scanbill.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final InventoryItemRepository inventoryItemRepository;

    public OrderController(OrderRepository orderRepository, CartRepository cartRepository,
            InventoryItemRepository inventoryItemRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.inventoryItemRepository = inventoryItemRepository;
    }

    @GetMapping
    public List<Order> getAllOrders(@RequestParam String storeId) {
        return orderRepository.findByStoreId(storeId);
    }

    @PostMapping("/checkout/{userId}")
    public Order checkout(@PathVariable String userId, @RequestParam String customerName,
            @RequestParam String customerMobile, @RequestParam String storeId) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow();

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Mark items as SOLD
        for (CartItem item : cart.getItems()) {
            InventoryItem invItem = inventoryItemRepository.findBySerialNumber(item.getSerialNumber())
                    .orElseThrow(() -> new RuntimeException("Item not found: " + item.getSerialNumber()));

            if (!"AVAILABLE".equals(invItem.getStatus())) {
                throw new RuntimeException("Item already sold: " + item.getSerialNumber());
            }

            invItem.setStatus("SOLD");
            inventoryItemRepository.save(invItem);
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setItems(new ArrayList<>(cart.getItems()));
        order.setTotalAmount(cart.getTotalAmount());
        order.setStatus("PAID");
        order.setTimestamp(LocalDateTime.now());
        order.setCustomerName(customerName);
        order.setCustomerMobile(customerMobile);
        order.setStoreId(storeId);

        Order savedOrder = orderRepository.save(order);

        // Clear cart
        cart.getItems().clear();
        cart.setTotalAmount(0);
        cartRepository.save(cart);

        return savedOrder;
    }
}
