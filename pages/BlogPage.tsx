
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { blogPosts, blogCategories } from '../constants';
import BlogPostCard from '../components/BlogPostCard';

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const filteredPosts = selectedCategory === 'Todos' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="bg-white">
      <div className="bg-light-gray">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-base-blue">Blog Rabello ADS</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Conhecimento para iniciantes, profissionais e empreendedores. Dicas práticas, tutoriais e análises para ajudar você a crescer com método.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filters */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {['Todos', ...blogCategories].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                selectedCategory === category
                  ? 'bg-base-blue text-white'
                  : 'bg-breathing-gray text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

         {/* Newsletter CTA */}
        <div className="mt-20 max-w-3xl mx-auto text-center bg-base-blue text-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold">Fique por dentro das novidades</h2>
          <p className="mt-2">Assine nossa newsletter para receber novos artigos e dicas exclusivas diretamente no seu e-mail.</p>
          <form className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              className="w-full sm:w-auto flex-grow px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-consulting-amber"
            />
            <button 
              type="submit"
              className="bg-education-green text-white font-semibold py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors"
            >
              Assinar
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default BlogPage;
