import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import AppPage from "./pages/AppPage";
import SitemapsPage from "./pages/SitemapsPage";
import ProcessingPage from "./pages/ProcessingPage";
import ResultsPage from "./pages/ResultsPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from '@/contexts/AuthContext';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedAuthRoute from '@/components/ProtectedAuthRoute';

const queryClient = new QueryClient();

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
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={
                  <ProtectedAuthRoute>
                    <LoginPage />
                  </ProtectedAuthRoute>
                } />
                <Route path="/register" element={
                  <ProtectedAuthRoute>
                    <RegisterPage />
                  </ProtectedAuthRoute>
                } />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/app" element={<AppPage />} />
                  <Route path="/sitemaps" element={<SitemapsPage />} />
                  <Route path="/processing" element={<ProcessingPage />} />
                  <Route path="/results" element={<ResultsPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
