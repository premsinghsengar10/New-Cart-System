package com.example.scanbill.repository;

import com.example.scanbill.model.InventoryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface InventoryItemRepository extends MongoRepository<InventoryItem, String> {
    Optional<InventoryItem> findBySerialNumber(String serialNumber);

    List<InventoryItem> findByBarcodeAndStatusAndStoreId(String barcode, String status, String storeId);
}
