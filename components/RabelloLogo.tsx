import React, { useState } from 'react';

interface RabelloLogoProps {
  className?: string;
}

/**
 * Componente RabelloLogo
 * 
 * Tenta carregar a imagem original (PNG) usando caminho absoluto.
 * Se falhar, exibe o vetor (SVG) do Triângulo de Penrose, que combina com a identidade visual
 * descrita na Home Page.
 */
export const RabelloLogo: React.FC<RabelloLogoProps> = ({ className }) => {
  const [hasError, setHasError] = useState(false);

  // Fallback: Se a imagem não carregar, mostramos o Triângulo de Penrose
  if (hasError) {
    return (
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        aria-label="Rabello ADS Logo"
      >
        {/* Pilar 1: Estratégia (Azul) */}
        <path d="M50 15 L20 85 L40 85 L60 38 L50 15Z" fill="#2563EB" />
        
        {/* Pilar 2: Dados (Verde) */}
        <path d="M50 15 L80 85 L60 85 L40 38 L50 15Z" fill="#10B981" />
        
        {/* Pilar 3: Honestidade/Base (Âmbar) */}
        <path d="M25 72 L75 72 L82 85 L18 85 L25 72Z" fill="#F59E0B" />
        
        {/* Detalhe central para profundidade */}
        <path d="M50 45 L65 78 H35 L50 45Z" fill="#0F172A" opacity="0.1" />
      </svg>
    );
  }

  return (
    <img 
      src="/components/logo_160x160.png" 
      alt="Rabello ADS Logo" 
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
