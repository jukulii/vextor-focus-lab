
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleTryForFree = () => {
    if (isAuthenticated) {
      navigate('/app');
    } else {
      navigate('/login');
    }
  };
  
  return (
    <section className="pt-48 pb-24 md:pt-64 md:pb-32 relative overflow-hidden bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center w-full max-w-3xl mx-auto z-10">
            <div className="mb-6 inline-block">
              <span className="bg-[#ff6b6b]/20 text-[#ff6b6b] dark:bg-[#ff6b6b]/10 dark:text-[#ff8c8c] px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center border border-[#ff6b6b]/30">
                <Sparkles className="w-4 h-4 mr-2" />
                Empower Your Content Strategy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 fade-in leading-tight">
              {language === 'pl' ? 'Sprawdź, czy Twoje treści są tak spójne, jak Ci się wydaje' : 'Analyze your website topical focus'}
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 fade-in stagger-1 max-w-2xl mx-auto text-balance">
              {language === 'pl' ? 'Zoptymalizuj treść. Zbuduj autorytet. Wygraj wyścig o widoczność.' : t('hero_subtitle')}
            </p>
            <div className="space-x-4 fade-in stagger-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleTryForFree}
                className="border-[#ff6b6b] text-[#ff6b6b] dark:border-[#ff8c8c] dark:text-[#ff8c8c] hover:bg-[#ff6b6b]/10 px-8 py-6 text-lg transition-all duration-300"
              >
                {language === 'pl' ? 'Wypróbuj za darmo' : 'Try For Free'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
