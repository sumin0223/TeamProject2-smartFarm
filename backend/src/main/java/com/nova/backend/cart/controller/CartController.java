package com.nova.backend.cart.controller;

import com.nova.backend.cart.dto.*;
import com.nova.backend.cart.service.CartItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "장바구니 API")
public class CartController {

    private final CartItemService cartItemService;

    @Operation(summary = "장바구니 조회")
    @GetMapping("/items")
    public List<CartItemResponse> getCartItems() {
        return cartItemService.getCartItems();
    }

    @Operation(summary = "장바구니 상품 추가")
    @PostMapping("/items")
    public CartItemResponse addCartItem(
            @RequestBody CartItemCreateRequest request
    ) {
        return cartItemService.addCartItem(request);
    }

    @Operation(summary = "장바구니 수량 수정")
    @PutMapping("/items/{cartItemId}")
    public CartItemResponse updateQuantity(
            @PathVariable Long cartItemId,
            @RequestParam int quantity
    ) {
        return cartItemService.updateQuantity(cartItemId, quantity);
    }

    @Operation(summary = "장바구니 상품 삭제")
    @DeleteMapping("/items/{cartItemId}")
    public void deleteCartItem(@PathVariable Long cartItemId) {
        cartItemService.deleteCartItem(cartItemId);
    }

    @Operation(summary = "장바구니 비우기")
    @DeleteMapping("/clear")
    public void clearCart() {
        cartItemService.clearCart();
    }
}


//package com.nova.backend.cart.controller;
//
//import com.nova.backend.cart.dto.*;
//import com.nova.backend.cart.service.CartService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/cart")
//@RequiredArgsConstructor
//@CrossOrigin
//public class CartController {
//
//    private final CartService cartService;
//
//    @PostMapping("/add")
//    public void addToCart(@RequestBody CartAddRequest request) {
//        cartService.addToCart(
//                request.getUserId(),
//                request.getProductId(),
//                request.getQuantity()
//        );
//    }
//
//    @PostMapping("/remove")
//    public void removeFromCart(@RequestBody CartRemoveRequest request) {
//        cartService.removeFromCart(
//                request.getUserId(),
//                request.getProductId()
//        );
//    }
//
//    @PostMapping("/update")
//    public void updateQuantity(@RequestBody CartUpdateRequest request) {
//        cartService.updateQuantity(
//                request.getCartItemId(),
//                request.getQuantity()
//        );
//    }
//
//    @PostMapping("/clear")
//    public void clearCart(@RequestBody CartClearRequest request) {
//        cartService.clearCart(request.getUserId());
//    }
//
//    // 조회 JSON 요청/응답
//    @PostMapping("/list")
//    public List<CartItemResponse> getCart(@RequestBody CartGetRequest request) {
//        return cartService.getCart(request.getUserId());
//    }
//}
