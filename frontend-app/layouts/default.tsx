import React, { ReactNode } from "react";
import { Head } from "./head";
import { Navbar } from "@/components/navbar";
import Sidebar from "../components/sidebar"; 
import { useTheme } from 'next-themes'; 

interface DefaultLayoutProps {
  children: ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  const { theme } = useTheme(); 

  const backgroundClass = theme === 'dark' ? 'bg-desktop' : 'bg-desktop';
  
  return (
    <div className={backgroundClass + " min-h-screen w-full"}>
        <Head />
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="container mx-auto max-w-7xl px-6 flex-grow">
          <div className="flex flex-grow">
            <div className="flex-grow">{children}</div>
          </div>
        </main>
      </div>
      <footer className="w-full flex items-center justify-center py-3"></footer>
    </div>
  );
}

export default DefaultLayout;
