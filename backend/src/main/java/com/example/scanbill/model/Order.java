package com.example.scanbill.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String userId;
    private List<CartItem> items;
    private double totalAmount;
    private double subtotal;
    private double taxAmount;
    private double discountAmount;
    private String status; // PENDING, PAID, FAILED
    private LocalDateTime timestamp;
    private String customerName;
    private String customerMobile;
    private String customerEmail;
    private String storeId;
    private String idempotencyKey;

    // Payment fields
    private String paymentId;
    private String paymentMethod; // RAZORPAY, CASH, CARD
    private String paymentStatus; // INITIATED, SUCCESS, FAILED

    // Receipt fields
    private String receiptUrl;
    private String receiptQrCode;

    @Version
    private Long version;
}
