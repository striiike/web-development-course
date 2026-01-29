import { browser } from '$app/environment';
import * as authApi from '../apis/authApi.js';

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

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

export const useAuthState = () => {
  return {
    get user() {
      return user;
    },
    get token() {
      return token;
    },
    login: async (email, password) => {
      try {
        const response = await authApi.login(email, password);
        if (response.token && response.user) {
          user = response.user;
          token = response.token;
          if (browser) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            localStorage.setItem(TOKEN_KEY, token);
          }
          return { success: true, message: 'Login successful!' };
        } else {
          return { success: false, message: response.message || 'Login failed' };
        }
      } catch (error) {
        return { success: false, message: error.message };
      }
    },
    register: async (email, password) => {
      try {
        const response = await authApi.register(email, password);
        return { success: true, message: response.message };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },
    logout: () => {
      user = null;
      token = null;
      if (browser) {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    },
  };
};
