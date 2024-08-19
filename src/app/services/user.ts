const API_URL = 'https://chat-app-backend-11ku.onrender.com';
import { toast } from 'react-hot-toast';

interface LoginResponse {
  token: string;
  username: string;
  userId: string;
}

interface SignupResponse {
  message: string;
  token: string;
  userId: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        toast.error(`Invalid Email or Password`, {
            className: 'bg-orange-600 text-white text-xl font-semibold px-4 py-3 rounded-lg',
            icon: '🫠',
            duration: 5000,
          });
      throw new Error('Login failed');
    }

    const data = await response.json();
    toast.success('Login Succesfull !!', {
        className: 'bg-green-600 text-xl text-white font-semibold px-6 rounded-lg',
        icon: '😊',
        duration: 5000,
      });
    return data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (username: string, email: string, password: string): Promise<SignupResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
        toast.error('Username or Email already in use !!', {
            className: 'bg-orange-600 text-xl text-white font-semibold px-6 rounded-lg',
            icon: '🫠',
            duration: 5000,
          });
      throw new Error('Signup failed');
    }

    const data = await response.json();
    toast.success(`Welcome to EASE ${username.toUpperCase()}`, {
        className: 'bg-green-600 text-xl text-white font-semibold px-6 rounded-lg',
        icon: '😊',
        duration: 5000,
      });
    localStorage.setItem('user', username);
    return data;
  } catch (error) {
    throw error;
  }
};
