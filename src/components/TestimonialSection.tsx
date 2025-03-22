
import { useEffect, useState } from "react";
import { useLanguage } from '@/contexts/LanguageContext';
import { QuoteIcon } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { UseEmblaCarouselType } from "embla-carousel-react";

const TestimonialSection = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaApi, setEmblaApi] = useState<UseEmblaCarouselType[1] | null>(null);
  
  const testimonials = [
    {
      quote: "This is the most actionable SEO audit I've ever seen.",
      author: "Anna",
      position: "Head of Content at SaaS startup"
    },
    {
      quote: "Vextor showed us what to delete. We saw rankings improve in a week.",
      author: "Marek",
      position: "SEO Consultant"
    },
    {
      quote: "I finally understand how Google sees our site's structure.",
      author: "Tina",
      position: "Freelance SEO"
    }
  ];

  // Update active index when the carousel changes
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    // Call once to set initial index
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="py-20 border-t border-gray-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-purple-900 text-purple-300 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-4">
            What SEOs are saying
          </h2>
        </div>

        <div className="relative">
          <Carousel 
            className="w-full max-w-4xl mx-auto"
            opts={{
              loop: true,
              align: "center",
            }}
            setApi={setEmblaApi}
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="h-full flex items-center justify-center px-4 md:px-10">
                    <div className="text-center">
                      <QuoteIcon className="mx-auto h-10 w-10 text-vextor-500 mb-6 opacity-70" />
                      <p className="text-2xl md:text-3xl font-medium text-zinc-50 mb-6 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="mt-6">
                        <p className="font-medium text-vextor-500">— {testimonial.author}</p>
                        <p className="text-sm text-zinc-400">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (emblaApi) {
                      emblaApi.scrollTo(idx);
                    }
                  }}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx 
                      ? 'bg-vextor-500' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
