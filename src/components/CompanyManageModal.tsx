import React, { useState, useEffect } from 'react';
import { Company, Seller } from '../types';
import { 
  Building2, 
  Users, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Sparkles, 
  DollarSign, 
  Briefcase, 
  Phone, 
  Mail,
  CheckCircle2
} from 'lucide-react';

interface CompanyManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompanyId: string;
  onSelectCompany: (companyId: string) => void;
  onCompaniesChanged: () => void;
}

export const CompanyManageModal: React.FC<CompanyManageModalProps> = ({
  isOpen,
  onClose,
  selectedCompanyId,
  onSelectCompany,
  onCompaniesChanged
}) => {
  const [tab, setTab] = useState<'companies' | 'sellers'>('companies');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [activeCompanyForSellers, setActiveCompanyForSellers] = useState<string>(selectedCompanyId);

  // New Company form state
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanySegment, setNewCompanySegment] = useState('');
  const [newCompanyGoal, setNewCompanyGoal] = useState<number | string>(50000);
  const [newCompanyColor, setNewCompanyColor] = useState('#6366f1');

  // New Seller form state
  const [showAddSeller, setShowAddSeller] = useState(false);
  const [newSellerName, setNewSellerName] = useState('');
  const [newSellerRole, setNewSellerRole] = useState('Consultor Comercial');
  const [newSellerEmail, setNewSellerEmail] = useState('');
  const [newSellerPhone, setNewSellerPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
      setActiveCompanyForSellers(selectedCompanyId);
      setShowAddCompany(false);
      setShowAddSeller(false);
    }
  }, [isOpen, selectedCompanyId]);

  useEffect(() => {
    if (activeCompanyForSellers) {
      fetchSellers(activeCompanyForSellers);
    }
  }, [activeCompanyForSellers]);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/companies');
      if (res.ok) {
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSellers = async (cId: string) => {
    try {
      const res = await fetch(`/api/sellers?company_id=${cId}`);
      if (res.ok) {
        const data = await res.json();
        setSellers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching sellers:', err);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCompanyName.trim(),
          segment: newCompanySegment.trim() || 'Serviços & Negócios',
          monthly_goal: Number(newCompanyGoal) || 50000,
          color: newCompanyColor
        })
      });

      if (res.ok) {
        const created = await res.json();
        setSuccessMsg(`Empresa "${created.name}" cadastrada com sucesso!`);
        setNewCompanyName('');
        setNewCompanySegment('');
        setShowAddCompany(false);
        fetchCompanies();
        onCompaniesChanged();
        onSelectCompany(created.id);
        setActiveCompanyForSellers(created.id);
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    } catch (err) {
      console.error('Error creating company:', err);
    }
  };

  const handleDeleteCompany = async (cId: string, cName: string) => {
    if (!window.confirm(`Tem certeza que deseja remover a empresa "${cName}" e seus dados?`)) return;
    try {
      const res = await fetch(`/api/companies/${cId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCompanies();
        onCompaniesChanged();
        if (selectedCompanyId === cId) {
          const remaining = companies.filter(c => c.id !== cId);
          if (remaining.length > 0) {
            onSelectCompany(remaining[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Error deleting company:', err);
    }
  };

  const handleCreateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSellerName.trim()) return;

    try {
      const res = await fetch('/api/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: activeCompanyForSellers,
          name: newSellerName.trim(),
          role: newSellerRole.trim() || 'Consultor Comercial',
          email: newSellerEmail.trim() || undefined,
          phone: newSellerPhone.trim() || undefined
        })
      });

      if (res.ok) {
        setSuccessMsg(`Vendedor "${newSellerName}" adicionado à equipe!`);
        setNewSellerName('');
        setNewSellerEmail('');
        setNewSellerPhone('');
        setShowAddSeller(false);
        fetchSellers(activeCompanyForSellers);
        onCompaniesChanged();
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    } catch (err) {
      console.error('Error creating seller:', err);
    }
  };

  const handleDeleteSeller = async (sId: string) => {
    if (!window.confirm('Tem certeza que deseja remover este vendedor da equipe?')) return;
    try {
      const res = await fetch(`/api/sellers/${sId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSellers(activeCompanyForSellers);
        onCompaniesChanged();
      }
    } catch (err) {
      console.error('Error deleting seller:', err);
    }
  };

  if (!isOpen) return null;

  const currentCompanyObj = companies.find(c => c.id === activeCompanyForSellers) || companies[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl max-w-2xl w-full p-5 shadow-2xl relative text-xs text-[#e2e8f0] my-4 max-h-[92vh] overflow-y-auto custom-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#94a3b8] hover:text-white p-1 rounded-md hover:bg-[#2d3139] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-4 pr-6">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#38bdf8]" />
            <span>Gerenciar Empresas &amp; Equipes de Vendas</span>
          </h3>
          <p className="text-[#94a3b8] text-[11px] mt-0.5">
            Gerencie múltiplos clientes/empresas como gestor de tráfego e configure a equipe de vendedores de cada uma.
          </p>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="bg-[#10b981]/20 border border-[#10b981]/40 text-[#34d399] p-2.5 rounded-lg mb-4 flex items-center space-x-2 font-medium text-xs">
            <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-[#2d3139] pb-3 mb-4">
          <button
            onClick={() => setTab('companies')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
              tab === 'companies'
                ? 'bg-[#6366f1] text-white'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#2d3139]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Empresas ({companies.length})</span>
          </button>

          <button
            onClick={() => setTab('sellers')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
              tab === 'sellers'
                ? 'bg-[#38bdf8] text-black'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#2d3139]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Vendedores &amp; Atendentes</span>
          </button>
        </div>

        {/* TAB 1: EMPRESAS */}
        {tab === 'companies' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#94a3b8]">
                Selecione ou adicione uma empresa cliente para analisar:
              </span>
              <button
                onClick={() => setShowAddCompany(!showAddCompany)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Nova Empresa</span>
              </button>
            </div>

            {/* Add Company Form */}
            {showAddCompany && (
              <form onSubmit={handleCreateCompany} className="bg-[#0f1115] p-3.5 rounded-xl border border-[#6366f1]/40 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#6366f1]" />
                  <span>Cadastrar Nova Empresa Cliente</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-1">Nome da Empresa / Cliente:</label>
                    <input
                      type="text"
                      placeholder="Ex: Espaço Saúde & Estética"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#6366f1] text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-1">Segmento / Ramo de Atuação:</label>
                    <input
                      type="text"
                      placeholder="Ex: Clínica Médica / E-commerce / Cursos"
                      value={newCompanySegment}
                      onChange={(e) => setNewCompanySegment(e.target.value)}
                      className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#6366f1] text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-1">Meta de Faturamento Mensal (R$):</label>
                    <input
                      type="number"
                      value={newCompanyGoal}
                      onChange={(e) => setNewCompanyGoal(e.target.value)}
                      className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#6366f1] text-xs font-bold text-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-1">Cor do Tema:</label>
                    <div className="flex items-center space-x-2">
                      {['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444'].map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewCompanyColor(color)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                            newCompanyColor === color ? 'scale-125 border-white' : 'border-transparent opacity-70'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCompany(false)}
                    className="px-3 py-1.5 bg-[#2d3139] text-[#94a3b8] rounded-lg text-xs hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Salvar Empresa</span>
                  </button>
                </div>
              </form>
            )}

            {/* List of Companies */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
              {companies.map((comp) => {
                const isSelected = comp.id === selectedCompanyId;
                return (
                  <div
                    key={comp.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#1a1d23] border-[#6366f1] ring-1 ring-[#6366f1]'
                        : 'bg-[#0f1115] border-[#2d3139] hover:border-[#475569]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-sm"
                        style={{ backgroundColor: comp.color || '#6366f1' }}
                      >
                        {comp.logo_initials || comp.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-white">{comp.name}</h4>
                          {isSelected && (
                            <span className="bg-[#6366f1]/20 text-[#a5b4fc] text-[10px] font-bold px-2 py-0.5 rounded border border-[#6366f1]/40">
                              Empresa Ativa
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#94a3b8]">{comp.segment}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!isSelected && (
                        <button
                          onClick={() => {
                            onSelectCompany(comp.id);
                            setActiveCompanyForSellers(comp.id);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-[#2d3139] hover:bg-[#6366f1] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Selecionar
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setActiveCompanyForSellers(comp.id);
                          setTab('sellers');
                        }}
                        className="p-2 text-[#94a3b8] hover:text-white hover:bg-[#2d3139] rounded-lg transition-colors cursor-pointer"
                        title="Ver vendedores desta empresa"
                      >
                        <Users className="w-4 h-4 text-[#38bdf8]" />
                      </button>

                      {companies.length > 1 && (
                        <button
                          onClick={() => handleDeleteCompany(comp.id, comp.name)}
                          className="p-2 text-[#94a3b8] hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                          title="Excluir empresa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: VENDEDORES & EQUIPE */}
        {tab === 'sellers' && (
          <div className="space-y-4">
            {/* Select company filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#0f1115] p-3 rounded-lg border border-[#2d3139]">
              <div>
                <span className="text-[10px] text-[#94a3b8] block">Empresa selecionada para equipe:</span>
                <select
                  value={activeCompanyForSellers}
                  onChange={(e) => setActiveCompanyForSellers(e.target.value)}
                  className="bg-[#1a1d23] text-white text-xs font-bold py-1 px-2.5 rounded border border-[#2d3139] focus:outline-none focus:border-[#38bdf8] cursor-pointer mt-0.5"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowAddSeller(!showAddSeller)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-black rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Adicionar Vendedor</span>
              </button>
            </div>

            {/* Add Seller Form */}
            {showAddSeller && (
              <form onSubmit={handleCreateSeller} className="bg-[#0f1115] p-3.5 rounded-xl border border-[#38bdf8]/40 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Cadastrar Novo Vendedor na Equipe</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-1">Nome Completo:</label>
                    <input
                      type="text"
                      placeholder="Ex: Juliana Martins"
                      value={newSellerName}
                      onChange={(e) => setNewSellerName(e.target.value)}
                      className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#38bdf8] text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-1">Cargo / Especialidade:</label>
                    <select
                      value={newSellerRole}
                      onChange={(e) => setNewSellerRole(e.target.value)}
                      className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#38bdf8] text-xs cursor-pointer"
                    >
                      <option value="Closer de Vendas">Closer de Vendas / Negociação</option>
                      <option value="SDR / Pré-vendas WhatsApp">SDR / Pré-vendas WhatsApp</option>
                      <option value="Consultor Comercial">Consultor Comercial</option>
                      <option value="Atendente WhatsApp / SAC">Atendente WhatsApp / SAC</option>
                      <option value="Executivo de Contas B2B">Executivo de Contas B2B</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-1">Telefone / WhatsApp:</label>
                    <input
                      type="text"
                      placeholder="+55 11 98888-7777"
                      value={newSellerPhone}
                      onChange={(e) => setNewSellerPhone(e.target.value)}
                      className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#38bdf8] text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-1">E-mail Comercial:</label>
                    <input
                      type="email"
                      placeholder="vendas@empresa.com.br"
                      value={newSellerEmail}
                      onChange={(e) => setNewSellerEmail(e.target.value)}
                      className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#38bdf8] text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSeller(false)}
                    className="px-3 py-1.5 bg-[#2d3139] text-[#94a3b8] rounded-lg text-xs hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-black rounded-lg text-xs font-bold flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Salvar Vendedor</span>
                  </button>
                </div>
              </form>
            )}

            {/* List of Sellers */}
            {sellers.length === 0 ? (
              <div className="py-8 text-center bg-[#0f1115] rounded-lg border border-[#2d3139] text-xs text-[#94a3b8] space-y-1">
                <p>Nenhum vendedor cadastrado nesta empresa ainda.</p>
                <p className="text-[10px]">Clique em "+ Adicionar Vendedor" para começar a rastrear os atendimentos.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {sellers.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-lg bg-[#0f1115] border border-[#2d3139] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                        style={{ backgroundColor: s.avatar_color || '#3b82f6' }}
                      >
                        {s.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">{s.name}</h4>
                        <span className="text-[10px] text-[#38bdf8] font-semibold">{s.role}</span>
                        {s.phone && (
                          <span className="text-[10px] text-[#94a3b8] ml-2">📱 {s.phone}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSeller(s.id)}
                      className="p-1.5 text-[#94a3b8] hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors cursor-pointer"
                      title="Remover vendedor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 mt-4 border-t border-[#2d3139]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2d3139] hover:bg-[#374151] text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
