import {
  getCurrentUser,
  login,
  signUp,
  SignUpRequest,
  UserDTO,
} from "@/client";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  userDetails: UserDTO | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setToken: (token: string | null) => void;
  setUserDetails: (userDetails: UserDTO | null) => void;
  loginUser: (username: string, password: string) => Promise<void>;
  signUpUser: (data: SignUpRequest) => Promise<void>;
  logout: () => void;
  refreshUserDetails: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  token: localStorage.getItem("sessionToken") || null,
  userDetails:
    JSON.parse(localStorage.getItem("userDetails") || "null") || null,
  isLoading: false,
  error: null,

  setToken: (token) => {
    if (token) {
      localStorage.setItem("sessionToken", token);
    } else {
      localStorage.removeItem("sessionToken");
    }
    set({ token });
  },

  setUserDetails: (userDetails) => {
    if (userDetails) {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    } else {
      localStorage.removeItem("userDetails");
    }
    set({ userDetails });
  },

  loginUser: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await login({ body: { username, password } });

      if (response.data?.accessToken && response.data.user) {
        set((state) => ({
          ...state,
          token: response.data.accessToken,
          userDetails: response.data.user,
          isLoading: false,
        }));
        localStorage.setItem("sessionToken", response.data.accessToken);
        localStorage.setItem("userDetails", JSON.stringify(response.data.user));
      } else {
        throw new Error("Данные авторизации отсутствуют.");
      }
    } catch (error) {
      set({ isLoading: false, error: "Ошибка логина." });
      throw error;
    }
  },

  signUpUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await signUp({ body: data });
      if (response.data?.accessToken && response.data?.user) {
        set({
          token: response.data?.accessToken,
          userDetails: response.data?.user,
          isLoading: false,
          error: null,
        });
        localStorage.setItem("sessionToken", response.data.accessToken);
        localStorage.setItem("userDetails", JSON.stringify(response.data.user));
      } else {
        set({
          isLoading: false,
          error: "Регистрация успешна. Войдите в аккаунт.",
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: "Регистрация не удалась.",
      });
      throw new Error("Sign-up failed");
    }
  },

  logout: () => {
    set({ token: null, userDetails: null, error: null });
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("userDetails");
  },

  refreshUserDetails: async () => {
    const { token, setUserDetails, logout } = get();
    if (!token) return;

    try {
      const response = await getCurrentUser();
      if (response.data) {
        setUserDetails(response.data);
      }
    } catch (error) {
      logout();
    }
  },
}));
