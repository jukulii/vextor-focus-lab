import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isSessionValid } = useAuth();
    const { t } = useLanguage();
    const { toast } = useToast();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!isAuthenticated) {
                    toast({
                        title: t('Info'),
                        description: t('auth.pleaseLogin'),
                        variant: "default",
                    });
                } else if (!isSessionValid()) {
                    toast({
                        title: t('Error'),
                        description: t('auth.sessionExpired'),
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [isAuthenticated, isSessionValid, toast, t]);

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b6b]"></div>
            </div>
        );
    }

    if (!isAuthenticated || !isSessionValid()) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 