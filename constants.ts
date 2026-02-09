
import { BlogPost } from './types';

export const blogCategories: string[] = [
  'Iniciantes',
  'Empreendedores',
  'Tutoriais',
  'Análises',
];

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '5 Erros Comuns em Anúncios que Você Deve Evitar',
    excerpt: 'Descubra os erros mais frequentes em campanhas de tráfego pago e como corrigi-los para otimizar seu investimento.',
    imageUrl: 'https://picsum.photos/seed/blog1/600/400',
    category: 'Análises',
    date: '15 de Julho, 2024',
    author: 'Rabello ADS',
    slug: '5-erros-comuns-anuncios',
  },
  {
    id: 2,
    title: 'Google Ads para Iniciantes: Um Guia Passo a Passo',
    excerpt: 'Um tutorial completo para você criar sua primeira campanha no Google Ads do zero, mesmo sem experiência prévia.',
    imageUrl: 'https://picsum.photos/seed/blog2/600/400',
    category: 'Iniciantes',
    date: '10 de Julho, 2024',
    author: 'Rabello ADS',
    slug: 'google-ads-para-iniciantes',
  },
  {
    id: 3,
    title: 'Como o Tráfego Pago Pode Ajudar seu Negócio Local',
    excerpt: 'Estratégias específicas para empreendedores que desejam atrair mais clientes para sua loja física ou serviço local.',
    imageUrl: 'https://picsum.photos/seed/blog3/600/400',
    category: 'Empreendedores',
    date: '05 de Julho, 2024',
    author: 'Rabello ADS',
    slug: 'trafego-pago-negocio-local',
  },
   {
    id: 4,
    title: 'Configurando o Pixel do Facebook: Tutorial Completo',
    excerpt: 'Aprenda a instalar e configurar o Pixel do Meta (Facebook) no seu site para rastrear conversões e criar públicos.',
    imageUrl: 'https://picsum.photos/seed/blog4/600/400',
    category: 'Tutoriais',
    date: '28 de Junho, 2024',
    author: 'Rabello ADS',
    slug: 'configurando-pixel-facebook',
  },
  {
    id: 5,
    title: 'Métricas de Vaidade vs. Métricas Reais: O que Acompanhar?',
    excerpt: 'Entenda a diferença entre métricas que apenas inflam o ego e aquelas que realmente impactam o resultado do seu negócio.',
    imageUrl: 'https://picsum.photos/seed/blog5/600/400',
    category: 'Análises',
    date: '21 de Junho, 2024',
    author: 'Rabello ADS',
    slug: 'metricas-de-vaidade',
  },
  {
    id: 6,
    title: 'Orçamento para Tráfego Pago: Quanto Investir?',
    excerpt: 'Uma dúvida comum para todo empreendedor. Veja como definir um orçamento inicial para suas campanhas de forma inteligente.',
    imageUrl: 'https://picsum.photos/seed/blog6/600/400',
    category: 'Empreendedores',
    date: '14 de Junho, 2024',
    author: 'Rabello ADS',
    slug: 'orcamento-trafego-pago',
  }
];
