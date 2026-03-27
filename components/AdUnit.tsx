import React from 'react';

interface AdUnitProps {
  className?: string;
  slotId?: string; // ID do bloco de anúncios do AdSense (data-ad-slot)
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
}

/**
 * Componente AdUnit
 * 
 * Responsável por renderizar os espaços publicitários do Google AdSense.
 * Durante o desenvolvimento, exibe um placeholder visual.
 * 
 * COMO USAR EM PRODUÇÃO:
 * 1. Obtenha o código do bloco de anúncio no painel do AdSense.
 * 2. Descomente o bloco <ins> e o <script> abaixo.
 * 3. Preencha 'data-ad-client' com seu ID de publisher (ex: ca-pub-XXXXXXXXXXXXXXXX).
 * 4. Passe o 'slotId' via props ao chamar este componente.
 */
export const AdUnit: React.FC<AdUnitProps> = ({ className = '', slotId = '0000000000', format = 'auto' }) => {
  return (
    <div className={`w-full flex flex-col items-center my-8 ${className}`}>
      {/* Rótulo de Publicidade - Recomendado pelas políticas do AdSense para distinguir conteúdo de ads */}
      <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Publicidade</span>
      
      {/* Container do Anúncio */}
      <div className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center p-4 min-h-[200px] md:min-h-[280px] relative overflow-hidden group hover:border-brand-blue/30 transition-colors">
        
        {/* Placeholder Visual (Apagar ou ocultar quando o script estiver ativo) */}
        <div className="text-center text-gray-400 group-hover:text-brand-blue transition-colors pointer-events-none select-none">
          <p className="font-bold text-lg mb-1">Espaço Google AdSense</p>
          <p className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200 inline-block">
            slot: {slotId} • format: {format}
          </p>
        </div>

        {/* --- ÁREA DO SCRIPT DO ADSENSE --- */}
        {/* 
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%' }}
             data-ad-client="ca-pub-SEU_ID_DE_PUBLISHER_AQUI"
             data-ad-slot={slotId}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script> 
        */}
      </div>
    </div>
  );
};
