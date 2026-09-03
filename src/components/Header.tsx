import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart3, 
  GitFork, 
  Store, 
  Award, 
  Instagram, 
  FileText, 
  Plus, 
  RefreshCw, 
  Building2, 
  ChevronDown, 
  Monitor, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  Database, 
  Settings2,
  Calendar,
  Filter,
  Check
} from 'lucide-react';
import { Company } from '../types';

interface HeaderProps {
  activeTab: 'dashboard' | 'reports' | 'store_traffic' | 'instagram' | 'sales' | 'journey' | 'ai' | 'docs';
  setActiveTab: (tab: 'dashboard' | 'reports' | 'store_traffic' | 'instagram' | 'sales' | 'journey' | 'ai' | 'docs') => void;
  deviceMode: 'desktop' | 'mobile';
  setDeviceMode: (mode: 'desktop' | 'mobile') => void;
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;
  productFilter: string;
  setProductFilter: (p: string) => void;
  companies: Company[];
  selectedCompanyId: string;
  onSelectCompany: (cId: string) => void;
  onOpenManageCompanies: () => void;
  onOpenAddModal: () => void;
  onOpenReportModal: () => void;
  onOpenDesktopModal: () => void;
  onRefresh: () => void;
  onResetData: (mode: 'empty' | 'seed') => void;
  isLoading: boolean;
  totalSalesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  productFilter,
  setProductFilter,
  companies,
  selectedCompanyId,
  onSelectCompany,
  onOpenManageCompanies,
  onOpenAddModal,
  onOpenReportModal,
  onOpenDesktopModal,
  onRefresh,
  onResetData,
  isLoading,
  totalSalesCount
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentCompany = companies.find(c => c.id === selectedCompanyId) || companies[0] || {
    id: 'empresa-1',
    name: 'Loja Principal',
    segment: 'Comércio & Serviços',
    color: '#10b981',
    logo_initials: 'LP'
  };

