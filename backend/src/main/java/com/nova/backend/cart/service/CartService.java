package com.nova.backend.cart.service;

import com.nova.backend.cart.dto.CartItemResponse;
import com.nova.backend.cart.entity.CartItemEntity;
import com.nova.backend.cart.repository.CartRepository;
import com.nova.backend.market.entity.ProductEntity;
import com.nova.backend.market.repository.ProductRepository;
import com.nova.backend.user.entity.UsersEntity;
import com.nova.backend.user.repository.UsersRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UsersRepository usersRepository;

    public void addToCart(Long userId, Long productId, int quantity) {

        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품 없음"));

        CartItemEntity item = new CartItemEntity();
        item.setUser(user);
        item.setProduct(product);
        item.setQuantity(quantity);

        cartRepository.save(item);
    }

    public void removeFromCart(Long userId, Long productId) {

        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품 없음"));

        cartRepository.deleteByUserAndProduct(user, product);
    }

    public void updateQuantity(Long cartItemId, int quantity) {

        CartItemEntity item = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 아이템 없음"));

        item.setQuantity(quantity);
    }

    public void clearCart(Long userId) {

        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        cartRepository.deleteByUser(user);
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> getCart(Long userId) {

        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        return cartRepository.findByUser(user).stream()
                .map(CartItemResponse::new)
                .toList();
    }
}
