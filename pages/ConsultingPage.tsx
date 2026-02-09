
import React from 'react';
import { Link } from 'react-router-dom';

const ConsultingPage: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="bg-brand-amber/10 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-base-blue mb-4 tracking-tighter">Consultoria Estratégica</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">Clareza para quem não quer perder tempo nem dinheiro.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            { title: "Diagnóstico", desc: "Onde o dinheiro está fugindo?", color: "border-brand-red" },
            { title: "Plano de Ação", desc: "O que fazer nos próximos 90 dias.", color: "border-brand-blue" },
            { title: "Validação", desc: "A sua oferta realmente funciona?", color: "border-brand-green" }
          ].map((item, i) => (
            <div key={i} className={`border-l-4 ${item.color} p-8 bg-light-gray rounded-r-2xl`}>
              <h3 className="text-2xl font-black text-base-blue mb-2 italic">{item.title}</h3>
              <p className="text-gray-500 italic font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-black text-base-blue mb-6">O Fim da "Cegueira Digital"</h2>
              <p className="text-gray-600 leading-relaxed italic mb-6">
                Muitas empresas investem em tráfego sem ter um funil validado. A consultoria serve para ajustar a base antes de acelerar. Se você não está pronto, eu te direi.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 font-bold text-brand-amber">
                  <span>✨</span> <span>Foco em ROI Real</span>
                </div>
                <div className="flex items-center space-x-3 font-bold text-brand-amber">
                  <span>✨</span> <span>Análise de Conversão (CRO)</span>
                </div>
                <div className="flex items-center space-x-3 font-bold text-brand-amber">
                  <span>✨</span> <span>Escalabilidade Estrutural</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 bg-base-blue p-8 rounded-3xl text-white">
              <div className="text-center">
                <div className="text-5xl mb-4">💎</div>
                <p className="font-bold text-xl mb-4">Entrega Premium</p>
                <ul className="text-sm text-gray-400 space-y-3">
                  <li>• Sessão de 90min via Meet</li>
                  <li>• Dashboard de Sugestões</li>
                  <li>• Roadmap de Crescimento</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center pt-10">
            <Link to="/contato" className="bg-brand-amber text-white font-black py-5 px-16 rounded-2xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all uppercase tracking-widest">
              Agendar Consultoria
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultingPage;
