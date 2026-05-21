"use client";
import Link from "next/link";
import hyfLogo from "../../src/assets/hyf.svg";
import { useAuth } from "../../src/context/AuthContext.jsx";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useCart } from "../../src/context/CartContext.jsx";
import "./layout.css";
import Image from "next/image";
import { useSearch } from "../../src/context/SearchContext.jsx";
import { FiSearch } from "react-icons/fi";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const pathname = usePathname();
  const { cartItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const totalQuantity = (cartItems || []).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  return (
    <div className="Layout">
      <header>
        <nav>
          <div className="cart-holder">
            {/* <Link href="/cart">
              <FaShoppingCart className="cart-icon" />
              {totalQuantity > 0 && (
                <span className="cart-quantity">{totalQuantity}</span>
              )}
            </Link> */}
          </div>
          <div className="logo-holder">
            <a
              href="https://www.hackyourfuture.dk/"
              target="_blank"
              className="link"
            >
              <Image
                src={hyfLogo}
                alt="HackYourFuture logo"
                className="logo"
                width={100}
              />
            </a>
            {/* Navigation links go here — e.g. link to event list, cart, login */}
          </div>
          <div className="menu-bar">
            <div className="link-bar">
              <Link href="/events" className="link">
                Events
              </Link>

              {user && <Link href="/orders">My orders</Link>}
              {user ? (
                <>
                  <div className="user-icon-holder">
                    <span>{user.name}</span>
                    <FaUserCircle className="user-icon" />
                  </div>
                  <button className="logout-link" onClick={logout}>
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">Login</Link>
                  <Link href="/register">Register</Link>
                </>
              )}
              <div className="cart-holder">
                <Link href="/cart">
                  <FaShoppingCart className="cart-icon" />
                  {totalQuantity > 0 && (
                    <span className="cart-quantity">{totalQuantity}</span>
                  )}
                </Link>
              </div>
            </div>
            {pathname === "/events" && (
              <div className="search-holder">
                <FiSearch className="search-icon" />
                {/* <label htmlFor="search">Find Events</label> */}
                <input
                  className="search-input"
                  type="text"
                  id="search"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
            )}
          </div>
        </nav>
      </header>

      <main>{children}</main>

      <footer>
        <p>© 2026 HYF Events Startup App</p>
      </footer>
    </div>
  );
}
