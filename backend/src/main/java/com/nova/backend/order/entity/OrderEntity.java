package com.nova.backend.order.entity;

import com.nova.backend.payment.entity.PaymentEntity;
import com.nova.backend.payment.entity.PaymentMethod;
import com.nova.backend.payment.entity.PaymentStatus;
import com.nova.backend.user.entity.UsersEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UsersEntity user;

    /* =========================
   결제 정보
   ========================= */
    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<PaymentEntity> payments = new ArrayList<>();


    private String deliveryAddress;
    private String phoneNumber;

    private int totalPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;// pending, processing, shipping, delivered, confirmed, cancelled, refund_requested, refunded

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;// pending, paid, failed, refunded

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;// kakaopay, tosspay

    @Column(nullable = true)
    private String trackingNumber;

    @Column(nullable = true)
    private String refundReason;

    @Column(nullable = true)
    private String failReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime estimatedDelivery;
    private LocalDateTime refundRequestedAt;
    private LocalDateTime paidAt;
    private LocalDateTime cancelledAt;
    private LocalDateTime refundedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemEntity> items = new ArrayList<>();

    // 엔티티 기본값
    @PrePersist
    protected void prePersist() {
        if (this.status == null) this.status = OrderStatus.PENDING;
        if (this.paymentStatus == null) this.paymentStatus = PaymentStatus.READY;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // items는 add/remove만 허용
    public void addItem(OrderItemEntity item) {
        if (item != null) {
            items.add(item);
            item.setOrder(this);
        }
    }

    public void removeItem(OrderItemEntity item) {
        if (item != null && items.contains(item)) {
            items.remove(item);
            item.setOrder(null);
        }
    }

    // 외부에서 리스트를 직접 수정 못하도록 읽기 전용 반환
    public List<OrderItemEntity> getItems() {
        return Collections.unmodifiableList(items);
    }

    // 총 금액 계산
    public void calculateTotalPrice() {
        this.totalPrice = items.stream()
                .mapToInt(i -> i.getPrice() * i.getQuantity())
                .sum();
    }



    /* =========================
       연관관계 편의 메서드
       ========================= */
    public void addPayment(PaymentEntity payment) {
        payments.add(payment);
        payment.setOrder(this);
    }

    /* =========================
   결제 상태 관련 비즈니스 메서드
   ========================= */

    /** 결제 완료 여부 */
    public boolean isPaid() {
        return this.paymentStatus == PaymentStatus.APPROVED;
    }

    /** 결제 완료 처리 */
    public void markPaid(com.nova.backend.payment.entity.PaymentMethod method) {
        this.paymentStatus = PaymentStatus.APPROVED;
        this.paymentMethod = method;
        this.paidAt = LocalDateTime.now();
        this.status = OrderStatus.PROCESSING;
    }

    /** 결제 실패 처리 */
    public void markPaymentFailed(String reason) {
        this.paymentStatus = PaymentStatus.FAILED;
        this.failReason = reason;
    }

    /** 결제 취소 처리 */
    public void markCanceled() {
        this.paymentStatus = PaymentStatus.FAILED;
        this.status = OrderStatus.CANCELLED;
        this.cancelledAt = LocalDateTime.now();
    }

    /* =========================
   결제 표시용 정보
   ========================= */

    /** 카카오페이 item_name 용 */
    public String getOrderName() {
        if (items.isEmpty()) {
            return "상품";
        }

        OrderItemEntity first = items.get(0);

        if (items.size() == 1) {
            return first.getName();
        }

        return first.getName() + " 외 " + (items.size() - 1) + "건";
    }

    /** 총 상품 수량 */
    public int getTotalQuantity() {
        return items.stream()
                .mapToInt(OrderItemEntity::getQuantity)
                .sum();
    }


}