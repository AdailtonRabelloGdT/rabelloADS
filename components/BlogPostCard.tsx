
import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const categoryColorMap: { [key: string]: string } = {
    'Iniciantes': 'bg-blue-100 text-blue-800',
    'Empreendedores': 'bg-consulting-amber bg-opacity-20 text-consulting-amber',
    'Tutoriais': 'bg-education-green bg-opacity-20 text-green-800',
    'Análises': 'bg-red-100 text-red-800',
  };
  
  const categoryClasses = categoryColorMap[post.category] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl">
      <Link to={`/blog/${post.slug}`} className="block overflow-hidden">
        <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${categoryClasses}`}>
                {post.category}
            </span>
            <p className="text-sm text-gray-500">{post.date}</p>
        </div>
        <h3 className="text-xl font-bold text-base-blue mt-2">
          <Link to={`/blog/${post.slug}`} className="hover:text-consulting-amber transition-colors duration-200">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-gray-600 flex-grow">{post.excerpt}</p>
        <div className="mt-4">
          <Link to={`/blog/${post.slug}`} className="font-semibold text-base-blue hover:text-consulting-amber transition-colors duration-200">
            Ler mais &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
