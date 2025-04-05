
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Navbar from '@/components/Navbar';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar isDark={false} />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4 text-gray-900 dark:text-white">404</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">The page you're looking for doesn't exist.</p>
            <Link to="/">
              <Button className="bg-[#788be4] hover:bg-[#6678d0] button-glow">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default NotFound;
