import "@/styles/globals.css";
import { AuthProvider } from "@/templates/auth/contexts/AuthContext"; // <-- Import AuthProvider instead of AuthContext
import { SessionProvider } from "next-auth/react"; 
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { fontSans, fontMono } from "@/config/fonts";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) { 
  return (
    <SessionProvider session={session}>
      <AuthProvider> {/* <-- Use AuthProvider here */}
        <NextUIProvider>
          <NextThemesProvider>
            <Component {...pageProps} />
          </NextThemesProvider>
        </NextUIProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
