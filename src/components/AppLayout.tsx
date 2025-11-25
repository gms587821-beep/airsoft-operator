import { ReactNode } from "react";
import Navigation from "@/components/Navigation";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="max-w-screen-xl mx-auto px-4 pt-4">
        {children}
      </main>
      <Navigation />
    </div>
  );
};
