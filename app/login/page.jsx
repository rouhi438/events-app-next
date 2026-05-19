"use client";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./login.css";
import { useState } from "react";
import { useAuth } from "../../src/context/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setError("");
      await login(email, password);
      router.push("/events");
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="title">Login</h1>
        <p className="subtitle">Login to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field pass-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="remember">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button type="submit" className="submitBtn">
            Login
          </button>
        </form>

        <div className="divider">
          <span className="line"></span>
          <span className="dividerText">OR CONTINUE WITH</span>
          <span className="line"></span>
        </div>

        <div className="socialButtons">
          <button className="socialBtn">
            <span className="socialIcon">G</span> Google
          </button>
          <button className="socialBtn">
            <span className="socialIcon">G</span> Github
          </button>
        </div>

        <p className="footer">
          Don't have an account? <Link href="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
