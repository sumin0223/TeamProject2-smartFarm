package com.nova.backend.order.entity;

import com.nova.backend.user.entity.UsersEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_notifications")
@AllArgsConstructor
@NoArgsConstructor
public class OrderNotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UsersEntity user;

    @Enumerated(EnumType.STRING)
    private OrderNotificationType eventType;
    // PAYMENT_COMPLETED, SHIPPING_STARTED, DELIVERED, REFUNDED ...

    private String contentKo;
    private String contentEn;

    private String resourceUrl;

    private boolean isRead = false;
    private LocalDateTime readAt;

    private LocalDateTime createdAt;

    @PrePersist
    protected void prePersist() {
        this.createdAt = LocalDateTime.now(); // UTC 기준
    }
}

