"use client";
import Link from "next/link";
import { useOrder } from "../../src/context/OrderContext";
import { useAuth } from "../../src/context/AuthContext";
import "./order.css";

export default function OrdersPage() {
  const { orders, loading, error } = useOrder();
  const { user } = useAuth();
  const userOrders = user
    ? orders.filter((order) => order.userId === user.id)
    : [];

  if (!user) {
    return <div className="orders-container">Please login to view orders.</div>;
  }
  if (loading) return <div className="orders-container">Loading...</div>;

  if (error) return <div className="order-container error">{error}</div>;

  if (userOrders.length === 0) {
    return (
      <div className="orders-container empty">
        <h2>No order yet</h2>
        <Link href="/events">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>My orders</h2>
      {userOrders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <span>Order #{order.id}</span>
            <span>{new Date(order.date).toLocaleString()}</span>
          </div>
          <div className="order-items-list">
            {order.items.map((item) => (
              <div key={item.id} className="order-item-line">
                <Link href={`/events/${item.id}`} className="event-link">
                  {item.name}
                </Link>
                <span>
                  {item.quantity} * €{item.price}
                </span>
              </div>
            ))}
          </div>
          <div className="order-footer">
            <strong> Total:{order.total.toFixed(2)}</strong>
            <span className="order-status">{order.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
