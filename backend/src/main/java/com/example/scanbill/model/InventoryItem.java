package com.example.scanbill.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "inventory_items")
public class InventoryItem {
    @Id
    private String id;
    private String barcode;
    private String serialNumber;
    private String status; // AVAILABLE, SOLD
    private String storeId;

    @Version
    private Long version;
}
