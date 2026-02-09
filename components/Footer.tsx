
import React from 'react';
import { Link } from 'react-router-dom';
import { RabelloLogo } from './Header';

const Footer: React.FC = () => {
  return (
    <footer className="bg-light-gray border-t border-gray-200">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <RabelloLogo className="w-8 h-8" />
              <span className="text-xl font-black tracking-tighter text-base-blue uppercase italic">Rabello <span className="text-brand-blue">Ads</span></span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed italic">
              Transformando cliques em faturamento através de estratégia e transparência radical.
            </p>
          </div>
          <div>
            <h4 className="font-black text-base-blue uppercase tracking-widest text-xs mb-6">Navegação</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/" className="text-gray-500 hover:text-brand-blue transition-colors italic">Home</Link></li>
              <li><Link to="/sobre" className="text-gray-500 hover:text-brand-blue transition-colors italic">Sobre</Link></li>
              <li><Link to="/blog" className="text-gray-500 hover:text-brand-blue transition-colors italic">Blog</Link></li>
              <li><Link to="/contato" className="text-gray-500 hover:text-brand-blue transition-colors italic">Contato</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-base-blue uppercase tracking-widest text-xs mb-6">Serviços</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/servicos/gestao-de-trafego" className="text-gray-500 hover:text-brand-blue transition-colors italic">Gestão de Tráfego</Link></li>
              <li><Link to="/servicos/consultoria-personalizada" className="text-gray-500 hover:text-brand-blue transition-colors italic">Consultoria Estratégica</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-base-blue uppercase tracking-widest text-xs mb-6">Social</h4>
            <div className="flex space-x-4">
               {/* Placeholders for social icons */}
               <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-blue hover:border-brand-blue transition-all cursor-pointer font-bold">In</div>
               <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-blue hover:border-brand-blue transition-all cursor-pointer font-bold">Ig</div>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-gray-200 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} Rabello ADS. Transparência em cada pixel.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
