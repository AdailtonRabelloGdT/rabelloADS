import React, { useEffect, useState } from 'react';
import { Brain, FileText, Loader2, CheckCircle2 } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  niche: string | null;
  budget: string | null;
  objective: string | null;
  traffic: string | null;
  challenge: string | null;
  urgency: string | null;
  score: number | null;
  status: string;
  aiSummary: string | null;
  aiStrategy: string | null;
  closeProb: number | null;
  createdAt: string;
}

const AdminLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [proposals, setProposals] = useState<Record<string, string>>({});
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const AI_ENABLED = false; // IA desativada temporariamente por segurança

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/leads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Falha ao buscar leads');
      }
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAnalyze = async (lead: Lead) => {
    setAnalyzing(lead.id);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/leads/${lead.id}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchLeads();
      } else {
        alert("Erro ao analisar o lead com IA.");
      }
    } catch (err) {
      console.error("Erro ao analisar lead:", err);
      alert("Erro ao analisar o lead com IA.");
    } finally {
      setAnalyzing(null);
    }
  };

  const handleGenerateProposal = async (lead: Lead) => {
    setGenerating(lead.id);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/leads/${lead.id}/proposal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProposals(prev => ({ ...prev, [lead.id]: data.proposal || "" }));
      } else {
        alert("Erro ao gerar proposta com IA.");
      }
    } catch (err) {
      console.error("Erro ao gerar proposta:", err);
      alert("Erro ao gerar proposta com IA.");
    } finally {
      setGenerating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-brand-green" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-lg w-full shadow-sm border border-red-100">
          <h2 className="text-xl font-bold mb-2">Erro ao carregar leads</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchLeads();
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar status.");
    }
  };

  const filteredLeads = filterStatus === 'all' 
    ? leads 
    : leads.filter(lead => (lead.status || 'new') === filterStatus);

  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => (l.score && l.score >= 50) || (l.closeProb && l.closeProb >= 70)).length;
  const avgCloseProb = leads.length > 0 
    ? Math.round(leads.reduce((acc, l) => acc + (l.closeProb || 0), 0) / leads.filter(l => l.closeProb !== null).length || 0)
    : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CRM - Leads Inteligentes</h1>
          <div className="flex gap-4 items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block p-2.5"
            >
              <option value="all">Todos os Status</option>
              <option value="new">Novo</option>
              <option value="contacted">Em Contato</option>
              <option value="follow_up_sent">Follow-up Enviado</option>
              <option value="proposal_sent">Proposta Enviada</option>
              <option value="closed_won">Fechado (Ganho)</option>
              <option value="closed_lost">Fechado (Perdido)</option>
            </select>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Leads</p>
              <p className="text-3xl font-bold text-gray-900">{totalLeads}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Leads Quentes (Hot)</p>
              <p className="text-3xl font-bold text-brand-green">{hotLeads}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-brand-green">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Prob. Média de Fechamento</p>
              <p className="text-3xl font-bold text-blue-600">{avgCloseProb}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <Brain className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredLeads.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500">Nenhum lead encontrado com esse status.</p>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      {lead.name}
                      {lead.score && lead.score >= 50 && (
                        <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full">Hot Lead 🔥</span>
                      )}
                    </h2>
                    <div className="text-sm text-gray-500 mt-1 flex gap-4">
                      <span>{lead.email}</span>
                      <span>{lead.phone}</span>
                      <span>{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Status</div>
                      <select
                        value={lead.status || 'new'}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-sm font-bold border-2 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-brand-blue outline-none transition-colors cursor-pointer
                          ${(!lead.status || lead.status === 'new') ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                          ${lead.status === 'contacted' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                          ${lead.status === 'follow_up_sent' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                          ${lead.status === 'proposal_sent' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                          ${lead.status === 'closed_won' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${lead.status === 'closed_lost' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                        `}
                      >
                        <option value="new">Novo</option>
                        <option value="contacted">Em Contato</option>
                        <option value="follow_up_sent">Follow-up Enviado</option>
                        <option value="proposal_sent">Proposta Enviada</option>
                        <option value="closed_won">Fechado (Ganho)</option>
                        <option value="closed_lost">Fechado (Perdido)</option>
                      </select>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Score</div>
                      <div className="text-2xl font-bold text-brand-green">{lead.score || 0}</div>
                    </div>
                    {lead.closeProb !== null && (
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Prob. Fechamento</div>
                        <div className="text-2xl font-bold text-blue-600">{lead.closeProb}%</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Dados do Lead</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="grid grid-cols-3 gap-4"><dt className="text-gray-500">Nicho:</dt><dd className="col-span-2 font-medium">{lead.niche || '-'}</dd></div>
                      <div className="grid grid-cols-3 gap-4"><dt className="text-gray-500">Orçamento:</dt><dd className="col-span-2 font-medium">{lead.budget || '-'}</dd></div>
                      <div className="grid grid-cols-3 gap-4"><dt className="text-gray-500">Objetivo:</dt><dd className="col-span-2 font-medium">{lead.objective || '-'}</dd></div>
                      <div className="grid grid-cols-3 gap-4"><dt className="text-gray-500">Tráfego:</dt><dd className="col-span-2 font-medium">{lead.traffic || '-'}</dd></div>
                      <div className="grid grid-cols-3 gap-4"><dt className="text-gray-500">Urgência:</dt><dd className="col-span-2 font-medium">{lead.urgency || '-'}</dd></div>
                      <div className="grid grid-cols-3 gap-4"><dt className="text-gray-500">Desafio:</dt><dd className="col-span-2 font-medium">{lead.challenge || '-'}</dd></div>
                    </dl>
                  </div>

                  <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Análise de IA
                      </h3>
                      {!lead.aiSummary && AI_ENABLED && (
                        <button
                          onClick={() => handleAnalyze(lead)}
                          disabled={analyzing === lead.id}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                          {analyzing === lead.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
                          Analisar Lead
                        </button>
                      )}
                      {!AI_ENABLED && (
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                          Desativado
                        </span>
                      )}
                    </div>

                    {lead.aiSummary ? (
                      <div className="space-y-4 text-sm text-gray-700">
                        <div>
                          <strong className="block text-gray-900 mb-1">Resumo Estratégico:</strong>
                          <p>{lead.aiSummary}</p>
                        </div>
                        <div>
                          <strong className="block text-gray-900 mb-1">Estratégia Recomendada:</strong>
                          <p>{lead.aiStrategy}</p>
                        </div>
                        
                        {AI_ENABLED && (
                          <div className="pt-4 border-t border-blue-100">
                            <button
                              onClick={() => handleGenerateProposal(lead)}
                              disabled={generating === lead.id}
                              className="w-full bg-brand-green hover:bg-emerald-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {generating === lead.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                              Gerar Proposta Comercial
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-8">
                        {AI_ENABLED 
                          ? 'Clique em "Analisar Lead" para gerar insights e estratégia com IA.'
                          : 'O recurso de análise com Inteligência Artificial está temporariamente desativado por questões de segurança e manutenção.'}
                      </div>
                    )}
                  </div>
                </div>

                {proposals[lead.id] && (
                  <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-green" />
                      Proposta Gerada
                    </h3>
                    <div className="bg-white p-4 rounded border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {proposals[lead.id]}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
    </div>
  );
};

export default AdminLeadsPage;
