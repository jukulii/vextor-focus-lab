
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import AppPage from "./pages/AppPage";
import ResultsPage from "./pages/ResultsPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from '@/contexts/AuthContext';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedAuthRoute from '@/components/ProtectedAuthRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Initialize dark mode based on saved preference or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('vextor-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/login"
                  element={
                    <ProtectedAuthRoute>
                      <LoginPage />
                    </ProtectedAuthRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <ProtectedAuthRoute>
                      <RegisterPage />
                    </ProtectedAuthRoute>
                  }
                />
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <AppPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results"
                  element={
                    <ProtectedRoute>
                      <ResultsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
