package com.nova.backend.cart.controller;

import com.nova.backend.cart.dto.*;
import com.nova.backend.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@CrossOrigin
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public void addToCart(@RequestBody CartAddRequest request) {
        cartService.addToCart(
                request.getUserId(),
                request.getProductId(),
                request.getQuantity()
        );
    }

    @PostMapping("/remove")
    public void removeFromCart(@RequestBody CartRemoveRequest request) {
        cartService.removeFromCart(
                request.getUserId(),
                request.getProductId()
        );
    }

    @PostMapping("/update")
    public void updateQuantity(@RequestBody CartUpdateRequest request) {
        cartService.updateQuantity(
                request.getCartItemId(),
                request.getQuantity()
        );
    }

    @PostMapping("/clear")
    public void clearCart(@RequestBody CartClearRequest request) {
        cartService.clearCart(request.getUserId());
    }

    // 조회 JSON 요청/응답
    @PostMapping("/list")
    public List<CartItemResponse> getCart(@RequestBody CartGetRequest request) {
        return cartService.getCart(request.getUserId());
    }
}
