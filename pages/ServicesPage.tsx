
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    id: 'diag',
    icon: '🔍',
    title: 'Diagnóstico',
    subtitle: 'Análise técnica de ativos.',
    content: 'Analisamos profundamente seu histórico de anúncios, tags de rastreamento (Pixel/API) e landing pages. O objetivo é identificar onde o dinheiro está sendo desperdiçado antes de investir um único centavo novo.'
  },
  {
    id: 'estrat',
    icon: '🎯',
    title: 'Estratégia',
    subtitle: 'Públicos e canais ideais.',
    content: 'Definimos a jornada de compra do seu cliente. Escolhemos entre Google Search, Meta Ads ou Youtube Ads com base em onde seu público realmente toma decisões. Criamos a oferta que para o "scroll" do usuário.'
  },
  {
    id: 'exec',
    icon: '⚙️',
    title: 'Execução',
    subtitle: 'Configuração e escala.',
    content: 'Subida de campanhas com estrutura profissional (CBO/ABO). Implementação de criativos validados e segmentações de público quente e frio. Aqui o motor começa a girar com precisão técnica.'
  },
  {
    id: 'otim',
    icon: '📊',
    title: 'Otimização',
    subtitle: 'Ajustes baseados em dados.',
    content: 'Leitura diária de métricas (CPA, ROAS, CTR). Escalamos o que funciona e cortamos o que não performa. Você recebe relatórios claros que mostram o lucro real, não apenas métricas de vaidade.'
  }
];

const ServicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(steps[0].id);

  const activeStep = steps.find(s => s.id === activeTab) || steps[0];

  return (
    <div className="bg-white">
      <div className="bg-light-gray py-16 md:py-24 border-b border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1 mb-4 bg-brand-blue/10 rounded-full text-brand-blue text-xs font-black uppercase tracking-widest">
            Performance Industrial
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-base-blue mb-4 tracking-tighter">Gestão de Tráfego</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto italic">
            Não vendemos cliques. Vendemos um sistema previsível de aquisição de clientes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        {/* Interactive step navigation */}
        <div className="mb-20">
          <h2 className="text-center text-2xl font-black mb-12 uppercase tracking-widest text-gray-400">O Ciclo de Inteligência</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`text-left p-6 rounded-3xl transition-all border-2 ${
                  activeTab === step.id 
                    ? 'border-brand-blue bg-brand-blue/5 shadow-lg scale-105' 
                    : 'border-transparent bg-light-gray hover:bg-gray-100'
                }`}
              >
                <div className="text-3xl mb-4">{step.icon}</div>
                <h3 className="font-black text-base-blue uppercase text-xs tracking-widest mb-1">{step.title}</h3>
                <p className="text-xs text-gray-400 font-bold">{step.subtitle}</p>
              </button>
            ))}
          </div>

          <div className="bg-base-blue rounded-[40px] p-8 md:p-12 text-white min-h-[300px] flex items-center">
            <div className="max-w-3xl">
              <span className="text-brand-blue text-xs font-black uppercase tracking-widest mb-4 block">Fase de {activeStep.title}</span>
              <h3 className="text-3xl md:text-4xl font-black mb-6 italic">{activeStep.title}</h3>
              <p className="text-lg text-gray-300 leading-relaxed font-medium">
                {activeStep.content}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/contato" className="inline-block bg-brand-blue text-white font-black py-5 px-12 rounded-2xl hover:bg-base-blue transition-all uppercase tracking-widest shadow-xl shadow-blue-500/20">
            Quero este método na minha empresa
          </Link>
        </div>
      </div>
    </div>
  );
};

// Added missing default export
export default ServicesPage;
