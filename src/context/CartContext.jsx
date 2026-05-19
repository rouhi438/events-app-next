"use client";
import { createContext, useContext, useState } from "react";
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const addToCart = (event) => {
    if (!event?.id) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === event.id);
      if (existing) {
        return prev.map((item) =>
          item.id === event.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...event, quantity: 1 }];
    });
  };

  // removing Item from cart

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // update Cart
  const updateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.id !== id)
        : prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  return useContext(CartContext);
}
