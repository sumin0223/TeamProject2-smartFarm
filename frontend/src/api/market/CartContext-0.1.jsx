// src/contexts/CartContext.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
} from "react";

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {'crop'|'device'|'service'} category
 * @property {string} farmName
 * @property {string} systemType
 * @property {string=} plant
 * @property {string=} stage
 * @property {number=} days
 * @property {number} price
 * @property {string} unit
 * @property {string} image
 * @property {string=} description
 * @property {string[]=} specs
 * @property {number=} stock
 */

/**
 * @typedef {Product & { quantity: number }} CartItem
 */

/**
 * @typedef {Object} CartContextType
 * @property {CartItem[]} items
 * @property {(product: Product, quantity?: number) => void} addToCart
 * @property {(productId: string) => void} removeFromCart
 * @property {(productId: string, quantity: number) => void} updateQuantity
 * @property {() => void} clearCart
 * @property {number} totalItems
 * @property {number} totalPrice
 */

const CartContext = createContext();

/** 유니크 ID 자동 매핑 */
const normalizeId = (product) =>
  product.id ||
  product._id ||
  product.productId ||
  product.deviceId ||
  product.cropId;

/* ─────────────────────────────── reducer ─────────────────────────────── */

const ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  UPDATE: "UPDATE",
  CLEAR: "CLEAR",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD: {
      const item = action.payload;
      const exists = state.items.find(
        (i) => i.id === item.id
      );

      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  quantity:
                    i.quantity + item.quantity,
                }
              : i
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, item],
      };
    }

    case ACTIONS.UPDATE: {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => i.id !== id
          ),
        };
      }

      return {
        ...state,
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        ),
      };
    }

    case ACTIONS.REMOVE:
      return {
        ...state,
        items: state.items.filter(
          (i) => i.id !== action.payload
        ),
      };

    case ACTIONS.CLEAR:
      return { ...state, items: [] };

    default:
      return state;
  }
}

/* ─────────────────────────────── Provider ─────────────────────────────── */

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
  });

  /** 상품 추가 */
  const addToCart = (product, quantity = 1) => {
    const fixedId = normalizeId(product);

    dispatch({
      type: ACTIONS.ADD,
      payload: {
        ...product,
        id: fixedId, // ID 강제 정규화 포함
        quantity,
      },
    });
  };

  /** 수량 업데이트 */
  const updateQuantity = (id, quantity) => {
    dispatch({
      type: ACTIONS.UPDATE,
      payload: { id, quantity },
    });
  };

  /** 상품 삭제 */
  const removeFromCart = (id) =>
    dispatch({
      type: ACTIONS.REMOVE,
      payload: id,
    });

  /** 장바구니 전체 비우기 */
  const clearCart = () =>
    dispatch({ type: ACTIONS.CLEAR });

  /** 합계 계산 */
  const totalItems = useMemo(
    () =>
      state.items.reduce(
        (sum, i) => sum + i.quantity,
        0
      ),
    [state.items]
  );

  const totalPrice = useMemo(
    () =>
      state.items.reduce(
        (sum, i) =>
          sum + i.quantity * (i.price || 0),
        0
      ),
    [state.items]
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ─────────────────────────────── Hook ─────────────────────────────── */

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider"
    );
  }
  return context;
}
