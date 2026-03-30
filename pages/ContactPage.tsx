
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      website: formData.get('website'),
      budget: formData.get('budget'),
      message: formData.get('message'),
      source: 'website_contact_form'
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar o formulário. Tente novamente.');
      }

      navigate('/obrigado');
    } catch (err: any) {
      setError(err.message || 'Erro inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-16 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          
          <div>
            <span className="text-brand-blue font-black text-xs uppercase tracking-[0.4em] mb-4 block">Fale Conosco</span>
            <h1 className="text-5xl md:text-6xl font-black text-base-blue mb-8 leading-tight tracking-tighter italic">
              Vamos escalar seu <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green">faturamento?</span>
            </h1>
            <p className="text-xl text-gray-500 mb-12 italic leading-relaxed">
              Responda algumas perguntas rápidas para que eu possa fazer um diagnóstico prévio antes da nossa conversa 1 on 1.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">📧</div>
                <div>
                  <h3 className="font-bold text-base-blue italic">E-mail Direto</h3>
                  <p className="text-gray-500 font-medium">adailton@rabelloads.com.br</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">💬</div>
                <div>
                  <h3 className="font-bold text-base-blue italic">Atendimento Humano</h3>
                  <p className="text-gray-500 font-medium">WhatsApp disponível para dúvidas rápidas.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-8 md:p-12 rounded-[48px] shadow-md border border-gray-200">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-medium">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Nome Completo</label>
                  <input type="text" name="name" required className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-brand-blue transition-all font-medium italic" placeholder="Ex: Seu Nome"/>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">E-mail Profissional</label>
                  <input type="email" name="email" required className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-brand-blue transition-all font-medium italic" placeholder="seu@email.com"/>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">WhatsApp (com DDD)</label>
                  <input type="tel" name="phone" required className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-brand-blue transition-all font-medium italic" placeholder="(11) 99999-9999"/>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Qual seu Site / Instagram?</label>
                  <input type="text" name="website" className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-brand-blue transition-all font-medium italic" placeholder="www.suaempresa.com.br"/>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Investimento em Ads / Mês</label>
                  <select name="budget" required className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-brand-blue transition-all font-medium italic text-gray-400">
                    <option value="iniciante">Ainda não invisto</option>
                    <option value="baixo">R$ 1.000 - R$ 3.000</option>
                    <option value="medio">R$ 3.000 - R$ 10.000</option>
                    <option value="alto">Acima de R$ 10.000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Qual o seu maior desafio hoje?</label>
                  <textarea name="message" rows={3} required className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-brand-blue transition-all font-medium italic" placeholder="Ex: Preciso de mais leads qualificados..."></textarea>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-base-blue text-white font-black py-5 rounded-2xl hover:bg-brand-blue transition-all shadow-xl shadow-blue-500/10 uppercase tracking-[0.2em] text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? 'Enviando...' : 'Enviar para Diagnóstico'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
