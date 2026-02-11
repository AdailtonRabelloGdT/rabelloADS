
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from "@vercel/speed-insights/react";
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ConsultingPage from './pages/ConsultingPage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <SpeedInsights />
      <div className="flex flex-col min-h-screen relative">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicos/gestao-de-trafego" element={<ServicesPage />} />
            <Route path="/servicos/consultoria-personalizada" element={<ConsultingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />
          </Routes>
        </main>
        
        {/* Persistent WhatsApp Floating Button */}
        <a 
          href="https://wa.me/5521965087731?text=Olá Adailton! Gostaria de iniciar uma consultoria gratuita com a Rabello Ads." 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-[999] flex items-center bg-brand-green text-white px-5 py-4 rounded-full shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] hover:scale-110 active:scale-95 transition-all group border-4 border-white"
        >
          <div className="absolute inset-0 rounded-full bg-brand-green animate-ping opacity-20 group-hover:hidden"></div>
          <svg className="w-7 h-7 relative z-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.891-11.891 3.181 0 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.402 0 6.556-5.332 11.891-11.891 11.891-2.01 0-3.987-.512-5.747-1.481l-6.143 1.613zm6.23-3.965c1.611.956 3.197 1.441 4.885 1.441 5.405 0 9.803-4.402 9.803-9.806 0-2.619-1.021-5.083-2.872-6.936-1.854-1.851-4.321-2.872-6.931-2.872-5.412 0-9.809 4.402-9.809 9.806 0 1.761.472 3.256 1.405 4.876l-1.05 3.829 3.969-1.038zm10.231-6.845c-.328-.163-1.94-.959-2.241-1.069-.301-.11-.52-.163-.738.163-.219.327-.847 1.069-1.038 1.288-.192.218-.383.245-.71.082-.327-.163-1.38-.509-2.63-1.624-.972-.867-1.628-1.938-1.819-2.265-.192-.327-.02-.504.143-.667.146-.147.327-.381.49-.572.163-.191.218-.327.327-.546.109-.218.055-.409-.028-.572-.082-.163-.738-1.773-1.011-2.428-.266-.64-.541-.546-.738-.555-.19-.01-.409-.012-.627-.012s-.572.082-.872.409c-.301.327-1.146 1.119-1.146 2.729s1.173 3.165 1.336 3.383c.163.218 2.31 3.527 5.59 4.953.78.339 1.39.542 1.867.692.784.249 1.496.214 2.06.13.629-.094 1.94-.791 2.213-1.555.273-.764.273-1.418.191-1.555-.081-.137-.3-.219-.628-.382z"/>
          </svg>
          <span className="max-w-xs ml-3 transition-all font-bold whitespace-nowrap uppercase tracking-widest text-[11px] hidden md:inline-block">
            Consultoria gratuita
          </span>
        </a>
        
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
