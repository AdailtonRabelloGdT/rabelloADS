import React, { useEffect, useState } from 'react';
import { FileText, Plus, Edit, Trash2, Loader2, Save, X, Image as ImageIcon } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  authorId: number | null;
  categoryId: number | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<Post>>({});
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Falha ao buscar posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreateNew = () => {
    setCurrentPost({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      coverImage: '',
      published: false,
    });
    setIsEditing(true);
  };

  const handleEdit = (post: Post) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/posts/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchPosts();
      } else {
        alert('Erro ao excluir post');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir post');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const isNew = !currentPost.id;
      const url = isNew ? '/api/posts' : `/api/posts/${currentPost.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentPost),
      });

      if (response.ok) {
        setIsEditing(false);
        fetchPosts();
      } else {
        const data = await response.json();
        alert(`Erro: ${data.error || 'Falha ao salvar'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div>
        {!isEditing ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">CMS - Gerenciar Blog</h1>
              <button
                onClick={handleCreateNew}
                className="bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Novo Post
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
                {error}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                            {post.coverImage ? (
                              <img src={post.coverImage} alt="" className="h-10 w-10 object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                            <div className="text-sm text-gray-500">/{post.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {post.published ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(post)} className="text-brand-blue hover:text-blue-900 mr-4">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        Nenhum post encontrado. Clique em "Novo Post" para começar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentPost.id ? 'Editar Post' : 'Criar Novo Post'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    required
                    value={currentPost.title || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    required
                    value={currentPost.slug || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="exemplo-de-post"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem de Capa</label>
                  <input
                    type="url"
                    value={currentPost.coverImage || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, coverImage: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="https://..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resumo (Excerpt)</label>
                  <textarea
                    rows={2}
                    value={currentPost.excerpt || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo (Markdown/HTML)</label>
                  <textarea
                    required
                    rows={12}
                    value={currentPost.content || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue font-mono text-sm"
                  />
                </div>

                <div className="md:col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={currentPost.published || false}
                    onChange={(e) => setCurrentPost({ ...currentPost, published: e.target.checked })}
                    className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                  />
                  <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                    Publicar imediatamente
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Salvar Post
                </button>
              </div>
            </form>
          </div>
        )}
    </div>
  );
};

export default AdminBlogPage;
