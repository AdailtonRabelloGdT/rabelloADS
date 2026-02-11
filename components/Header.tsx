import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { RabelloLogo } from './RabelloLogo';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClasses = "text-sm font-bold uppercase tracking-wider text-base-blue hover:text-brand-blue transition-colors pb-2 border-b-2 border-transparent hover:border-brand-blue";
  const activeNavLinkClasses = "border-brand-blue text-brand-blue";

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <RabelloLogo className="h-8" />
            <span className="text-xl font-black tracking-tighter text-base-blue uppercase italic">Rabello <span className="text-brand-blue">Ads</span></span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Home</NavLink>
            <NavLink to="/sobre" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Sobre</NavLink>
            <NavLink to="/blog" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Blog</NavLink>
            <NavLink to="/servicos/gestao-de-trafego" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Serviços</NavLink>
          </nav>

          <div className="hidden md:block">
            <Link to="/contato" className="bg-base-blue text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-brand-blue transition-colors">
              Iniciar Projeto
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-base-blue focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white py-4">
          <div className="container mx-auto px-6 flex flex-col space-y-4">
            <NavLink to="/" className={({ isActive }) => `block text-center py-2 ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsOpen(false)}>Home</NavLink>
            <NavLink to="/sobre" className={({ isActive }) => `block text-center py-2 ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsOpen(false)}>Sobre</NavLink>
            <NavLink to="/blog" className={({ isActive }) => `block text-center py-2 ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsOpen(false)}>Blog</NavLink>
            <NavLink to="/servicos/gestao-de-trafego" className={({ isActive }) => `block text-center py-2 ${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} onClick={() => setIsOpen(false)}>Serviços</NavLink>
            <Link to="/contato" className="text-center bg-base-blue text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-brand-blue transition-colors" onClick={() => setIsOpen(false)}>
              Iniciar Projeto
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
