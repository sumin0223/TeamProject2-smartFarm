package com.nova.backend.payment.entity;

import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.payment.entity.PaymentMethod;
import com.nova.backend.payment.entity.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "payments")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;   // ✅ Payment의 PK

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;   // ✅ FK

    @Enumerated(EnumType.STRING)
    private PaymentMethod method;

    private String tid;
    private int amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    public void approve(String tid) {
        this.tid = tid;
        this.status = PaymentStatus.APPROVED;
    }

    public void fail() {
        this.status = PaymentStatus.FAILED;
    }

    public void cancel() {
        this.status = PaymentStatus.CANCELED;
    }

    public void setOrder(OrderEntity order) {
        this.order = order;   // ✅ 필수
    }
}

