
import React from 'react';
import { Link } from 'react-router-dom';
import { RabelloLogo } from '../components/Header';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 bg-light-gray">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-blue/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 mb-6 bg-brand-blue/10 rounded-full">
              <span className="text-brand-blue text-sm font-bold uppercase tracking-wider">Estratégia e Transparência</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-base-blue leading-tight tracking-tighter">
              Cresça com <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-green to-brand-amber">Método</span>, não com sorte.
            </h1>
            <p className="mt-8 text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Gestão de tráfego, consultoria e inteligência de dados para empresas que buscam resultados de longo prazo.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link to="/servicos/gestao-de-trafego" className="w-full sm:w-auto bg-base-blue text-white font-bold py-4 px-10 rounded-xl shadow-2xl shadow-blue-500/20 hover:-translate-y-1 transition-all">
                Nossos Serviços
              </Link>
              <Link to="/blog" className="w-full sm:w-auto bg-white border border-gray-200 text-base-blue font-bold py-4 px-10 rounded-xl hover:bg-gray-50 transition-all">
                Acessar Blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Identity Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 md:order-1 flex justify-center">
            <div className="absolute w-64 h-64 bg-brand-green/20 blur-3xl rounded-full"></div>
            <RabelloLogo className="w-64 h-64 relative z-10 drop-shadow-2xl" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-black text-base-blue mb-6">O Triângulo de Penrose</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Nossa marca representa a união inseparável de três pilares fundamentais. No marketing digital, assim como na geometria impossível, um pilar sustenta o outro para criar um ciclo de crescimento contínuo.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-brand-blue/5 transition-colors">
                <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
                <span className="font-bold text-base-blue">Transparência Radical</span>
              </div>
              <div className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-brand-green/5 transition-colors">
                <div className="w-3 h-3 rounded-full bg-brand-green"></div>
                <span className="font-bold text-base-blue">Conhecimento Aplicado</span>
              </div>
              <div className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-brand-amber/5 transition-colors">
                <div className="w-3 h-3 rounded-full bg-brand-amber"></div>
                <span className="font-bold text-base-blue">Estratégia Sob Medida</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-base-blue py-24 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Soluções que entregamos</h2>
            <div className="w-20 h-1 bg-brand-blue mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Gestão de Tráfego", desc: "Campanhas otimizadas para ROAS e escala.", color: "bg-brand-blue" },
              { title: "Consultoria", desc: "Análise estratégica de funil e conversão.", color: "bg-brand-amber" },
              { title: "Educação", desc: "Conteúdo para capacitar sua equipe.", color: "bg-brand-green" }
            ].map((s, i) => (
              <div key={i} className="bg-white/5 p-10 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group">
                <div className={`w-12 h-12 ${s.color} rounded-2xl mb-6 flex items-center justify-center text-white font-black`}>{i+1}</div>
                <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
