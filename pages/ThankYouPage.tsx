
import React from 'react';
import { Link } from 'react-router-dom';

const ThankYouPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white py-20">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-brand-green/10 rounded-full text-brand-green">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <span className="text-brand-blue font-black text-xs uppercase tracking-[0.4em] mb-4 block">Sucesso</span>
          
          <h1 className="text-5xl md:text-7xl font-black text-base-blue mb-8 leading-tight tracking-tighter italic">
            Seu formulário foi <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green">preenchido e enviado!</span>
          </h1>
          
          <p className="text-xl text-gray-500 mb-12 italic leading-relaxed">
            Obrigado pelo interesse. Já recebemos suas informações e nossa equipe entrará em contato em breve para agendar o seu diagnóstico gratuito.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/" 
              className="bg-base-blue text-white font-black px-10 py-5 rounded-2xl hover:bg-brand-blue transition-all shadow-xl shadow-blue-500/10 uppercase tracking-[0.2em] text-sm"
            >
              Voltar para a Home
            </Link>
            <a 
              href="https://wa.me/5521965087731?text=Olá Adailton! Acabei de enviar meu formulário de diagnóstico." 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-brand-green text-white font-black px-10 py-5 rounded-2xl hover:bg-opacity-90 transition-all shadow-xl shadow-green-500/10 uppercase tracking-[0.2em] text-sm"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
