
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
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.891-11.891 3.181 0 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.558-5.332 11.892-11.892 11.892-1.99 0-3.833-.52-5.468-1.426L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.591 6.182 0 10.82-4.638 10.82-10.822 0-6.182-4.638-10.82-10.82-10.82-6.18 0-10.82 4.638-10.82 10.82 0 2.25.655 4.354 1.849 6.262l-1.2 4.368 4.46-1.184zm6.157-8.503c-.195-.1-1.148-.566-1.326-.63- .178-.063-.307-.1-.436.099-.13.198-.501.63-.614.757-.113.126-.227.142-.422.043-.195-.1-.836-.31-1.592-.984-.589-.523-.985-1.175-1.1-1.373-.113-.198-.012-.307.087-.405.099-.099.198-.248.297-.372.099-.126.13-.198.198-.33.063-.133.031-.248-.016-.347-.047-.099-.436-1.043-.599-1.426-.164-.38-.33-.327-.459-.327-.126 0-.27.016-.409.016-.138 0-.369.047-.565.247-.194.198-.744.728-.744 1.772 0 1.043.76 2.061.864 2.207.104.146 1.492 2.308 3.616 3.202.52.217.93.348 1.245.447.52.164 1.003.142 1.382.087.436-.063 1.148-.477 1.309-.926.164-.448.164-.83.113-.926-.048-.098-.178-.146-.373-.245z"/>
          </svg>
          <div className="ml-4 flex flex-col items-start leading-none">
            <span className="font-bold">Consultoria Gratuita</span>
            <span className="text-xs">Clique e fale conosco</span>
          </div>
        </a>

        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
