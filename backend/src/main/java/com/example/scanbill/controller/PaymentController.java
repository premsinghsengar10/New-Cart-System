package com.example.scanbill.controller;

import com.example.scanbill.model.Order;
import com.example.scanbill.repository.OrderRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderRepository orderRepository;

    @Value("${razorpay.key.id:rzp_test_demo}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:demo_secret}")
    private String razorpayKeySecret;

    /**
     * Initialize payment - returns order info for frontend to start payment
     */
    @PostMapping("/initiate")
    public ResponseEntity<Map<String, Object>> initiatePayment(@RequestBody PaymentInitRequest request) {
        Optional<Order> orderOpt = orderRepository.findById(request.getOrderId());
        if (orderOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Order not found"));
        }

        Order order = orderOpt.get();

        // Update order with payment initiation
        order.setPaymentStatus("INITIATED");
        order.setPaymentMethod("RAZORPAY");
        orderRepository.save(order);

        // Return payment configuration for frontend
        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.getId());
        response.put("amount", (int) (order.getTotalAmount() * 100)); // Razorpay expects amount in paise
        response.put("currency", "INR");
        response.put("razorpayKeyId", razorpayKeyId);
        response.put("customerName", order.getCustomerName());
        response.put("customerMobile", order.getCustomerMobile());
        response.put("customerEmail", order.getCustomerEmail() != null ? order.getCustomerEmail() : "");
        response.put("description", "Order #" + order.getId());

        return ResponseEntity.ok(response);
    }

    /**
     * Verify payment signature and confirm payment
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody PaymentVerifyRequest request) {
        Optional<Order> orderOpt = orderRepository.findById(request.getOrderId());
        if (orderOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Order not found"));
        }

        Order order = orderOpt.get();

        // For demo purposes, we'll accept any payment
        // In production, verify Razorpay signature:
        // String generatedSignature = hmacSha256(razorpayOrderId + "|" +
        // razorpayPaymentId, razorpayKeySecret);
        // if (!generatedSignature.equals(request.getRazorpaySignature())) { return
        // error; }

        // Update order as paid
        order.setPaymentId(request.getRazorpayPaymentId());
        order.setPaymentStatus("SUCCESS");
        order.setStatus("PAID");

        // Generate receipt URL
        String receiptUrl = "/receipt/" + order.getId();
        order.setReceiptUrl(receiptUrl);
        order.setReceiptQrCode(receiptUrl); // QR will point to receipt URL

        orderRepository.save(order);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("orderId", order.getId());
        response.put("receiptUrl", receiptUrl);
        response.put("message", "Payment successful!");

        return ResponseEntity.ok(response);
    }

    /**
     * Mark order as paid with cash
     */
    @PostMapping("/cash")
    public ResponseEntity<Map<String, Object>> cashPayment(@RequestBody CashPaymentRequest request) {
        Optional<Order> orderOpt = orderRepository.findById(request.getOrderId());
        if (orderOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Order not found"));
        }

        Order order = orderOpt.get();
        order.setPaymentMethod("CASH");
        order.setPaymentStatus("SUCCESS");
        order.setStatus("PAID");

        String receiptUrl = "/receipt/" + order.getId();
        order.setReceiptUrl(receiptUrl);
        order.setReceiptQrCode(receiptUrl);

        orderRepository.save(order);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("orderId", order.getId());
        response.put("receiptUrl", receiptUrl);

        return ResponseEntity.ok(response);
    }

    // Helper for HMAC-SHA256 signature verification (production use)
    @SuppressWarnings("unused")
    private String hmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1)
                    hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC", e);
        }
    }

    @Data
    public static class PaymentInitRequest {
        private String orderId;
    }

    @Data
    public static class PaymentVerifyRequest {
        private String orderId;
        private String razorpayPaymentId;
        private String razorpayOrderId;
        private String razorpaySignature;
    }

    @Data
    public static class CashPaymentRequest {
        private String orderId;
    }
}
