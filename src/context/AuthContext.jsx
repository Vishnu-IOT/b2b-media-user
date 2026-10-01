import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/endpoints";

const AuthContext = createContext(null);
const TOKEN_KEY = "vartha_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    setError(null);
    const { user: u, token } = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
    return u;
  };

  // Signup step 1. The account is created unverified and NO token is returned,
  // so we do not log the user in here. Resolves to { email }.
  const register = async (name, email, password) => {
    setError(null);
    return authApi.register({ name, email, password });
  };

  // Signup step 2. The token is stored only after the OTP is accepted.
  const verifyOtp = async (email, otp) => {
    setError(null);
    const { user: u, token } = await authApi.verifyOtp({ email, otp });
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
    return u;
  };

  const resendOtp = (email) => authApi.resendOtp({ email });

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, setError, login, register, verifyOtp, resendOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
