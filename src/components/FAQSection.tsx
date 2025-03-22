
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

const FAQSection = () => {
  const { t } = useLanguage();
  
  const faqs = [
    {
      question: "📐 How is Site Focus and Site Radius calculated?",
      answer: (
        <div className="space-y-4">
          <p>Vextor AI uses embedding models (AI models that turn content into vectors) to understand the semantic meaning of each page on your site.</p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li>Each page becomes a data point in a multi-dimensional space.</li>
            <li>These points are analyzed in terms of how close or far they are from each other (semantically).</li>
            <li>Based on this, Vextor calculates:</li>
          </ul>
        </div>
      )
    },
    {
      question: "📊 What Site Focus and Site Radius mean?",
      answer: (
        <div className="space-y-4">
          <div>
            <p className="font-medium">🧠 Site Focus (0–100%)</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Measures how topically focused your website is.</li>
              <li>A higher score means your content stays on topic — and likely ranks better for that topic.</li>
              <li>A lower score suggests scattered content that may confuse search engines.</li>
            </ul>
          </div>
          
          <div>
            <p className="font-medium">🌀 Site Radius</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Measures how spread out your content is in semantic space.</li>
              <li>A lower radius = tighter topical coverage (good).</li>
              <li>A higher radius = content is semantically distant from the main theme (potentially off-topic).</li>
            </ul>
          </div>
          
          <p>👉 These two are inversely correlated: high focus = low radius.</p>
        </div>
      )
    },
    {
      question: "🧩 What can I do with data from Vextor?",
      answer: (
        <div className="space-y-4">
          <div>
            <p className="font-medium">Identify irrelevant content</p>
            <p>Use Site Radius + cluster distance to spot pages far from your main theme.</p>
          </div>
          
          <div>
            <p className="font-medium">Clean your content strategy</p>
            <p>Delete or rewrite content that doesn't support your site's core topics.</p>
          </div>
          
          <div>
            <p className="font-medium">Improve topical authority</p>
            <p>Focus new content around strong clusters. Expand what's working.</p>
          </div>
          
          <div>
            <p className="font-medium">Audit and report</p>
            <p>Use reports in client audits or stakeholder presentations to show content health.</p>
          </div>
          
          <div>
            <p className="font-medium">Compare domains (coming soon)</p>
            <p>Benchmark your Site Focus vs. competitors in your niche.</p>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <section id="faq" className="py-20 border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="bg-blue-900 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-4">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-50">
            Frequently Asked Questions
          </h2>
          <p className="text-xl max-w-2xl mx-auto text-zinc-400">
            Learn more about how Vextor can help your SEO strategy
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-b border-gray-800 py-2"
            >
              <AccordionTrigger className="text-left font-medium text-lg text-zinc-50 hover:text-zinc-200 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
