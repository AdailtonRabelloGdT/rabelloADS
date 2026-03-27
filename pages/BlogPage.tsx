import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { blogPosts, blogCategories } from '../constants';
import BlogPostCard from '../components/BlogPostCard';
import { AdUnit } from '../components/AdUnit';

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const filteredPosts = selectedCategory === 'Todos' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  // Dividimos os posts para intercalar anúncios (Estratégia In-Feed)
  // Exibimos os primeiros 3 posts, depois um anúncio, depois o restante.
  const firstBlock = filteredPosts.slice(0, 3);
  const secondBlock = filteredPosts.slice(3);

  return (
    <div className="bg-white">
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-base-blue tracking-tight">Blog Rabello ADS</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Conhecimento para iniciantes, profissionais e empreendedores. Dicas práticas, tutoriais e análises para ajudar você a crescer com método.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* ANÚNCIO: Leaderboard (Topo) */}
        <AdUnit slotId="topo-blog" className="mb-12" />

        {/* Category Filters */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {['Todos', ...blogCategories].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border ${
                selectedCategory === category
                  ? 'bg-base-blue text-white border-base-blue shadow-lg shadow-blue-900/20'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-brand-blue hover:text-brand-blue'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Conteúdo do Blog */}
        {filteredPosts.length > 0 ? (
          <>
            {/* Bloco 1: Primeiros 3 posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {firstBlock.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {/* ANÚNCIO: In-Feed (Meio do conteúdo) - Só aparece se houver posts */}
            <AdUnit slotId="meio-blog" className="my-16" />

            {/* Bloco 2: Posts restantes */}
            {secondBlock.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {secondBlock.map(post => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        ) : (
           <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
             <p className="text-xl text-gray-400 font-medium">Nenhum artigo encontrado nesta categoria.</p>
             <button onClick={() => setSelectedCategory('Todos')} className="mt-4 text-brand-blue font-bold hover:underline">Ver todos os posts</button>
           </div>
        )}

        {/* ANÚNCIO: Rodapé */}
        <AdUnit slotId="rodape-blog" className="mt-16 mb-16" />

         {/* Newsletter CTA */}
        <div className="max-w-4xl mx-auto text-center bg-base-blue text-white p-8 md:p-12 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black mb-4">Fique por dentro das novidades</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">Assine nossa newsletter para receber novos artigos, análises de mercado e dicas exclusivas diretamente no seu e-mail.</p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="w-full px-6 py-4 rounded-xl text-base-blue font-medium focus:outline-none focus:ring-4 focus:ring-brand-blue/50 transition-all placeholder-gray-400"
              />
              <button 
                type="submit"
                className="bg-brand-green text-white font-bold py-4 px-8 rounded-xl hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 transition-all uppercase tracking-wide text-sm whitespace-nowrap"
              >
                Assinar Agora
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogPage;
