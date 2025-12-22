package com.nova.backend.market.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.List;


@Getter
@Setter
@NoArgsConstructor
public class AdminProductUpdateRequest {
    private String name;
    private int price;
    private int stock;
    private String description;
    private List<String> specs;
}