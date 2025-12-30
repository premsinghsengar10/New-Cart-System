package com.example.scanbill.service;

import com.example.scanbill.model.Cart;
import com.example.scanbill.model.CartItem;
import com.example.scanbill.model.InventoryItem;
import com.example.scanbill.model.Product;
import com.example.scanbill.repository.CartRepository;
import com.example.scanbill.repository.InventoryItemRepository;
import com.example.scanbill.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final InventoryItemRepository inventoryItemRepository;

    public Cart getCartByUserId(String userId, String storeId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUserId(userId);
            newCart.setStoreId(storeId);
            newCart.setItems(new ArrayList<>());
            return cartRepository.save(newCart);
        });
    }

    public Cart addToCart(String userId, String serialNumber, String storeId) {
        Cart cart = getCartByUserId(userId, storeId);

        // Check if item already in cart
        if (cart.getItems().stream().anyMatch(item -> item.getSerialNumber().equals(serialNumber))) {
            throw new RuntimeException("Item already in cart");
        }

        InventoryItem invItem = inventoryItemRepository.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new RuntimeException("Unique item not found"));

        if (!"AVAILABLE".equals(invItem.getStatus())) {
            throw new RuntimeException("Item is not available");
        }

        Product product = productRepository.findByBarcode(invItem.getBarcode())
                .orElseThrow(() -> new RuntimeException("Product associated with item not found"));

        CartItem newItem = new CartItem(product.getId(), product.getName(), product.getPrice(), 1, serialNumber);
        cart.getItems().add(newItem);

        calculateTotal(cart);
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(String userId, String serialNumber, String storeId) {
        Cart cart = getCartByUserId(userId, storeId);
        cart.getItems().removeIf(item -> item.getSerialNumber().equals(serialNumber));
        calculateTotal(cart);
        return cartRepository.save(cart);
    }

    private void calculateTotal(Cart cart) {
        double total = cart.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        cart.setTotalAmount(total);
    }

    public List<InventoryItem> getAvailableUnits(String barcode, String storeId) {
        return inventoryItemRepository.findByBarcodeAndStatusAndStoreId(barcode, "AVAILABLE", storeId);
    }
}
