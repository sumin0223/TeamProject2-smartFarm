package com.nova.backend.market.controller;

import com.nova.backend.market.dto.CartItemCreateRequestDTO;
import com.nova.backend.market.dto.CartItemResponseDTO;
import com.nova.backend.market.service.CartItemService;
import com.nova.backend.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "장바구니 API")
public class CartController {

    private final CartItemService cartItemService;

    @Operation(summary = "장바구니 조회")
    @GetMapping("/items")
    public List<CartItemResponseDTO> getCartItems(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return cartItemService.getCartItems(userDetails.getUser());
    }

    @Operation(summary = "장바구니 상품 추가")
    @PostMapping("/items")
    public CartItemResponseDTO addCartItem(
            @RequestBody CartItemCreateRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return cartItemService.addCartItem(request, userDetails.getUser());
    }

    @Operation(summary = "장바구니 수량 수정")
    @PutMapping("/items/{cartItemId}")
    public CartItemResponseDTO updateQuantity(
            @PathVariable Long cartItemId,
            @RequestParam int quantity,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return cartItemService.updateQuantity(
                cartItemId,
                quantity,
                userDetails.getUser()
        );
    }

    @Operation(summary = "장바구니 상품 삭제")
    @DeleteMapping("/items/{cartItemId}")
    public void deleteCartItem(
            @PathVariable Long cartItemId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        cartItemService.deleteCartItem(
                cartItemId,
                userDetails.getUser()
        );
    }

    @Operation(summary = "장바구니 비우기")
    @DeleteMapping("/clear")
    public void clearCart(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        cartItemService.clearCart(userDetails.getUser());
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
