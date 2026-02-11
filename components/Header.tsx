
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const logoUrl = "https://i.ibb.co/6wm170j/rabello-logo.png";

export const RabelloLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <img src={logoUrl} alt="Rabello ADS Logo" className={className} />
);

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClasses = "block py-2 px-3 text-gray-600 font-medium transition-colors hover:text-brand-blue md:p-0";
  const activeNavLinkClasses = "block py-2 px-3 text-brand-blue font-bold border-b-2 border-brand-blue md:p-0 md:border-b-0";

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <RabelloLogo className="w-9 h-9 transform group-hover:rotate-12 transition-transform duration-500" />
          <span className="text-xl font-black tracking-tighter text-base-blue uppercase">Rabello <span className="text-brand-blue">Ads</span></span>
        </Link>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
        <div className={`absolute top-full left-0 w-full bg-white md:static md:block md:w-auto shadow-lg md:shadow-none transition-all ${isOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col md:flex-row p-6 md:p-0 space-y-4 md:space-y-0 md:space-x-10 items-center">
            <li><NavLink to="/" className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses} end>Home</NavLink></li>
            <li><NavLink to="/servicos/gestao-de-trafego" className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses}>Tráfego</NavLink></li>
            <li><NavLink to="/servicos/consultoria-personalizada" className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses}>Consultoria</NavLink></li>
            <li><NavLink to="/blog" className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses}>Blog</NavLink></li>
            <li><NavLink to="/sobre" className={({ isActive }) => isActive ? activeNavLinkClasses : navLinkClasses}>Sobre</NavLink></li>
            <li>
              <Link to="/contato" className="bg-base-blue text-white px-6 py-2 rounded-full font-bold hover:bg-brand-blue transition-all">
                Contato
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;