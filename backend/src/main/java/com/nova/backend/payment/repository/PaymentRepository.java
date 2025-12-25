package com.nova.backend.payment.repository;

import com.nova.backend.payment.entity.PaymentEntity;
import com.nova.backend.payment.entity.PaymentMethod;
import com.nova.backend.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {

    /**
     * 주문 + 결제수단으로 결제 단건 조회
     * - READY / APPROVE 단계에서 사용
     */
    Optional<PaymentEntity> findByOrder_OrderIdAndMethod(Long orderId,
                                                         PaymentMethod method);

    /**
     * 주문의 결제 존재 여부
     * - 중복 결제 방지용
     */
    boolean existsByOrder_OrderIdAndStatus(Long orderId,
                                           PaymentStatus status);

    /**
     * 결제 TID로 조회 (카카오 approve 검증용)
     */
    Optional<PaymentEntity> findByTid(String tid);
}

