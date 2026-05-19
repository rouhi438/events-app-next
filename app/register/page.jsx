"use client";
import "./register.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../src/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle, FaGithub } from "react-icons/fa";
export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setDShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { register } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Password do not match");
      return;
    }
    try {
      await register(email, password);
      router.push("/events");
    } catch (err) {
      setError(err.message);
    }
    persist;
  }
  return (
    <>
      <div className="form-container">
        <div className="form-card">
          <h1 className="title">Sign up</h1>
          <p className="subtitle">Sign up to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <input type="text" placeholder="Enter your name" />
            </div>

            <div className="field">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field pass-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <div className="field pass-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setDShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>

            <button type="submit" className="submitBtn">
              Sign up
            </button>
          </form>

          <div className="divider">
            <span className="line"></span>
            <span className="dividerText">OR CONTINUE WITH</span>
            <span className="line"></span>
          </div>

          <div className="socialButtons">
            <button className="socialBtn">
              <FaGoogle className="google-icon" />
              Google
            </button>
            <button className="socialBtn">
              <FaGithub className="github-icon" />
              Github
            </button>
          </div>

          <p className="footer">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}
