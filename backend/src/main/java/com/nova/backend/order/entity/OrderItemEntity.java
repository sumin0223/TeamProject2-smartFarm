package com.nova.backend.order.entity;

import com.nova.backend.cart.entity.CartItemEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = true)
    private String image;

    @Column(nullable = true)
    private String category;

    @Column(nullable = true)
    private String description;

    // 양방향 연관관계 설정
    public void setOrder(OrderEntity order) {
        this.order = order;
    }

    // 수량 변경만 허용
    public void updateQuantity(int quantity) {
        if (quantity > 0) {
            this.quantity = quantity;
        }
    }

    // CartItemEntity → OrderItemEntity 변환
    public static OrderItemEntity fromCartItem(CartItemEntity cartItem) {
        var product = cartItem.getProduct();
        return OrderItemEntity.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .quantity(cartItem.getQuantity())
                .image(product.getImageUrl())
                .category(product.getCategory().name())
                .description(product.getDescription())
                .build();
    }
}








