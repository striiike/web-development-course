import { browser } from "$app/environment";
import * as authApi from "$lib/apis/authApi.js";

const USER_KEY = "user";
const TOKEN_KEY = "token";

let user = $state(null);
let token = $state(null);

if (browser) {
  const storedUser = localStorage.getItem(USER_KEY);
  const storedToken = localStorage.getItem(TOKEN_KEY);

  if (storedUser) {
    user = JSON.parse(storedUser);
  }
  if (storedToken) {
    token = storedToken;
  }
}

const useAuthState = () => {
  return {
    get user() {
      return user;
    },
    get token() {
      return token;
    },
    login: async (email, password) => {
      const response = await authApi.login({ email, password });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      user = data.user;
      token = data.token;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
    },
    register: async (email, password) => {
      const response = await authApi.register({ email, password });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      user = data;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    logout: async () => {
      user = null;
      token = null;
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/";
    },
  };
};

export { useAuthState };