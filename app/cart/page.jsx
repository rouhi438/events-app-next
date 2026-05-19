"use client";
import { useCart } from "../../src/context/CartContext";
import "./cart.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import paymentImg from "../../src/assets/payment.png";
import { useAuth } from "../../src/context/AuthContext";
import Image from "next/image";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useRouter();

  const handleCheckout = () => {
    if (!user) {
      navigate.push("/login", {
        state: { from: "/cart", message: "Please login to checkout" },
      });
    } else {
      navigate.push("/checkout");
    }
  };
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>

        <p>Add some events to get started.</p>

        <Link href="/events" className="shop-btn">
          Browse Events
        </Link>
      </div>
    );
  }
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return (
    <div className="cart-page">
      <div className="cart-items">
        <h2>Shopping Cart</h2>

        <div className="cart-item">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item-row">
              <h3 className="item-name">{item.name}</h3>
              <div className="item-left">
                <div className="price-delete-wrapper">
                  <p className="item-price">€{item.price}</p>
                  <button
                    className="delete-icon-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="item-actions">
                  <div className="button-holder">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="item-quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="cart-summary">
        <div>
          <h5>Order Summary</h5>
          <div className="order-info">
            <p>Your Order</p>
            {cartItems.map((item) => (
              <p key={item.id}>
                {item.quantity} * €{item.price}
              </p>
            ))}
          </div>
        </div>
        <div className="total">
          <p>Total :</p>
          <h3>€{total.toFixed(2)}</h3>
        </div>
        <div className="discount">
          <p>Apply Discount Coupon</p>
          <input className="coupon" type="text" placeholder="XR4352T" />
        </div>
        <div className="checkout" onClick={handleCheckout}>
          <p>Continue to checkout</p>
          <button className="checkout-btn">→</button>
        </div>
        <div className="pay-cards">
          <Image className="pay-image" src={paymentImg} alt="Payment Methods" />
        </div>
      </div>
    </div>
  );
}
