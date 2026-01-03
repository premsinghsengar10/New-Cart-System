package com.example.scanbill.controller;

import com.example.scanbill.model.Order;
import com.example.scanbill.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/receipts")
@RequiredArgsConstructor
public class ReceiptController {

    private final OrderRepository orderRepository;

    /**
     * Get receipt data for an order
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<Map<String, Object>> getReceipt(@PathVariable String orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order order = orderOpt.get();

        Map<String, Object> receipt = new HashMap<>();
        receipt.put("orderId", order.getId());
        receipt.put("customerName", order.getCustomerName());
        receipt.put("customerMobile", order.getCustomerMobile());
        receipt.put("items", order.getItems());
        receipt.put("subtotal", order.getSubtotal());
        receipt.put("taxAmount", order.getTaxAmount());
        receipt.put("discountAmount", order.getDiscountAmount());
        receipt.put("totalAmount", order.getTotalAmount());
        receipt.put("paymentMethod", order.getPaymentMethod());
        receipt.put("paymentStatus", order.getPaymentStatus());
        receipt.put("paymentId", order.getPaymentId());
        receipt.put("timestamp", order.getTimestamp());
        receipt.put("status", order.getStatus());
        receipt.put("receiptUrl", order.getReceiptUrl());

        return ResponseEntity.ok(receipt);
    }
}
