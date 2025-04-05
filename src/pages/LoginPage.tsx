import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
    const { t } = useLanguage();
    const { login } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await login(email, password);

            if (response.user) {
                toast({
                    title: t('login_success') || "Login successful",
                    description: t('welcome_back') || "Welcome back to Vextor",
                    variant: "default",
                });

                navigate('/app');
            } else {
                throw new Error(response.data?.message || "Login failed");
            }
        } catch (error: any) {
            let errorMessage = t('login_failed') || "Login failed";

            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast({
                title: t('error') || "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-white">
            <div className="relative z-10 flex flex-col min-h-screen w-full">
                <Navbar isDark={false} />
                <main className="flex-grow flex items-center justify-center py-20 px-4">
                    <div className="w-full max-w-md">
                        <Card className="shadow-lg border border-gray-200 bg-[#a2bae6]">
                            <CardHeader className="space-y-2">
                                <CardTitle className="text-2xl font-bold text-center text-gray-900">
                                    {t('login') || "Login"}
                                </CardTitle>
                                <CardDescription className="text-center text-gray-600">
                                    {t('login_subtitle') || "Enter your credentials to access your account"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                            {t('email') || "Email"}
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full h-12"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                            {t('password') || "Password"}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="w-full pr-10 h-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-[#788be4] hover:bg-[#6678d0] text-white button-glow shadow-md hover:shadow-lg h-12 text-base font-medium"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t('logging_in') || "Logging in..."}
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <LogIn size={20} />
                                                {t('login') || "Login"}
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4 pb-6">
                                <div className="text-sm text-center text-gray-600 w-full">
                                    {t('dont_have_account') || "Don't have an account?"}{' '}
                                    <Link to="/register" className="text-[#788be4] hover:underline font-medium">
                                        {t('register') || "Register"}
                                    </Link>
                                </div>
                                <div className="text-xs text-center text-gray-500 w-full">
                                    By logging in, you agree to our{' '}
                                    <a href="#" className="text-[#788be4] hover:underline">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-[#788be4] hover:underline">
                                        Privacy Policy
                                    </a>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default LoginPage;
