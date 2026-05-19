"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const orderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const saveOrders = localStorage.getItem("orders");
    if (saveOrders) {
      setOrders(JSON.parse(saveOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  async function createOrder(cartItems, total) {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (!user) {
        throw new Error("You must be logged in to place an order");
      }
      if (!cartItems || cartItems.length === 0) {
        throw new Error("Cart is empty");
      }
      const newOrder = {
        id: Date.now(),
        userId: user.id,
        date: new Date().toISOString(),
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: total,
        status: "confirmed",
      };
      setOrders((prev) => [...prev, newOrder]);
      setLoading(false);
      return newOrder;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }
  function getUserOrders() {
    if (!user) return [];
    return orders.filter((order) => order.userId === user.id);
  }
  function getOrderById(orderId) {
    return orders.find((order) => order.id === parseInt(orderId));
  }
  return (
    <orderContext.Provider
      value={{
        orders,
        loading,
        error,
        createOrder,
        getUserOrders,
        getOrderById,
      }}
    >
      {children}
    </orderContext.Provider>
  );
}
export function useOrder() {
  return useContext(orderContext);
}
