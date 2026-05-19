"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || null;
    }
    return null;
  });
  const getUsers = () => {
    const users =
      typeof window !== "undefined" ? localStorage.getItem("fakeUsers") : null;
    return users ? JSON.parse(users) : [];
  };
  const saveUsers = (users) => {
    localStorage.setItem("fakeUsers", JSON.stringify(users));
  };
  async function login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getUsers();
    const foundUser = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }
    const { password: _, ...userWithoutPassword } = foundUser;

    const fakeToken = "fake-jwt-" + Date.now();

    persist(fakeToken, userWithoutPassword);
  }

  async function register(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    if (password.length < 4) {
      throw new Error("Password must be at least 4 characters");
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = getUsers();
    const existing = users.find((u) => u.email === email);
    if (existing) {
      throw new Error("User already exists with this email");
    }
    const newUser = {
      id: Date.now(),
      email: email,
      password: password,
      name: email.split("@")[0],
    };
    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    const fakeToken = "mock-jwt-" + Date.now();
    persist(fakeToken, userWithoutPassword);
  }
  // TODO: POST to api("/register") with { email, password }
  // TODO: if the response is not ok, throw an error
  // TODO: destructure { accessToken, user } from the response JSON
  // TODO: call `persist` with accessToken and user to save the session

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    // TODO add the missing logout logic here — clear the token and user from state as well
  }

  function persist(accessToken, user) {
    const visitedUsers = JSON.parse(localStorage.getItem("visitedUsers")) || [];
    const hasVisitedBefore = visitedUsers.includes(user.email);

    if (hasVisitedBefore) {
      localStorage.setItem("welcomeMessage", `Welcome back ${user.name}`);
    } else {
      localStorage.setItem("welcomeMessage", `Welcome ${user.name}`);
      visitedUsers.push(user.email);
      localStorage.setItem("visitedUsers", JSON.stringify(visitedUsers));
    }
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(accessToken);
    setUser(user);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
// Usage: const { user, token, login, register, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
