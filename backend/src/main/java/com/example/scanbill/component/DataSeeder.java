package com.example.scanbill.component;

import com.example.scanbill.model.InventoryItem;
import com.example.scanbill.model.Product;
import com.example.scanbill.repository.InventoryItemRepository;
import com.example.scanbill.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
        private final ProductRepository productRepository;
        private final InventoryItemRepository inventoryItemRepository;

        public DataSeeder(ProductRepository productRepository, InventoryItemRepository inventoryItemRepository) {
                this.productRepository = productRepository;
                this.inventoryItemRepository = inventoryItemRepository;
        }

        @Override
        public void run(String... args) throws Exception {
                System.out.println("Starting Massive DataSeeder...");
                try {
                        productRepository.deleteAll();
                        inventoryItemRepository.deleteAll();

                        List<Product> products = Arrays.asList(
                                        new Product(null, "101", "Java Programming Guide", 45.00, "Books",
                                                        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400"),
                                        new Product(null, "102", "Python for Data Science", 55.00, "Books",
                                                        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400"),
                                        new Product(null, "103", "Cotton Slim Fit T-Shirt", 25.00, "Apparel",
                                                        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"),
                                        new Product(null, "104", "Premium Leather Wallet", 35.00, "Accessories",
                                                        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400"),
                                        new Product(null, "105", "Noise Cancelling Headphones", 120.00, "Electronics",
                                                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"),
                                        new Product(null, "106", "Smart LED Desk Lamp", 40.00, "Home",
                                                        "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=400"),
                                        new Product(null, "107", "Stainless Steel Water Bottle", 15.00, "Accessories",
                                                        "https://images.unsplash.com/photo-1602143399827-bd9aa9673b56?w=400"),
                                        new Product(null, "108", "Mechanical Keyboard", 85.00, "Electronics",
                                                        "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400"),
                                        new Product(null, "109", "Matte Black Fountain Pen", 12.00, "Stationery",
                                                        "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400"),
                                        new Product(null, "110", "Dotted Journal (A5)", 8.00, "Stationery",
                                                        "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400"));

                        productRepository.saveAll(products);

                        List<InventoryItem> inventoryItems = new ArrayList<>();
                        for (Product p : products) {
                                // Generate 6 unique units for each product (Total 60 items)
                                for (int i = 1; i <= 6; i++) {
                                        String serial = p.getBarcode() + "-" + String.format("%03d", i);
                                        inventoryItems.add(
                                                        new InventoryItem(null, p.getBarcode(), serial, "AVAILABLE"));
                                }
                        }

                        inventoryItemRepository.saveAll(inventoryItems);
                        System.out.println("Seeded 10 products and 60 unique inventory items.");
                } catch (Exception e) {
                        System.err.println("Error during seeding: " + e.getMessage());
                }
        }
}
