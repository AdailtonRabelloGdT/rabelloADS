import React from 'react';

// Interface para definir as propriedades que o componente RabelloLogo pode receber.
interface RabelloLogoProps {
  className?: string; // className é opcional e será usada para estilização customizada.
}

/**
 * Componente RabelloLogo (SVG Vector)
 * 
 * Substituímos a imagem PNG por um vetor SVG inline.
 * Isso resolve permanentemente problemas de carregamento (404) e erros de importação
 * em ambientes que não processam assets estáticos via bundler.
 * 
 * O design representa o conceito de "Triângulo" com as cores da marca:
 * - Brand Blue (#2563EB)
 * - Brand Green (#10B981)
 * - Brand Amber (#F59E0B)
 */
export const RabelloLogo: React.FC<RabelloLogoProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Rabello ADS Logo"
    >
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Pilar 1: Estratégia (Azul) - Lado Esquerdo */}
      <path 
        d="M50 15 L20 85 L40 85 L60 38 L50 15Z" 
        fill="#2563EB" 
      />
      
      {/* Pilar 2: Dados (Verde) - Lado Direito */}
      <path 
        d="M50 15 L80 85 L60 85 L40 38 L50 15Z" 
        fill="#10B981" 
      />
      
      {/* Pilar 3: Honestidade/Base (Âmbar) - Conexão Inferior */}
      <path 
        d="M25 72 L75 72 L82 85 L18 85 L25 72Z" 
        fill="#F59E0B" 
      />
      
      {/* Detalhe central para dar profundidade (Triângulo impossível/Penrose vibe) */}
      <path 
        d="M50 45 L65 78 H35 L50 45Z" 
        fill="#0F172A" 
        opacity="0.1" 
      />
    </svg>
  );
};
