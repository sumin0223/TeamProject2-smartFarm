package com.nova.backend.order.service;

import com.nova.backend.market.entity.CartItemEntity;
import com.nova.backend.market.repository.CartItemRepository;
import com.nova.backend.order.dto.OrderRequestDTO;
import com.nova.backend.order.dto.OrderResponseDTO;
import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.order.entity.OrderItemEntity;
import com.nova.backend.order.repository.OrderRepository;
import com.nova.backend.payment.entity.PaymentEntity;
import com.nova.backend.payment.entity.PaymentStatus;
import com.nova.backend.payment.repository.PaymentRepository;
import com.nova.backend.user.entity.UsersEntity;
import com.siot.IamportRestClient.IamportClient;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final CartItemRepository cartItemRepository;

    private final IamportClient iamportClient;

    @Override
    public OrderEntity createOrder(UsersEntity user, OrderRequestDTO request) {

        // 1️⃣ 사용자 장바구니 조회
        List<CartItemEntity> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("장바구니가 비어있습니다.");
        }

        // 2️⃣ 주문 기본 정보 생성
        OrderEntity order = OrderEntity.builder()
                .user(user)

                .deliveryAddress(request.getDeliveryAddress())
                .phoneNumber(request.getPhoneNumber())
                .recipientName(request.getRecipientName())
                .message(request.getMessage())

                //.deliveryAddress(user.getAddress()) // 실제 사용자 주소
                //.phoneNumber(user.getPhoneNumber()) // 실제 사용자 번호

                .orderUid("ORD" + UUID.randomUUID().toString().substring(0, 8)) // 고유 주문번호
                .build();

        // 아직 save 하지 않음! → price가 null일 수 있으므로

        // 3️⃣ CartItem → OrderItem 변환 및 총 금액 계산
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (CartItemEntity cartItem : cartItems) {
            // 각 상품 총 금액 계산
            BigDecimal itemTotal = cartItem.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalPrice = totalPrice.add(itemTotal);

            // OrderItem 생성
            OrderItemEntity orderItem = OrderItemEntity.builder()
                    .order(order)
                    .productId(cartItem.getProduct().getProductId())
                    .name(cartItem.getProduct().getName())
                    .quantity(cartItem.getQuantity())
                    .price(itemTotal)
                    .imageUrl(cartItem.getImageUrl())
                    .build();


            // 양방향 연관
            order.addOrderItem(orderItem); // OrderEntity에 addOrderItem() 구현 필요
        }

        // 총 주문 금액 세팅
        order.setOrderTotalPrice(totalPrice);

        // 4️⃣ Order 저장
        orderRepository.save(order); // price가 null이 아니므로 안전

        // 5️⃣ 결제 생성 및 Order 연관
        PaymentEntity payment = PaymentEntity.builder()
                .order(order)
                .price(totalPrice)
                .status(PaymentStatus.READY)
                .build();

        paymentRepository.save(payment);
        order.setPayment(payment);
        orderRepository.save(order); // 결제 연관 후 저장

        // 6️⃣ 장바구니 비우기
        //cartItemRepository.deleteByUser(user);

        return order;
    }


    @Override
    public List<OrderResponseDTO> getOrders(UsersEntity user) {
        // 1️⃣ DB에서 해당 사용자의 모든 주문 조회, 최신 순
        List<OrderEntity> orders = orderRepository.findByUser(user);

        // 2️⃣ OrderEntity → OrderResponse 변환
        return orders.stream()
                .map(order -> OrderResponseDTO.from(order, "주문 내역"))
                .toList();
    }

    @Override
    public OrderResponseDTO findOrder(String orderUid) {
        OrderEntity order = orderRepository.findByOrderUid(orderUid)
                .orElseThrow(() -> new EntityNotFoundException("주문을 찾을 수 없습니다."));

        return OrderResponseDTO.from(order, "주문 단건 조회");
    }


}
