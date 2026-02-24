import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  tokenBalance: number;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setTokenBalance: (balance: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo credentials - in production, use proper backend auth
const DEMO_EMAIL = "softtop@outlook.com";
const DEMO_PASSWORD_HASH = btoa("softtop.beijing"); // Simple encoding for demo

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState(105);

  const login = (email: string, password: string): boolean => {
    if (email === DEMO_EMAIL && btoa(password) === DEMO_PASSWORD_HASH) {
      setIsAuthenticated(true);
      setUserEmail(email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, tokenBalance, login, logout, setTokenBalance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
