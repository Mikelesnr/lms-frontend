"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";
import Cookies from "js-cookie";
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
      const { data } = await api.get<User>("/api/auth/user");
      setUser(data);
    } catch {
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
      const { data } = await api.post<{ token: string }>(
        "/api/auth/login",
        credentials
      );
      Cookies.set("auth_token", data.token, {
        secure: true,
        sameSite: "strict",
        expires: 7, // Optional: token expires in 7 days
      });
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
      await api.post("/api/auth/logout"); // Optional: revoke token server-side
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      Cookies.remove("auth_token");
      setUser(null);
      notifications.show({
        title: "Logged Out",
        message: "You have been successfully logged out.",
        color: "blue",
      });
      router.push("/");
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post("/api/auth/register", userData);
      const { token } = response.data;

      Cookies.set("auth_token", token, {
        secure: true,
        sameSite: "strict",
        expires: 7,
      });

      await fetchUser();

      notifications.show({
        title: "Registration Successful! ✅",
        message: "Your account has been created. You are now logged in.",
        color: "teal",
      });

      return response.data;
    } catch (error: any) {
      console.error("Registration failed:", error);
      let errorMessage = "Registration failed. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors).flat()[0];
        errorMessage = firstError as string;
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
