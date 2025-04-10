import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Label } from '@/components/ui/label';

const RegisterPage = () => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: displayName,
                    },
                },
            });

            if (error) throw error;

            if (data) {
                toast({
                    title: t('registration_success') || "Registration successful",
                    description: t('check_email') || "Please check your email to confirm your account",
                    variant: "default",
                });

                navigate('/login');
            }
        } catch (error: any) {
            let errorMessage = t('registration_failed') || "Registration failed";

            if (error.message) {
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
        <div className="relative min-h-screen bg-white dark:bg-gray-900">
            <div className="relative z-10 flex flex-col min-h-screen w-full">
                <Navbar isDark={false} />
                <main className="flex-grow flex items-center justify-center py-32 px-4">
                    <div className="w-full max-w-md">
                        <Card className="shadow-lg border border-[#ff6b6b]/30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                            <CardHeader className="space-y-2">
                                <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                                    {t('register') || "Register"}
                                </CardTitle>
                                <CardDescription className="text-center text-gray-600 dark:text-gray-300">
                                    {t('register_subtitle') || "Create your account to get started"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="displayName" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {t('display_name') || "Display Name"}
                                        </Label>
                                        <Input
                                            id="displayName"
                                            type="text"
                                            placeholder={t('display_name_placeholder') || "Your name"}
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            required
                                            className="w-full h-12 bg-transparent border-gray-300 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {t('email') || "Email"}
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full h-12 bg-transparent border-gray-300 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
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
                                                className="w-full pr-10 h-12 bg-transparent border-gray-300 dark:border-gray-600 dark:text-white"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white button-glow shadow-md hover:shadow-lg h-12 text-base font-medium"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t('registering') || "Registering..."}
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <UserPlus size={20} />
                                                {t('register') || "Register"}
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4 pb-6">
                                <div className="text-sm text-center text-gray-600 dark:text-gray-300 w-full">
                                    {t('already_have_account') || "Already have an account?"}{' '}
                                    <Link to="/login" className="text-[#ff6b6b] hover:underline font-medium">
                                        {t('login') || "Login"}
                                    </Link>
                                </div>
                                <div className="text-xs text-center text-gray-500 dark:text-gray-400 w-full">
                                    By registering, you agree to our{' '}
                                    <a href="#" className="text-[#ff6b6b] hover:underline">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-[#ff6b6b] hover:underline">
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

export default RegisterPage; 