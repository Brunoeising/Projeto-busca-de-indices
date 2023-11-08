import { createContext, useEffect, useState, ReactNode } from "react"; // 1. Import ReactNode
import { setCookie, parseCookies } from 'nookies';
import Router from 'next/router';

import { recoverUserInformation, signInRequest } from "../services/auth";
import { api } from "../services/api";

type User = {
  name: string;
  email: string;
  avatar_url: string;
}

type SignInData = {
  email: string;
  password: string;
}

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;  // <--- Allow the user to be null
    signIn: (data: SignInData) => Promise<void>
  }
  

// 2. Define a type for the props of AuthProvider
type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType)

// 3. Use that type in the AuthProvider function
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { '@skylab:access_token': token } = parseCookies();

    if (token) {
      recoverUserInformation().then(response => {
        setUser(response.user);
      });
    }
  }, []);

  async function signIn({ email, password }: SignInData) {
    const { token, user } = await signInRequest({
      email,
      password,
    });

    setCookie(undefined, 'nextauth.token', token, {
      maxAge: 60 * 60 * 1, // 1 hour
    });

    api.defaults.headers['Authorization'] = `Bearer ${token}`;

    setUser(user);

    Router.push('/home');
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}
