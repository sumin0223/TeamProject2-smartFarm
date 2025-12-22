package com.nova.backend.cart.repository;

import com.nova.backend.cart.entity.CartItemEntity;
import com.nova.backend.market.entity.ProductEntity;
import com.nova.backend.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {

    List<CartItemEntity> findByUser(UsersEntity user);

    void deleteByUser(UsersEntity user);

    void deleteByUserAndProduct(UsersEntity user, ProductEntity product);
}

