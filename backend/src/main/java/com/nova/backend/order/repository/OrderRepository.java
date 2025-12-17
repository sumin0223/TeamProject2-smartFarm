package com.nova.backend.order.repository;


import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    OrderEntity findByOrderId(Long orderId);
    List<OrderEntity> findByUser(UsersEntity user);
}
