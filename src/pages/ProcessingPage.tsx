
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';

const ProcessingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(26);

  // Simulate progress increasing over time
  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);
    
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            // Redirect to results page
            navigate('/results');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    const timeInterval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timeInterval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen dark:bg-gray-900">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar isDark={true} />
        <main className="flex-grow p-6">
          <div className="w-full max-w-4xl mx-auto mt-8">
            <h1 className="text-2xl font-bold text-center mb-8 text-white">
              {t('check_domain_focus')}
            </h1>
            
            <Tabs value="generate" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="url" disabled>{t('site_url')}</TabsTrigger>
                <TabsTrigger value="filters" disabled>{t('filters')}</TabsTrigger>
                <TabsTrigger value="generate">{t('processing')}</TabsTrigger>
              </TabsList>
              
              <Card className="bg-black/40 backdrop-blur-lg border-gray-800 text-white dark:bg-gray-800/60 dark:border-gray-700 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Progress value={progress} className="w-full h-8 mb-4" />
                    <p className="text-gray-300 mb-2">
                      {t('step')} {step}/5, {t('progress')} {progress}%, {t('next')} {timeRemaining} sec
                    </p>
                    <p className="text-gray-400 text-sm mt-4">
                      {t('converting_content')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProcessingPage;
