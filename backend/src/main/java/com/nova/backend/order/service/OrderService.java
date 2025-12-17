package com.nova.backend.order.service;

import com.nova.backend.cart.entity.CartItemEntity;
import com.nova.backend.cart.repository.CartRepository;
import com.nova.backend.market.entity.ProductEntity;
import com.nova.backend.market.repository.ProductRepository;
import com.nova.backend.order.dto.OrderItemRequest;
import com.nova.backend.order.entity.*;
import com.nova.backend.order.repository.OrderRepository;
import com.nova.backend.payment.entity.PaymentMethod;
import com.nova.backend.payment.entity.PaymentStatus;
import com.nova.backend.user.entity.UsersEntity;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    /**
     * =========================================================
     * 장바구니 → 주문 생성 (결제 전 단계)
     * =========================================================
     */
    @Transactional
    public Long createOrderFromCart(
            UsersEntity user,
            String deliveryAddress,
            String phoneNumber,
            PaymentMethod paymentMethod
    ) {
        List<CartItemEntity> cartItems =
                cartRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new IllegalStateException("장바구니가 비어 있습니다");
        }

        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setDeliveryAddress(deliveryAddress);
        order.setPhoneNumber(phoneNumber);
        order.setPaymentMethod(paymentMethod);

//        order.setPaymentStatus(PaymentStatus.PENDING);
//        order.setStatus(OrderStatus.PENDING);
        for (CartItemEntity cartItem : cartItems) {
            order.addItem(OrderItemEntity.fromCartItem(cartItem));
        }

        // 총 금액 계산
        order.calculateTotalPrice();

        //주문 저장?
        orderRepository.save(order);
        //주문 완료후 카트비우기
        cartRepository.deleteAll(cartItems);

        return order.getOrderId();

//        //빌더 패턴 적용
//        for (CartItemEntity cartItem : cartItems) {
//            ProductEntity product = cartItem.getProduct();
//
//            OrderItemEntity orderItem = OrderItemEntity.builder()
//                    .productId(product.getProductId())
//                    .name(product.getName())
//                    .price(product.getPrice())
//                    .quantity(cartItem.getQuantity())
//                    .image(product.getImageUrl())
//                    .category(product.getCategory().name())
//                    .description(product.getDescription())
//                    .build();
//
//            order.addItem(orderItem);
//
//            // totalPrice는 OrderEntity에 계산 메서드 추가 가능
//            totalPrice += product.getPrice() * cartItem.getQuantity();
//        }
//
//
//        order.setTotalPrice(totalPrice);



    }


    /**
     * =========================================================
     * 결제 성공 처리 (중복 승인 방지 핵심)
     * =========================================================
     */
    @Transactional
    public void markPaymentSuccess(Long orderId, PaymentMethod method) {

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new EntityNotFoundException("주문을 찾을 수 없습니다")
                );

        // ✅ 중복 승인 방지 (idempotency)
        if (order.getPaymentStatus() == PaymentStatus.APPROVED) {
            return;
        }

        order.setPaymentStatus(PaymentStatus.APPROVED);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setPaymentMethod(method);
        order.setPaidAt(LocalDateTime.now());
    }

    /**
     * =========================================================
     * 결제 실패 처리
     * =========================================================
     */
    @Transactional
    public void markPaymentFail(Long orderId, String reason) {

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new EntityNotFoundException("주문을 찾을 수 없습니다")
                );

        // 이미 결제 성공이면 실패로 덮어쓰지 않음
        if (order.getPaymentStatus() == PaymentStatus.APPROVED) {
            return;
        }

        order.setPaymentStatus(PaymentStatus.FAILED);
        order.setStatus(OrderStatus.CANCELLED);
        order.setFailReason(reason);
        order.setCancelledAt(LocalDateTime.now());
    }

    /**
     * =========================================================
     * 배송 / 상태 관리
     * =========================================================
     */
    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus status) {
        OrderEntity order = getOrder(orderId);
        order.setStatus(status);
    }

    @Transactional
    public void confirmOrder(Long orderId) {
        OrderEntity order = getOrder(orderId);
        order.setStatus(OrderStatus.CONFIRMED);
    }

    @Transactional
    public void updateTrackingNumber(Long orderId, String trackingNumber) {
        OrderEntity order = getOrder(orderId);
        order.setTrackingNumber(trackingNumber);
        order.setStatus(OrderStatus.SHIPPING);
    }

    /**
     * =========================================================
     * 환불
     * =========================================================
     */
    @Transactional
    public void requestRefund(Long orderId, String reason) {
        OrderEntity order = getOrder(orderId);
        order.setRefundReason(reason);
        order.setStatus(OrderStatus.REFUND_REQUESTED);
        order.setRefundRequestedAt(LocalDateTime.now());
    }

    @Transactional
    public void approveRefund(Long orderId) {
        OrderEntity order = getOrder(orderId);
        order.setStatus(OrderStatus.REFUNDED);
        order.setPaymentStatus(PaymentStatus.CANCELED);
        order.setRefundedAt(LocalDateTime.now());
    }

    /**
     * =========================================================
     * 조회
     * =========================================================
     */
    public OrderEntity getOrderById(Long orderId) {
        return getOrder(orderId);
    }

    private OrderEntity getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new EntityNotFoundException("주문을 찾을 수 없습니다")
                );
    }

    /**
     * =========================================================
     * 유저별 주문 목록 조회
     * =========================================================
     */
    public List<OrderEntity> getOrdersByUser(UsersEntity user) {
        return orderRepository.findByUser(user);
    }

    /**
     * =========================================================
     * 관리자 - 전체 주문 목록 조회
     * =========================================================
     */
    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }


    @Transactional
    public Long createOrder(
            UsersEntity user,
            List<OrderItemRequest> items,
            String deliveryAddress,
            String phoneNumber,
            PaymentMethod paymentMethod
    ) {
        if (items == null || items.isEmpty()) {
            throw new IllegalStateException("주문 상품이 없습니다");
        }

        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setDeliveryAddress(deliveryAddress);
        order.setPhoneNumber(phoneNumber);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus(PaymentStatus.READY);
        order.setStatus(OrderStatus.PENDING);

        int totalPrice = 0;

        for (OrderItemRequest req : items) {

            ProductEntity product = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("상품 없음"));

            // OrderItemEntity 생성 시 Builder 사용
            OrderItemEntity item = OrderItemEntity.builder()
                    .productId(product.getProductId())
                    .name(product.getName())
                    .price(product.getPrice())
                    .quantity(req.getQuantity())
                    .image(product.getImageUrl())
                    .category(product.getCategory().name())
                    .description(product.getDescription())
                    .build();
            order.addItem(item);

            order.addItem(item);
            totalPrice += product.getPrice() * req.getQuantity();
        }


        order.setTotalPrice(totalPrice);
        orderRepository.save(order);

        return order.getOrderId();
    }



}
