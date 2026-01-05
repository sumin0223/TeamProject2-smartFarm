package com.nova.backend.order.entity;

import com.nova.backend.market.entity.CartItemEntity;
import com.nova.backend.payment.entity.PaymentEntity;
import com.nova.backend.payment.entity.PaymentMethod;
import com.nova.backend.payment.entity.PaymentStatus;
import com.nova.backend.user.entity.UsersEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<OrderItemEntity> items = new ArrayList<>();

    @OneToOne(mappedBy = "order", fetch = FetchType.LAZY)
    private PaymentEntity payment;

    private String itemName;
    private String orderUid; // 주문 번호

    private String deliveryAddress;
    private String phoneNumber;
    private String recipientName;
    private String message;
    private String trackingNumber;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal orderTotalPrice = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;



    private String refundReason;
    private String failReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime refundRequestedAt;
    private LocalDateTime paidAt;
    private LocalDateTime cancelledAt;
    private LocalDateTime refundedAt;

    private LocalDateTime estimatedDelivery;

    /* =========================
       엔티티 기본값
       ========================= */
    @PrePersist
    protected void prePersist() {
        if (status == null) status = OrderStatus.PENDING;
        if (paymentStatus == null) paymentStatus = PaymentStatus.READY;
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /* ===== 각 아이템 가격 계산 ===== */
    public BigDecimal calculatePrice(OrderItemEntity item) {
        // price와 quantity를 BigDecimal로 안전하게 계산
        return item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
    }

    /* ===== 주문 전체 가격 계산 ===== */
    public void calculateTotalPrice() {
        orderTotalPrice = items.stream()
                .map(this::calculatePrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(0, RoundingMode.HALF_UP); // 원 단위로 반올림
    }

    public BigDecimal getOrderTotalPrice() {
        return orderTotalPrice;
    }

    /* =========================
       아이템 관리
       ========================= */
    public void addItem(OrderItemEntity item) {
        if (item != null) {
            items.add(item);
            item.setOrder(this);
            calculateTotalPrice();
        }
    }

    public void addItemFromCart(CartItemEntity cartItem) {
        if (cartItem != null) {
            OrderItemEntity item = OrderItemEntity.create(this, cartItem);
            items.add(item);
            calculateTotalPrice();
        }
    }

    public List<OrderItemEntity> getItems() {
        return Collections.unmodifiableList(items);
    }

//    public void calculateTotalPrice() {
//        orderTotalPrice = items.stream()
//                .map(OrderItemEntity::calculatePrice)
//                .reduce(BigDecimal.ZERO, BigDecimal::add);
//    }

    /* =========================
       결제 / 주문 상태
       ========================= */
    public boolean isPaid() {
        return paymentStatus == PaymentStatus.OK;
    }

    public void approvePayment(PaymentMethod method) {
        if (paymentStatus == PaymentStatus.OK) return; // 중복 승인 방지
        paymentStatus = PaymentStatus.OK;
        status = OrderStatus.PROCESSING;
        paymentMethod = method;
        paidAt = LocalDateTime.now();
    }

    public void failPayment(String reason) {
        if (paymentStatus == PaymentStatus.OK) return; // 결제 완료 덮어쓰기 방지
        paymentStatus = PaymentStatus.CANCELED;
        status = OrderStatus.CANCELLED;
        failReason = reason;
        cancelledAt = LocalDateTime.now();
    }

    public void cancel(String reason) {
        if (isPaid()) throw new IllegalStateException("결제 완료 주문은 취소 불가");
        status = OrderStatus.CANCELLED;
        failReason = reason;
        cancelledAt = LocalDateTime.now();
    }

    public void requestRefund(String reason) {
        refundReason = reason;
        status = OrderStatus.REFUND_REQUESTED;
        refundRequestedAt = LocalDateTime.now();
    }

    public void approveRefund() {
        status = OrderStatus.REFUNDED;
        paymentStatus = PaymentStatus.CANCELED;
        refundedAt = LocalDateTime.now();
    }

    /* =========================
       UI용 정보
       ========================= */
    public String getOrderName() {
        if (items.isEmpty()) return "상품";
        OrderItemEntity first = items.get(0);
        return items.size() == 1 ? first.getName() : first.getName() + " 외 " + (items.size() - 1) + "건";
    }

    public int getTotalQuantity() {
        return items.stream().mapToInt(OrderItemEntity::getQuantity).sum();
    }

    // 직접 OrderItem 추가 시 양방향 연관 설정
    public void addOrderItem(OrderItemEntity orderItem) {
        if (orderItem != null && !items.contains(orderItem)) {
            items.add(orderItem);
            orderItem.setOrder(this);
            calculateTotalPrice();
        }
    }


    /* =========================
       생성 팩토리
       ========================= */
    @Builder
    public OrderEntity(UsersEntity user, String deliveryAddress, String phoneNumber,String recipientName,String message, BigDecimal orderTotalPrice, String itemName, String orderUid) {
        this.user = user;
        this.deliveryAddress = deliveryAddress;
        this.phoneNumber = phoneNumber;
        this.recipientName=recipientName;
        this.message=message;
        this.status = OrderStatus.PENDING;
        this.paymentStatus = PaymentStatus.READY;
        this.orderTotalPrice = orderTotalPrice;
        this.itemName = itemName;
        this.orderUid = orderUid;
    }
}


//package com.nova.backend.order.entity;
//
//import com.nova.backend.market.entity.CartItemEntity;
//import com.nova.backend.payment.entity.PaymentMethod;
//import com.nova.backend.payment.entity.PaymentStatus;
//import com.nova.backend.user.entity.UsersEntity;
//import jakarta.persistence.*;
//import lombok.Builder;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.List;
//
//@Entity
//@Table(name = "orders")
//@Getter
//@Setter
//@NoArgsConstructor
//@Builder
//public class OrderEntity {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long orderId;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false)
//    private UsersEntity user;
//
//    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
//    private final List<OrderItemEntity> items = new ArrayList<>();
//
//    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
//    private final List<com.nova.backend.payment.entity.PaymentEntity> payments = new ArrayList<>();
//
//    private String deliveryAddress;
//    private String phoneNumber;
//    private String trackingNumber;
//
//    @Column(nullable = false, precision = 15, scale = 2)
//    private BigDecimal totalPrice = BigDecimal.ZERO;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private OrderStatus status;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private PaymentStatus paymentStatus;
//
//    @Enumerated(EnumType.STRING)
//    private PaymentMethod paymentMethod;
//
//    private String refundReason;
//    private String failReason;
//
//    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
//    private LocalDateTime estimatedDelivery;
//    private LocalDateTime refundRequestedAt;
//    private LocalDateTime paidAt;
//    private LocalDateTime cancelledAt;
//    private LocalDateTime refundedAt;
//
//    /* =========================
//       엔티티 기본값
//       ========================= */
//    @PrePersist
//    protected void prePersist() {
//        if (status == null) status = OrderStatus.PENDING;
//        if (paymentStatus == null) paymentStatus = PaymentStatus.READY;
//        createdAt = LocalDateTime.now();
//        updatedAt = LocalDateTime.now();
//    }
//
//    @PreUpdate
//    protected void preUpdate() {
//        updatedAt = LocalDateTime.now();
//    }
//
//    /* =========================
//       아이템 관리
//       ========================= */
//    public void addItem(OrderItemEntity item) {
//        if (item != null) {
//            items.add(item);
//            item.setOrder(this);
//            calculateTotalPrice();
//        }
//    }
//
//    public void addItemFromCart(CartItemEntity cartItem) {
//        if (cartItem != null) {
//            OrderItemEntity item = OrderItemEntity.create(this, cartItem);
//            items.add(item);
//            calculateTotalPrice();
//        }
//    }
//
//    public void removeItem(OrderItemEntity item) {
//        if (item != null && items.contains(item)) {
//            items.remove(item);
//            item.setOrder(null);
//            calculateTotalPrice();
//        }
//    }
//
//    public List<OrderItemEntity> getItems() {
//        return Collections.unmodifiableList(items);
//    }
//
//    /* =========================
//       총 금액 계산
//       ========================= */
//    public void calculateTotalPrice() {
//        totalPrice = items.stream()
//                .map(OrderItemEntity::calculatePrice)
//                .reduce(BigDecimal.ZERO, BigDecimal::add);
//    }
//
//    /* =========================
//       주문 상태 변경
//       ========================= */
//    public void cancel(String reason) {
//        if (isPaid()) {
//            throw new IllegalStateException("결제 완료 주문은 취소 불가");
//        }
//        status = OrderStatus.CANCELLED;
//        failReason = reason;
//        cancelledAt = LocalDateTime.now();
//    }
//
//    public boolean isPaid() {
//        return paymentStatus == PaymentStatus.APPROVED;
//    }
//
//    public void approvePayment(PaymentMethod method) {
//        if (paymentStatus == PaymentStatus.APPROVED) return; // 중복 승인 방지
//        paymentStatus = PaymentStatus.APPROVED;
//        status = OrderStatus.PROCESSING;
//        paymentMethod = method;
//        paidAt = LocalDateTime.now();
//    }
//
//    public void failPayment(String reason) {
//        if (paymentStatus == PaymentStatus.APPROVED) return; // 결제 성공 덮어쓰기 방지
//        paymentStatus = PaymentStatus.FAILED;
//        status = OrderStatus.CANCELLED;
//        failReason = reason;
//        cancelledAt = LocalDateTime.now();
//    }
//
//    public void requestRefund(String reason) {
//        refundReason = reason;
//        status = OrderStatus.REFUND_REQUESTED;
//        refundRequestedAt = LocalDateTime.now();
//    }
//
//    public void approveRefund() {
//        status = OrderStatus.REFUNDED;
//        paymentStatus = PaymentStatus.CANCELED;
//        refundedAt = LocalDateTime.now();
//    }
//
//    /* =========================
//       결제 연관관계
//       ========================= */
//    public void addPayment(com.nova.backend.payment.entity.PaymentEntity payment) {
//        payments.add(payment);
//        payment.setOrder(this);
//    }
//
//    /* =========================
//       결제 표시용 정보
//       ========================= */
//    public String getOrderName() {
//        if (items.isEmpty()) return "상품";
//        OrderItemEntity first = items.get(0);
//        return items.size() == 1 ? first.getName() : first.getName() + " 외 " + (items.size() - 1) + "건";
//    }
//
//    public int getTotalQuantity() {
//        return items.stream()
//                .mapToInt(OrderItemEntity::getQuantity)
//                .sum();
//    }
//
//    /* =========================
//       생성 팩토리
//       ========================= */
//    public static OrderEntity create(UsersEntity user, String deliveryAddress, String phoneNumber) {
//        OrderEntity order = new OrderEntity();
//        order.user = user;
//        order.deliveryAddress = deliveryAddress;
//        order.phoneNumber = phoneNumber;
//        order.status = OrderStatus.PENDING;
//        order.paymentStatus = PaymentStatus.READY;
//        return order;
//    }
//}


//package com.nova.backend.order.entity;
//
//import com.nova.backend.market.entity.CartItemEntity;
//import com.nova.backend.payment.entity.PaymentEntity;
//import com.nova.backend.payment.entity.PaymentMethod;
//import com.nova.backend.payment.entity.PaymentStatus;
//import com.nova.backend.user.entity.UsersEntity;
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.List;
//
//@Entity
//@Table(name = "orders")
//@Getter
//@Setter
//@NoArgsConstructor
//public class OrderEntity {
//
//    /* =========================
//       기본 식별 정보
//       ========================= */
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long orderId;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false)
//    private UsersEntity user;
//
//    /* =========================
//       주문 상품 정보
//       ========================= */
//    @OneToMany(
//            mappedBy = "order",
//            cascade = CascadeType.ALL,
//            orphanRemoval = true
//    )
//    private final List<OrderItemEntity> items = new ArrayList<>();
//
//    /* =========================
//       결제 이력 (pg사 통신기록 조회용)
//       ========================= */
//    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
//    private final List<PaymentEntity> payments = new ArrayList<>();
//
//    /* =========================
//       배송 정보
//       ========================= */
//    private String deliveryAddress;
//    private String phoneNumber;
//    private String trackingNumber;
//
//    /* =========================
//       금액
//       ========================= */
//    @Column(nullable = false, precision = 15, scale = 2)
//    private BigDecimal totalPrice = BigDecimal.ZERO;
//
//    /* =========================
//       주문 상태
//       ========================= */
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private OrderStatus status;// pending, processing, shipping, delivered, confirmed, cancelled, refund_requested, refunded
//
//    @Enumerated(EnumType.STRING)
//    private PaymentStatus paymentStatus;// pending, paid, failed, refunded
//
//    @Enumerated(EnumType.STRING)
//    private PaymentMethod paymentMethod;// kakaopay, tosspay
//
//    @Column(nullable = true)
//    private String refundReason;
//
//    @Column(nullable = true)
//    private String failReason;
//
//    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
//    private LocalDateTime estimatedDelivery;
//    private LocalDateTime refundRequestedAt;
//    private LocalDateTime paidAt;
//    private LocalDateTime cancelledAt;
//    private LocalDateTime refundedAt;
//
//    // 엔티티 기본값
//    @PrePersist
//    protected void prePersist() {
//        if (this.status == null) this.status = OrderStatus.PENDING;
//        if (this.paymentStatus == null) this.paymentStatus = PaymentStatus.READY;
//        this.createdAt = LocalDateTime.now();
//        this.updatedAt = LocalDateTime.now();
//    }
//
//    @PreUpdate
//    protected void preUpdate() {
//        this.updatedAt = LocalDateTime.now();
//    }
//
//
//
//    // 카트를 안거치고 바로주문시 items는 add/remove만 허용
//    public void addItem(OrderItemEntity item) {
//        if (item != null) {
//            items.add(item);
//            item.setOrder(this);
//        }
//    }
//
//    //Order는 Cart를 통해서만 Item을 저장
//    public void addItemFromCart(CartItemEntity cartItem) {
//        OrderItemEntity item = OrderItemEntity.create(this, cartItem);
//        items.add(item);
//    }
//
//    public void removeItem(OrderItemEntity item) {
//        if (item != null && items.contains(item)) {
//            items.remove(item);
//            item.setOrder(null);
//        }
//    }
//
//    // 외부에서 리스트를 직접 수정 못하도록 읽기 전용 반환
//    public List<OrderItemEntity> getItems() {
//        return Collections.unmodifiableList(items);
//    }
//
//    // 주문 총 금액 계산
//    public void calculateTotalPrice() {
//        this.totalPrice = items.stream()
//                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
//                .reduce(BigDecimal.ZERO, BigDecimal::add);
//    }
//
//
//    // 주문 총 금액 계산후 반환
//    public BigDecimal getTotalPrice() {
//        return items.stream()
//                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
//                .reduce(BigDecimal.ZERO, BigDecimal::add);
//    }
//
//    public void cancel(String reason) {
//        if (isPaid()) {
//            throw new IllegalStateException("결제 완료 주문은 취소 불가");
//        }
//        this.status = OrderStatus.CANCELLED;
//        this.failReason = reason;
//        this.cancelledAt = LocalDateTime.now();
//    }
//
//
//
//
//
//    /* =========================
//       연관관계 편의 메서드
//       ========================= */
//    public void addPayment(PaymentEntity payment) {
//        payments.add(payment);
//        payment.setOrder(this);
//    }
//
//    /* =========================
//   결제 상태 관련 비즈니스 메서드
//   ========================= */
//
//    /** 결제 완료 여부 */
//    public boolean isPaid() {
//        return this.paymentStatus == PaymentStatus.APPROVED;
//    }
//
//    /** 결제 완료 처리 */
//    public void markPaid(PaymentMethod method) {
//        if (this.paymentStatus != PaymentStatus.READY) {
//            throw new IllegalStateException("결제 불가 상태");
//        }
//        this.paymentStatus = PaymentStatus.APPROVED;
//        this.paymentMethod = method;
//        this.paidAt = LocalDateTime.now();
//        this.status = OrderStatus.PROCESSING;
//    }
//
//    /** 결제 실패 처리 */
//    public void markPaymentFailed(String reason) {
//        this.paymentStatus = PaymentStatus.FAILED;
//        this.failReason = reason;
//    }
//
//    /** 결제 취소 처리 */
//    public void markCanceled() {
//        this.paymentStatus = PaymentStatus.FAILED;
//        this.status = OrderStatus.CANCELLED;
//        this.cancelledAt = LocalDateTime.now();
//    }
//
//    /* =========================
//   결제 표시용 정보
//   ========================= */
//
//    /** 카카오페이 item_name 용 */
//    public String getOrderName() {
//        if (items.isEmpty()) {
//            return "상품";
//        }
//
//        OrderItemEntity first = items.get(0);
//
//        if (items.size() == 1) {
//            return first.getName();
//        }
//
//        return first.getName() + " 외 " + (items.size() - 1) + "건";
//    }
//
//    /** 총 상품 수량 */
//    public int getTotalQuantity() {
//        return items.stream()
//                .mapToInt(OrderItemEntity::getQuantity)
//                .sum();
//    }
//
//    //주문 생성 흐름 통제
//    public static OrderEntity create(
//            UsersEntity user,
//            String deliveryAddress,
//            String phoneNumber
//    ) {
//        OrderEntity order = new OrderEntity();
//        order.user = user;
//        order.deliveryAddress = deliveryAddress;
//        order.phoneNumber = phoneNumber;
//        order.status = OrderStatus.PENDING;
//        order.paymentStatus = PaymentStatus.READY;
//        return order;
//    }
//
//
//    public void pay(String tid) {
//        if (this.paymentStatus != PaymentStatus.READY) {
//            throw new IllegalStateException("이미 처리된 주문입니다");
//        }
//        this.paymentStatus = PaymentStatus.APPROVED;
//        this.status = OrderStatus.PROCESSING;
//        this.paidAt = LocalDateTime.now();
//    }
//
//
//
//    public Long getId() {
//        return orderId;
//    }
//
//    //결제완료로 order테이블 상태변경
//    public void markPaid(OrderEntity order, String tid) {
//        order.pay(tid);
//    }
//
//    public void addItem(OrderItemEntity item) {
//        this.items.add(item);
//        item.setOrder(this);
//    }
//
//    public void calculateTotalPrice() {
//        this.totalPrice = items.stream()
//                .map(OrderItemEntity::calculatePrice)
//                .reduce(BigDecimal.ZERO, BigDecimal::add);
//    }
//
//    public void approvePayment(PaymentMethod method) {
//        if (this.paymentStatus == PaymentStatus.APPROVED) {
//            return; // 중복 승인 방지
//        }
//        this.paymentStatus = PaymentStatus.APPROVED;
//        this.status = OrderStatus.CONFIRMED;
//        this.paymentMethod = method;
//        this.paidAt = LocalDateTime.now();
//    }
//
//    public void failPayment(String reason) {
//        if (this.paymentStatus == PaymentStatus.APPROVED) return;
//        this.paymentStatus = PaymentStatus.FAILED;
//        this.status = OrderStatus.CANCELLED;
//        this.failReason = reason;
//    }
//
//
//}