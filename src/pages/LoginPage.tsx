
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
                throw new Error(response.data.message || "Login failed");
            }
        } catch (error) {
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
        <div className="relative min-h-screen w-full">
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="flex justify-center mb-8">
                        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            <img
                                src="/lovable-uploads/5634c72d-5100-496b-ade4-9da06c56eda0.png"
                                alt="Vextor Logo"
                                className="h-20 w-auto object-contain mix-blend-multiply"
                            />
                            <span className="text-white font-bold text-2xl">
                                Vextor
                            </span>
                        </Link>
                    </div>

                    <Card className="bg-black/40 backdrop-blur-lg border-gray-800 text-white shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl text-white">{t('login') || "Login"}</CardTitle>
                            <CardDescription className="text-gray-300">{t('login_subtitle') || "Enter your credentials to access your account"}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-200">
                                        {t('email') || "Email"}
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-gray-800/60 border-gray-700 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-200">
                                        {t('password') || "Password"}
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full pr-10 bg-gray-800/60 border-gray-700 text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-vextor-600 hover:bg-vextor-700 text-white button-glow shadow-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {t('logging_in') || "Logging in..."}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <LogIn size={18} />
                                            {t('login') || "Login"}
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-2">
                            <div className="text-xs text-center text-gray-400">
                                {t('dont_have_account') || "Don't have an account?"}
                                <Link to="/register" className="text-vextor-400 hover:underline ml-1">
                                    {t('register') || "Register"}
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
