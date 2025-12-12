package com.nova.backend.nova.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NovaResponseDTO {
    private int novaId;
    private int userId;
    private String novaSerialNumber;
    private String status;
}
