package com.nova.backend.nova.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nova")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class NovaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int novaId;
    @Column(nullable = false)
    private int userId;
    @Column(nullable = false, unique = true)
    private String novaSerialNumber;
    @Column(nullable = false)
    private String status;

    public NovaEntity(int userId, String novaSerialNumber, String status) {
        this.userId = userId;
        this.novaSerialNumber = novaSerialNumber;
        this.status = status;
    }
}