  // Quick period helpers
  const handleQuickPeriod = (type: 'today' | 'last7' | 'month' | 'all') => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    if (type === 'today') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (type === 'last7') {
      const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setStartDate(past);
      setEndDate(todayStr);
    } else if (type === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      setStartDate(firstDay);
      setEndDate(todayStr);
    } else if (type === 'all') {
      setStartDate('2025-01-01');
      setEndDate(todayStr);
    }
  };

  return (
    <header className="bg-[#1a1d23] text-[#e2e8f0] border-b border-[#2d3139] sticky top-0 z-40 shadow-sm">
      {/* 1. Barra Superior Principal: Marca, Loja e Ações Mais Usadas */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
        
        {/* Esquerda: Identidade & Troca de Loja */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <Store className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-base tracking-tight text-white">
                PAINEL.<span className="text-emerald-400">VENDAS</span>
              </h1>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold hidden sm:inline-block">
                Fácil &amp; Direto
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8] hidden md:block">
              Controle de Clientes &bull; Diário da Loja &bull; Relatórios
            </p>
          </div>

          {/* Seletor de Loja Simples */}
          <div className="flex items-center space-x-1.5 pl-2 sm:pl-3 border-l border-[#2d3139]">
            <div className="relative flex items-center">
              <select
                value={selectedCompanyId}
                onChange={(e) => onSelectCompany(e.target.value)}
                className="bg-[#0f1115] text-white text-xs font-bold py-1.5 pl-7 pr-6 rounded-lg border border-[#2d3139] hover:border-emerald-500/50 focus:outline-none cursor-pointer appearance-none shadow-sm transition-colors"
                title="Trocar Loja ou Empresa"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Bolinha com a cor da empresa */}
              <div 
                className="w-3.5 h-3.5 rounded-full absolute left-2 pointer-events-none"
                style={{ backgroundColor: currentCompany.color || '#10b981' }}
              />

              <ChevronDown className="w-3 h-3 text-[#94a3b8] absolute right-2 pointer-events-none" />
            </div>

            <button
              onClick={onOpenManageCompanies}
              className="p-1.5 rounded-lg bg-[#0f1115] hover:bg-[#2d3139] text-[#94a3b8] hover:text-white border border-[#2d3139] text-xs transition-colors cursor-pointer"
              title="Cadastrar ou Editar Lojas e Vendedores"
            >
              <Building2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Direita: Botões Focados nas Tarefas do Dia a Dia */}
        <div className="flex items-center space-x-2">
          
          {/* Botão Principal em Destaque: Lançar Atendimento / Venda */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs sm:text-sm font-black px-3.5 sm:px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Lançar Atendimento</span>
          </button>

          {/* Botão Secundário: Relatório WhatsApp */}
          <button
            onClick={onOpenReportModal}
            className="hidden sm:flex items-center space-x-1.5 bg-[#1e1b4b] hover:bg-[#2e1065] text-purple-300 hover:text-white border border-purple-500/40 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
            title="Gerar resumo pronto para WhatsApp ou PDF"
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Relatório</span>
          </button>

          {/* Atualizar Dados */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-[#0f1115] hover:bg-[#2d3139] text-[#94a3b8] hover:text-white transition-colors border border-[#2d3139] disabled:opacity-50 cursor-pointer"
            title="Recarregar Dados"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* Menu Suspenso "Mais Opções & Ferramentas" (Evita poluir a tela) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                isMenuOpen 
                  ? 'bg-indigo-600 text-white border-indigo-500' 
                  : 'bg-[#0f1115] hover:bg-[#2d3139] text-[#94a3b8] hover:text-white border-[#2d3139]'
              }`}
              title="Mais Opções, Instalação no PC e Configurações"
            >
              <Settings2 className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Menu Pop-up Simplificado */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#16181f] border border-[#2d3139] rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase text-[#64748b] tracking-wider border-b border-[#2d3139]">
                  Ferramentas &amp; Sistema
                </div>

                <div className="py-1 space-y-0.5">
                  {/* Instalar no Computador / Backup / Python Offline */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenDesktopModal();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-[#e2e8f0] hover:bg-[#222630] hover:text-white transition-colors cursor-pointer bg-amber-500/10 border border-amber-500/30"
                  >
                    <Monitor className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold flex items-center space-x-1.5">
                        <span>App Offline (Python / .EXE)</span>
                        <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 rounded">NOVO</span>
                      </div>
                      <div className="text-[10px] text-amber-200/80">Baixar pacote .ZIP e rodar no PC</div>
                    </div>
                  </button>

                  {/* Gerenciar Equipe e Lojas */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenManageCompanies();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-[#e2e8f0] hover:bg-[#222630] hover:text-white transition-colors cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold">Gerenciar Lojas &amp; Vendedores</div>
                      <div className="text-[10px] text-[#94a3b8]">Cadastrar lojas e comissões da equipe</div>
                    </div>
                  </button>

                  {/* Assistente IA */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setActiveTab('ai');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-[#e2e8f0] hover:bg-[#222630] hover:text-white transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold">IA Assistente Comercial</div>
                      <div className="text-[10px] text-[#94a3b8]">Dicas e análises automáticas</div>
                    </div>
                  </button>

                  {/* Modelo Técnico & Guia */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setActiveTab('docs');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-[#e2e8f0] hover:bg-[#222630] hover:text-white transition-colors cursor-pointer"
                  >
                    <Database className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <div className="font-bold">Guia &amp; Banco SQL</div>
                      <div className="text-[10px] text-[#94a3b8]">Estrutura técnica para desenvolvedor</div>
                    </div>
                  </button>
                </div>

                <div className="border-t border-[#2d3139] pt-1 mt-1">
                  {totalSalesCount > 0 ? (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (window.confirm('Tem certeza que deseja zerar todos os dados e começar limpo?')) {
                          onResetData('empty');
                        }
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Zerar Tudo e Começar do Zero</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onResetData('seed');
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left text-[#94a3b8] hover:bg-[#222630] hover:text-white transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Carregar Dados de Exemplo</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. Barra de Navegação: As 5 Abas Essenciais (Linguagem Simples) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 flex items-center justify-between border-t border-[#2d3139] overflow-x-auto">
        <nav className="flex space-x-1.5 py-1.5 min-w-max">
          
          {/* Aba 1: Visão Geral */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#2d3139] text-white border border-[#3f444e] shadow-sm'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#222630]'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Visão Geral</span>
          </button>

          {/* Aba 2: Diário da Loja (Vendedora Chefe) */}
          <button
            onClick={() => setActiveTab('store_traffic')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'store_traffic'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#222630]'
            }`}
          >
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Diário da Loja</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-bold">
              Vendedora Chefe
            </span>
          </button>

          {/* Aba 3: Vendas & Equipe */}
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'sales'
                ? 'bg-[#2d3139] text-white border border-[#3f444e] shadow-sm'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#222630]'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Vendas &amp; Clientes</span>
            {totalSalesCount > 0 && (
              <span className="bg-[#0f1115] text-[#94a3b8] text-[10px] px-1.5 py-0.2 rounded font-mono">
                {totalSalesCount}
              </span>
            )}
          </button>

          {/* Aba 4: Instagram & Anúncios */}
          <button
            onClick={() => setActiveTab('instagram')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'instagram'
                ? 'bg-[#2d3139] text-white border border-[#e1306c]/50 shadow-sm'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#222630]'
            }`}
          >
            <Instagram className="w-4 h-4 text-[#e1306c]" />
            <span>Instagram &amp; Redes</span>
          </button>

          {/* Aba 5: Relatórios Executivos */}
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-[#2d3139] text-white border border-purple-500/50 shadow-sm'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#222630]'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Relatórios (WhatsApp)</span>
          </button>

        </nav>
      </div>

      {/* 3. Barra de Filtro de Período Limpa e Intuitiva */}
      <div className="bg-[#0f1115] border-t border-[#2d3139] px-3 sm:px-5 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
          
          {/* Seletor de Período com Botões Rápidos */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#94a3b8] font-bold flex items-center space-x-1 mr-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Período:</span>
            </span>

            {/* Botões de Atalho */}
            <div className="flex items-center space-x-1 bg-[#1a1d23] p-0.5 rounded-lg border border-[#2d3139]">
              <button
                onClick={() => handleQuickPeriod('today')}
                className="px-2 py-1 rounded text-[11px] font-semibold text-[#cbd5e1] hover:text-white hover:bg-[#222630] cursor-pointer"
              >
                Hoje
              </button>
              <button
                onClick={() => handleQuickPeriod('last7')}
                className="px-2 py-1 rounded text-[11px] font-semibold text-[#cbd5e1] hover:text-white hover:bg-[#222630] cursor-pointer"
              >
                7 Dias
              </button>
              <button
                onClick={() => handleQuickPeriod('month')}
                className="px-2 py-1 rounded text-[11px] font-semibold text-[#cbd5e1] hover:text-white hover:bg-[#222630] cursor-pointer"
              >
                Este Mês
              </button>
              <button
                onClick={() => handleQuickPeriod('all')}
                className="px-2 py-1 rounded text-[11px] font-semibold text-[#cbd5e1] hover:text-white hover:bg-[#222630] cursor-pointer"
              >
                Tudo
              </button>
            </div>

            {/* Inputs de Data Exata */}
            <div className="flex items-center space-x-1.5 bg-[#1a1d23] px-2 py-1 rounded-lg border border-[#2d3139] text-[#e2e8f0]">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#0f1115] text-[#e2e8f0] rounded px-1.5 py-0.5 border border-[#2d3139] focus:outline-none focus:border-emerald-500 text-[11px]"
              />
              <span className="text-[#64748b] text-[10px]">até</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#0f1115] text-[#e2e8f0] rounded px-1.5 py-0.5 border border-[#2d3139] focus:outline-none focus:border-emerald-500 text-[11px]"
              />
            </div>
          </div>

          {/* Filtro de Produto Simplificado */}
          <div className="flex items-center space-x-1.5 bg-[#1a1d23] px-2.5 py-1 rounded-lg border border-[#2d3139] text-[#e2e8f0]">
            <Filter className="w-3.5 h-3.5 text-[#34d399]" />
            <span className="text-[#94a3b8] text-[11px] font-semibold">Produto:</span>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="bg-[#0f1115] text-[#e2e8f0] rounded px-2 py-0.5 border border-[#2d3139] focus:outline-none focus:border-emerald-500 text-[11px] cursor-pointer"
            >
              <option value="all">Todos os Produtos</option>
              <option value="PRODUTO_A">Produto Principal</option>
              <option value="PRODUTO_B">Upsell / Recompra</option>
              <option value="SERVICO_X">Serviço / Consultoria</option>
            </select>
          </div>

        </div>
      </div>
    </header>
  );
};
