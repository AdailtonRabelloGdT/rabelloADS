import React from 'react';

// Interface para definir as propriedades que o componente RabelloLogo pode receber.
interface RabelloLogoProps {
  className?: string; // className é opcional e será usada para estilização customizada.
}

/**
 * Componente RabelloLogo
 * 
 * Este componente renderiza a imagem da logo da Rabello ADS.
 * Usa um caminho de string relativo à raiz do documento (index.html) para compatibilidade
 * com HashRouter e ambientes sem processamento de assets por bundler.
 * 
 * @param {RabelloLogoProps} props - As propriedades do componente.
 * @param {string} [props.className] - Classes CSS adicionais para estilizar a imagem.
 */
export const RabelloLogo: React.FC<RabelloLogoProps> = ({ className }) => {
  // Caminho relativo para a imagem. Como usamos HashRouter, o navegador considera
  // que estamos na raiz (onde está o index.html), então "components/..." funciona.
  const logoUrl = "components/logo_160x160.png";

  return (
    <img 
      src={logoUrl} 
      alt="Rabello Ads Logo - Um triângulo de Penrose simbolizando a união de estratégia, dados e transparência." 
      className={className} 
    />
  );
};
