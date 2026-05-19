"use client";
import { useCart } from "../../src/context/CartContext";
import { useOrder } from "../../src/context/OrderContext";
import { useAuth } from "../../src/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./checkout.css";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { createOrder, loading, error } = useOrder();
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const { user } = useAuth();
  const navigate = useRouter();

  //states for user && payment form Info
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [payMethod, setPayMethod] = useState("credit_card");
  const [formErrors, setFormErrors] = useState({});
  const [orderError, setOrderError] = useState(null);

  //if (!cartItems) return <div>loading cart...</div>;
  if (!user) {
    return (
      <div className="checkout-message">
        <p>Please login to checkout.</p>
        <Link href="/login">Go to login</Link>
      </div>
    );
  }
  if (cartItems.length === 0) {
    return (
      <div className="checkout-message">
        <h2>Your cart is empty</h2>
        <Link href="/events">Browse Events</Link>
      </div>
    );
  }

  const validateForm = () => {
    const errors = {};
    if (!address.trim()) errors.address = "Address is required";
    if (!city.trim()) errors.city = "City is required";
    if (!postalCode.trim()) errors.postalCode = "Postal code is required";
    if (!phone.trim()) errors.phone = "Phone number is required";
    else if (!/^\d{8,}$/.test(phone.replace(/\s/g, "")))
      errors.phone = "Enter a valid Phone number (at least 8 digits)";
    if (!payMethod) errors.payMethod = "Select a payment method";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    try {
      setOrderError(null);
      const orderDetails = {
        cartItems,
        total: totalPrice,
        shipping: { address, city, postalCode, phone },
        payMethod,
      };

      await createOrder(cartItems, totalPrice);
      clearCart();
      navigate("/orders");
    } catch (err) {
      setOrderError(err.message);
    }
  };
  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-grid">
        <div className="checkout-items">
          <h2>Order Items</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item-card">
              <div className="item-detail">
                <h3>{item.name}</h3>
                <div className="item-quantity">
                  <span>Quantity: {item.quantity}</span>
                  <p className="item-price">€{item.price}</p>
                </div>
                <div className="item-total">
                  €{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
          <div className="checkout-total-summary">
            <strong>Total: €{totalPrice.toFixed(2)}</strong>
          </div>
        </div>

        <div className="checkout-summary">
          <h2>Shipping & Payment</h2>
          <div className="form-group">
            <label>Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street and Number"
              className={formErrors.address ? "error-input" : ""}
            />
            {formErrors.address && (
              <span className="error-text">{formErrors.address}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={formErrors.city ? "error-input" : ""}
              />
              {formErrors.city && (
                <span className="error-text">{formErrors.city}</span>
              )}
            </div>
            <div className="form-group">
              <label>Postal code *</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={formErrors.postalCode ? "error-input" : ""}
              />
              {formErrors.postalCode && (
                <span className="error-text">{formErrors.postalCode}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number"
              className={formErrors.phone ? "error-input" : ""}
            />
            {formErrors.phone && (
              <span className="error-text">{formErrors.phone}</span>
            )}
          </div>

          <div className="form-group">
            <label>Payment method *</label>
            <select
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
              className={formErrors.payMethod ? "error-input" : ""}
            >
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
            {formErrors.payMethod && (
              <span className="error-text">{formErrors.payMethod}</span>
            )}
          </div>

          {orderError && <p className="error-message">{orderError}</p>}
          {error && <p className="error-message">{error}</p>}

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="place-order-btn"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
