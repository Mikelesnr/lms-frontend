"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api, { getCsrfCookie } from "@/lib/api";
import { User, AuthContextType, LoginCredentials, RegisterData } from "@/types";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const { data } = await api.get<User>("/api/user");
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      // Fetch CSRF cookie before making the login POST request to prevent 419 errors
      await getCsrfCookie();
      await api.post("/api/auth/login", credentials);
      await fetchUser();
      notifications.show({
        title: "Success! 🎉",
        message: "You have successfully logged in.",
        color: "teal",
      });
    } catch (error: any) {
      console.error("Login failed:", error);
      notifications.show({
        title: "Login Failed",
        message:
          error.response?.data?.message ||
          "Invalid credentials. Please try again.",
        color: "red",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Fetch CSRF cookie before making the logout POST request to prevent 419 errors
      await getCsrfCookie();
      await api.post("/api/auth/logout");
      setUser(null);
      notifications.show({
        title: "Logged Out",
        message: "You have been successfully logged out.",
        color: "blue",
      });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      notifications.show({
        title: "Logout Failed",
        message: "Could not log out. Please try again.",
        color: "red",
      });
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      // Fetch CSRF cookie before making the register POST request to prevent 419 errors
      await getCsrfCookie();
      const response = await api.post("/api/auth/register", userData);
      await fetchUser(); // Attempt to fetch user after registration if auto-login occurs
      notifications.show({
        title: "Registration Successful! ✅",
        message: "Your account has been created. You can now log in.",
        color: "teal",
      });
      return response.data;
    } catch (error: any) {
      console.error("Registration failed:", error);
      let errorMessage = "Registration failed. Please try again.";
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          const errors = error.response.data.errors;
          const firstError = Object.values(errors).flat()[0];
          errorMessage = firstError as string;
        }
      }
      notifications.show({
        title: "Registration Failed",
        message: errorMessage,
        color: "red",
      });
      throw error;
    }
  };

  const authState: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    register,
    fetchUser,
  };

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
