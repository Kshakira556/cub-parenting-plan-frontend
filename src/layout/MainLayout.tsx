import type { ReactNode } from "react";
import Navbar from "../components/Navbar";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
