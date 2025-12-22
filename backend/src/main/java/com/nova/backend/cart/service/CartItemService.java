package com.nova.backend.cart.service;

import com.nova.backend.cart.dto.*;
import com.nova.backend.cart.entity.CartItemEntity;
import com.nova.backend.cart.repository.CartItemRepository;
import com.nova.backend.market.entity.ProductEntity;
import com.nova.backend.market.repository.ProductRepository;
import com.nova.backend.user.entity.UsersEntity;
import com.nova.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartItemService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository usersRepository;

    public List<CartItemResponse> getCartItems() {
        UsersEntity user = getCurrentUser();
        return cartItemRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CartItemResponse addCartItem(CartItemCreateRequest request) {
        UsersEntity user = getCurrentUser();
        ProductEntity product = productRepository.findById(request.getProductId())
                .orElseThrow();

        CartItemEntity cartItem = CartItemEntity.builder()
                .user(user)
                .product(product)
                .productName(request.getProductName())
                .category(request.getCategory())
                .farmName(request.getFarmName())
                .systemType(request.getSystemType())
                .plant(request.getPlant())
                .stage(request.getStage())
                .days(request.getDays())
                .price(request.getPrice())
                .unit(request.getUnit())
                .image(request.getImage())
                .description(request.getDescription())
                .specs(request.getSpecs())
                .stock(request.getStock())
                .quantity(request.getQuantity())
                .build();

        return toResponse(cartItemRepository.save(cartItem));
    }

    public CartItemResponse updateQuantity(Long cartItemId, int quantity) {
        CartItemEntity cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow();
        cartItem.setQuantity(quantity);
        return toResponse(cartItemRepository.save(cartItem));
    }

    public void deleteCartItem(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    public void clearCart() {
        UsersEntity user = getCurrentUser();
        cartItemRepository.deleteByUser(user);
    }

    private CartItemResponse toResponse(CartItemEntity entity) {
        return CartItemResponse.builder()
                .cartItemId(entity.getCartItemId())
                .productId(entity.getProduct().getProductId())
                .productName(entity.getProductName())
                .category(entity.getProduct().getCategory())
                .price(entity.getPrice())
                .quantity(entity.getQuantity())
                .unit(entity.getUnit())
                .image(entity.getImage())
                .specs(entity.getSpecs())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    // 🔐 임시 사용자 (Swagger 테스트용)
    private UsersEntity getCurrentUser() {
        return usersRepository.findById(1L).orElseThrow();
    }
}


//package com.nova.backend.cart.service;
//
//import com.nova.backend.cart.dto.CartItemResponse;
//import com.nova.backend.cart.entity.CartItemEntity;
//import com.nova.backend.cart.repository.CartRepository;
//import com.nova.backend.market.entity.ProductEntity;
//import com.nova.backend.market.repository.ProductRepository;
//import com.nova.backend.user.entity.UsersEntity;
//import com.nova.backend.user.repository.UserRepository;
//import org.springframework.transaction.annotation.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class CartService {
//
//    private final CartRepository cartRepository;
//    private final ProductRepository productRepository;
//    private final UserRepository userRepository;
//
//    public void addToCart(Long userId, Long productId, int quantity) {
//
//        UsersEntity user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));
//
//        ProductEntity product = productRepository.findById(productId)
//                .orElseThrow(() -> new IllegalArgumentException("상품 없음"));
//
//        CartItemEntity item = new CartItemEntity();
//        item.setUser(user);
//        item.setProduct(product);
//        item.setQuantity(quantity);
//
//        cartRepository.save(item);
//    }
//
//    public void removeFromCart(Long userId, Long productId) {
//
//        UsersEntity user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));
//
//        ProductEntity product = productRepository.findById(productId)
//                .orElseThrow(() -> new IllegalArgumentException("상품 없음"));
//
//        cartRepository.deleteByUserAndProduct(user, product);
//    }
//
//    public void updateQuantity(Long cartItemId, int quantity) {
//
//        CartItemEntity item = cartRepository.findById(cartItemId)
//                .orElseThrow(() -> new IllegalArgumentException("장바구니 아이템 없음"));
//
//        item.setQuantity(quantity);
//    }
//
//    public void clearCart(Long userId) {
//
//        UsersEntity user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));
//
//        cartRepository.deleteByUser(user);
//    }
//
//    @Transactional(readOnly = true)
//    public List<CartItemResponse> getCart(Long userId) {
//
//        UsersEntity user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));
//
//        return cartRepository.findByUser(user).stream()
//                .map(CartItemResponse::new)
//                .toList();
//    }
//}
