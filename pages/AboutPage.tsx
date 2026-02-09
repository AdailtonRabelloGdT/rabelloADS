
import React from 'react';
import { RabelloLogo } from '../components/Header';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="bg-base-blue py-24 text-white">
        <div className="container mx-auto px-6 text-center">
          <RabelloLogo className="w-20 h-20 mx-auto mb-8" />
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase">Rabello ADS</h1>
          <p className="text-xl text-brand-blue font-bold tracking-widest uppercase">Estratégia • Dados • Honestidade</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 mb-24">
            <div>
              <h2 className="text-4xl font-black text-base-blue mb-6 tracking-tight italic">Nossa Filosofia</h2>
              <p className="text-lg text-gray-500 leading-relaxed italic">
                O mercado digital é saturado de promessas vazias. Nossa missão é trazer clareza e processo industrial para o marketing. Trabalhamos com fatos, não com opiniões.
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="bg-light-gray p-6 rounded-2xl border-l-4 border-brand-green">
                <p className="font-bold text-base-blue">Missão</p>
                <p className="text-sm text-gray-500 italic">Educar e escalar negócios através de dados conscientes.</p>
              </div>
              <div className="bg-light-gray p-6 rounded-2xl border-l-4 border-brand-blue">
                <p className="font-bold text-base-blue">Visão</p>
                <p className="text-sm text-gray-500 italic">Ser a referência em transparência no mercado de tráfego pago.</p>
              </div>
            </div>
          </div>

          <h2 className="text-center text-3xl font-black mb-16 uppercase tracking-widest text-brand-amber">Nossos Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🛡️", title: "Ética Radical", desc: "Honestidade acima de qualquer fechamento de contrato." },
              { icon: "📚", title: "Educação", desc: "Ensinamos o cliente para que ele seja dono das próprias decisões." },
              { icon: "🚀", title: "Performance", desc: "Foco obsessivo em melhorar o lucro líquido da sua empresa." }
            ].map((v, i) => (
              <div key={i} className="text-center p-8 border border-gray-100 rounded-[32px] hover:border-brand-blue transition-colors">
                <div className="text-5xl mb-4">{v.icon}</div>
                <h3 className="text-xl font-black text-base-blue mb-2">{v.title}</h3>
                <p className="text-sm text-gray-400 italic font-medium">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
