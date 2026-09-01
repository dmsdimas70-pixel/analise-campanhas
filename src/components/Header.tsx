import React, { useState } from 'react';
import { 
  BarChart3, 
  GitFork, 
  TrendingUp, 
  PieChart, 
  UserCheck, 
  Sparkles, 
  Database, 
  Smartphone, 
  Monitor, 
  Calendar, 
  Filter, 
  Plus, 
  RefreshCw,
  Trash2,
  Play,
  RotateCcw,
  FileText,
  Instagram,
  Building2,
  ChevronDown,
  Award,
  Users
} from 'lucide-react';
import { Company } from '../types';

interface HeaderProps {
  activeTab: 'dashboard' | 'reports' | 'instagram' | 'sales' | 'journey' | 'ai' | 'docs';
  setActiveTab: (tab: 'dashboard' | 'reports' | 'instagram' | 'sales' | 'journey' | 'ai' | 'docs') => void;
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
  onRefresh: () => void;
  onResetData: (mode: 'empty' | 'seed') => void;
  isLoading: boolean;
  totalSalesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  deviceMode,
  setDeviceMode,
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
  onRefresh,
  onResetData,
  isLoading,
  totalSalesCount
}) => {
  const currentCompany = companies.find(c => c.id === selectedCompanyId) || companies[0] || {
    id: 'empresa-1',
    name: 'Clínica Odonto Prime',
    segment: 'Saúde & Estética',
    color: '#6366f1',
    logo_initials: 'OP'
  };

  return (
    <header className="bg-[#1a1d23] text-[#e2e8f0] border-b border-[#2d3139] sticky top-0 z-40 shadow-sm">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: App Brand & Active Company Switcher */}
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-[#6366f1] flex items-center justify-center shadow-sm shrink-0">
            <GitFork className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-base tracking-tight text-white">
                ORIGEM.<span className="text-[#818cf8]">VENDAS</span>
              </h1>
              <span className="bg-[#1e1b4b] text-[#818cf8] text-[10px] px-2 py-0.5 rounded-full font-bold border border-[#6366f1]/40 hidden sm:inline-block">
                Multi-Empresas
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8] hidden md:block">
              Gestão de Tráfego &bull; Níveis 1 a 5 &bull; Ranking de Vendedores &bull; Relatórios
            </p>
          </div>

          {/* Company Selector Dropdown / Badge */}
          <div className="flex items-center space-x-1.5 pl-2 border-l border-[#2d3139]">
            <div className="relative flex items-center">
              <select
                value={selectedCompanyId}
                onChange={(e) => onSelectCompany(e.target.value)}
                className="bg-[#0f1115] text-white text-xs font-bold py-1.5 pl-8 pr-7 rounded-lg border border-[#3b82f6]/40 focus:outline-none focus:border-[#38bdf8] cursor-pointer appearance-none shadow-sm hover:border-[#38bdf8]"
                title="Trocar Empresa em análise"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.segment.split('&')[0].trim()})
                  </option>
                ))}
              </select>

              {/* Company Logo Initials Badge */}
              <div 
                className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-black text-white absolute left-1.5 pointer-events-none"
                style={{ backgroundColor: currentCompany.color || '#6366f1' }}
              >
                {currentCompany.logo_initials || currentCompany.name.slice(0, 2).toUpperCase()}
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8] absolute right-2 pointer-events-none" />
            </div>

            <button
              onClick={onOpenManageCompanies}
              className="p-1.5 rounded-lg bg-[#0f1115] hover:bg-[#2d3139] text-[#38bdf8] border border-[#2d3139] text-xs font-semibold transition-colors cursor-pointer"
              title="Gerenciar Empresas & Equipe de Vendas"
            >
              <Building2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center space-x-2">
          {/* Reset / Clean Database Controls */}
          {totalSalesCount > 0 ? (
            <button
              onClick={() => {
                if (window.confirm('Deseja realmente limpar todos os dados e começar do 0?')) {
                  onResetData('empty');
                }
              }}
              className="flex items-center space-x-1.5 bg-[#0f1115] hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-[#2d3139] hover:border-rose-800 text-xs px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
              title="Limpar todos os dados e começar do zero"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Zerar Dados (0)</span>
            </button>
          ) : (
            <button
              onClick={() => onResetData('seed')}
              className="flex items-center space-x-1.5 bg-[#0f1115] hover:bg-[#2d3139] text-[#94a3b8] hover:text-[#e2e8f0] border border-[#2d3139] text-xs px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
              title="Carregar exemplo demonstrativo com dados de teste"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#6366f1]" />
              <span className="hidden sm:inline">Carregar Exemplo</span>
            </button>
          )}

          {/* Report Modal Trigger Button */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center space-x-1.5 bg-[#1e1b4b] hover:bg-[#2e1065] text-[#c084fc] hover:text-white border border-[#6366f1]/50 text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer"
            title="Gerar relatório de chegada e conversão para WhatsApp / PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Gerar Relatório</span>
          </button>

          {/* New Sale with Origin Modal Trigger */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#4f46e5] hover:to-[#4338ca] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Lançar Atendimento</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-[#0f1115] hover:bg-[#2d3139] text-[#94a3b8] hover:text-white transition-colors border border-[#2d3139] disabled:opacity-50 cursor-pointer"
            title="Recalcular Métricas"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#6366f1]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 flex items-center justify-between border-t border-[#2d3139] overflow-x-auto">
        <nav className="flex space-x-1 py-1.5 min-w-max">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-[#2d3139] text-white border border-[#3f444e]'
                : 'text-[#94a3b8] hover:text-slate-200 hover:bg-[#222630]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#6366f1]" />
            <span>Painel do Gestor (Dashboard)</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'reports'
                ? 'bg-[#2d3139] text-white border border-[#3f444e]'
                : 'text-[#94a3b8] hover:text-slate-200 hover:bg-[#222630]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#c084fc]" />
            <span>Relatórios Executivos (PDF/WhatsApp)</span>
          </button>

          <button
            onClick={() => setActiveTab('instagram')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'instagram'
                ? 'bg-[#2d3139] text-white border border-[#e1306c]/60'
                : 'text-[#94a3b8] hover:text-slate-200 hover:bg-[#222630]'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-[#e1306c]" />
            <span>Instagram &amp; Crescimento Orgânico</span>
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'sales'
                ? 'bg-[#2d3139] text-white border border-[#3f444e]'
                : 'text-[#94a3b8] hover:text-slate-200 hover:bg-[#222630]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Vendas &amp; Ranking de Vendedores ({totalSalesCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('journey')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'journey'
                ? 'bg-[#2d3139] text-white border border-[#3f444e]'
                : 'text-[#94a3b8] hover:text-slate-200 hover:bg-[#222630]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Jornada de Compra &amp; Origem</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'ai'
                ? 'bg-[#2d3139] text-white border border-[#3f444e]'
                : 'text-[#94a3b8] hover:text-slate-200 hover:bg-[#222630]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>IA Assistente de Tráfego</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'docs'
                ? 'bg-[#2d3139] text-white border border-[#3f444e]'
                : 'text-[#94a3b8] hover:text-slate-200 hover:bg-[#222630]'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-[#34d399]" />
            <span>Guia &amp; Modelo</span>
          </button>
        </nav>
      </div>

      {/* Global Filter Bar */}
      <div className="bg-[#0f1115] border-t border-[#2d3139] px-3 sm:px-5 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Date Range Selector */}
            <div className="flex items-center space-x-1.5 bg-[#1a1d23] px-2.5 py-1 rounded-lg border border-[#2d3139] text-[#e2e8f0]">
              <Calendar className="w-3.5 h-3.5 text-[#6366f1]" />
              <span className="text-[#94a3b8] text-[11px] font-semibold uppercase tracking-wider">Período:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#0f1115] text-[#e2e8f0] rounded px-1.5 py-0.5 border border-[#2d3139] focus:outline-none focus:border-[#6366f1] text-[11px]"
              />
              <span className="text-[#94a3b8] text-[10px]">até</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#0f1115] text-[#e2e8f0] rounded px-1.5 py-0.5 border border-[#2d3139] focus:outline-none focus:border-[#6366f1] text-[11px]"
              />
            </div>

            {/* Product Filter */}
            <div className="flex items-center space-x-1.5 bg-[#1a1d23] px-2.5 py-1 rounded-lg border border-[#2d3139] text-[#e2e8f0]">
              <Filter className="w-3.5 h-3.5 text-[#34d399]" />
              <span className="text-[#94a3b8] text-[11px] font-semibold uppercase tracking-wider">Produto:</span>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="bg-[#0f1115] text-[#e2e8f0] rounded px-2 py-0.5 border border-[#2d3139] focus:outline-none focus:border-[#6366f1] text-[11px]"
              >
                <option value="all">Todos os Produtos</option>
                <option value="PRODUTO_A">Produto Principal (A)</option>
                <option value="PRODUTO_B">Upsell (Recompra / Segunda Venda - B)</option>
                <option value="SERVICO_X">Serviço / Consultoria (X)</option>
              </select>
            </div>
          </div>

          {/* Active Company Badge & Legend */}
          <div className="hidden lg:flex items-center space-x-3 text-[#94a3b8] bg-[#1a1d23] px-2.5 py-1 rounded-lg border border-[#2d3139] text-[11px]">
            <span className="text-[#e2e8f0] font-bold flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentCompany.color || '#6366f1' }}></span>
              <span>Empresa: {currentCompany.name}</span>
            </span>
            <span className="text-[#475569]">|</span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
              <span>Tráfego Pago</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#ec4899]"></span>
              <span>Indicações</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              <span>Orgânico / Insta</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
