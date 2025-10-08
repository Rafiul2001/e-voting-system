import { create } from "zustand";
import axios from "axios";
import * as jwt_decode from "jwt-decode";

const API_BASE_URL = "http://localhost:3000/api/v1/admin";

export type TAdmin = {
  userName: string;
  userEmail: string;
};

type JWTPayload = {
  userId: string;
  iat: number;
  exp: number;
};

type TAuthStore = {
  admin: TAdmin | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (userName: string, password: string) => Promise<void>;
  logout: (isAuto?: boolean) => void;
  setAdmin: (admin: TAdmin, token: string) => void;
  checkTokenExpiry: () => void;
};

export const useAuthStore = create<TAuthStore>((set, get) => ({
  // Initialize from localStorage to persist login after refresh
  admin: JSON.parse(localStorage.getItem("adminInfo") || "null"),
  token: localStorage.getItem("adminToken"),
  loading: false,
  error: null,

  login: async (userName: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        userName,
        password,
      });
      const { token, data } = response.data;

      set({ admin: data, token, loading: false });
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminInfo", JSON.stringify(data));

      get().checkTokenExpiry();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Login failed",
          loading: false,
        });
      } else {
        set({
          error: "Login failed due to an unexpected error",
          loading: false,
        });
      }
    }
  },

  logout: (isAuto = false) => {
    set({ admin: null, token: null });
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    if (isAuto) {
      alert("Session expired. Please login again.");
    }
  },

  setAdmin: (admin: TAdmin, token: string) => {
    set({ admin, token });
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminInfo", JSON.stringify(admin));
    get().checkTokenExpiry();
  },

  checkTokenExpiry: () => {
    const token = get().token || localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const decoded = jwt_decode.jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      const timeLeft = decoded.exp - currentTime;

      if (timeLeft <= 0) {
        get().logout(true); // auto logout
      } else {
        // Set a timer to auto logout when token expires
        setTimeout(() => get().logout(true), timeLeft * 1000);
      }
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      get().logout(true);
    }
  },
}));

// Immediately check token expiry on app start
useAuthStore.getState().checkTokenExpiry();
