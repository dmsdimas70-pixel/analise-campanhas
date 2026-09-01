import React from 'react';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Share2, 
  Sparkles, 
  ArrowUpRight,
  FileText,
  Plus,
  Instagram,
  HelpCircle
} from 'lucide-react';
import { FunnelMetricsResponse, ArrivalLevelsResponse } from '../types';
import { TermExplainer } from './TermExplainer';

interface TrafficManagerQuickCardsProps {
  funnelMetrics: FunnelMetricsResponse | null;
  arrivalData: ArrivalLevelsResponse | null;
  onOpenReport: () => void;
  onOpenAddModal: () => void;
  onOpenInstagram?: () => void;
}

export const TrafficManagerQuickCards: React.FC<TrafficManagerQuickCardsProps> = ({
  funnelMetrics,
  arrivalData,
  onOpenReport,
  onOpenAddModal,
  onOpenInstagram
}) => {
  const totalLeads = arrivalData?.total_contacts || funnelMetrics?.summary.total_leads || 0;
  const totalRevenue = arrivalData?.total_revenue || funnelMetrics?.summary.total_revenue || 0;
  const convertedA = funnelMetrics?.summary.converted_to_A || 0;
  const conversionRate = funnelMetrics?.summary.conversion_rate_A || (totalLeads > 0 ? Math.round((convertedA / totalLeads) * 100) : 0);
  const totalUpsells = funnelMetrics?.summary.converted_to_B_from_A || 0;
  const totalReferrals = funnelMetrics?.summary.indications_converted || 0;

  return (
    <div className="space-y-4">
      {/* Top Banner with Quick Actions for Traffic Manager */}
      <div className="bg-gradient-to-r from-[#1e1b4b] via-[#1a1d23] to-[#0f1115] border border-[#6366f1]/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] text-[11px] font-bold border border-[#6366f1]/40 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Painel do Gestor de Tráfego</span>
            </span>
            <span className="text-xs text-[#94a3b8]">Simples &bull; Direto &bull; Em Tempo Real</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            Controle de Chegadas, Vendas, Instagram &amp; Relatórios
          </h2>
          <p className="text-xs text-[#cbd5e1] max-w-2xl mt-0.5">
            Acompanhe de onde vieram os clientes (Meta Ads, Google, Indicações e Instagram Orgânico), qual produto compraram e gere relatórios com 1 clique.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {onOpenInstagram && (
            <button
              onClick={onOpenInstagram}
              className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 bg-gradient-to-r from-[#833ab4]/30 to-[#fd1d1d]/30 hover:from-[#833ab4]/50 hover:to-[#fd1d1d]/50 text-white border border-[#e1306c]/40 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Instagram className="w-3.5 h-3.5 text-[#e1306c]" />
              <span>Instagram Orgânico</span>
            </button>
          )}

          <button
            onClick={onOpenReport}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#6366f1]/20 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Gerar Relatório Executivo</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#10b981]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Lançar Venda / Lead</span>
          </button>
        </div>
      </div>

      {/* 5 Big KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        
        {/* Card 1: Chegadas / Leads */}
        <div className="bg-[#1a1d23] border border-[#2d3139] hover:border-[#3b82f6]/50 rounded-xl p-3.5 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8] mb-1">
            <span className="text-[11px] font-semibold flex items-center gap-1">
              <span>1. Chegadas</span>
              <TermExplainer term="Leads" translation="Contatos interessados que chegaram" />
            </span>
            <div className="p-1.5 rounded-lg bg-[#3b82f6]/10 text-[#60a5fa]">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {totalLeads}
          </div>
          <div className="flex items-center text-[10px] text-[#94a3b8] mt-1">
            <span>Entraram pelas campanhas</span>
          </div>
        </div>

        {/* Card 2: Vendas Produto Principal */}
        <div className="bg-[#1a1d23] border border-[#2d3139] hover:border-[#10b981]/50 rounded-xl p-3.5 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8] mb-1">
            <span className="text-[11px] font-semibold flex items-center gap-1">
              <span>2. Vendas do Produto</span>
              <TermExplainer term="Conversão" translation="Transformar contato em cliente pagante" />
            </span>
            <div className="p-1.5 rounded-lg bg-[#10b981]/10 text-[#34d399]">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#34d399]">
            {convertedA}
          </div>
          <div className="flex items-center text-[10px] text-[#10b981] mt-1 font-semibold">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            <span>Taxa Conv: {conversionRate}%</span>
          </div>
        </div>

        {/* Card 3: Recompras / Upsell */}
        <div className="bg-[#1a1d23] border border-[#2d3139] hover:border-[#8b5cf6]/50 rounded-xl p-3.5 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8] mb-1">
            <span className="text-[11px] font-semibold flex items-center gap-1">
              <span>3. Recompras</span>
              <TermExplainer term="Upsell" translation="Venda de um segundo produto/serviço mais avançado" />
            </span>
            <div className="p-1.5 rounded-lg bg-[#8b5cf6]/10 text-[#a78bfa]">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#a78bfa]">
            {totalUpsells}
          </div>
          <div className="flex items-center text-[10px] text-[#94a3b8] mt-1">
            <span>Compraram 2º produto</span>
          </div>
        </div>

        {/* Card 4: Indicações Feitas */}
        <div className="bg-[#1a1d23] border border-[#2d3139] hover:border-[#ec4899]/50 rounded-xl p-3.5 transition-all shadow-sm">
          <div className="flex items-center justify-between text-[#94a3b8] mb-1">
            <span className="text-[11px] font-semibold flex items-center gap-1">
              <span>4. Indicações</span>
              <TermExplainer term="Referral" translation="Indicação de boca a boca de clientes satisfeitos" />
            </span>
            <div className="p-1.5 rounded-lg bg-[#ec4899]/10 text-[#f472b6]">
              <Share2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#f472b6]">
            {totalReferrals}
          </div>
          <div className="flex items-center text-[10px] text-[#94a3b8] mt-1">
            <span>Clientes que indicaram</span>
          </div>
        </div>

        {/* Card 5: Faturamento Total */}
        <div className="bg-[#1a1d23] border border-[#2d3139] hover:border-[#fbbf24]/50 rounded-xl p-3.5 transition-all shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#94a3b8] mb-1">
            <span className="text-[11px] font-semibold flex items-center gap-1">
              <span>5. Faturamento Total</span>
              <TermExplainer term="Revenue" translation="Receita bruta total em R$" />
            </span>
            <div className="p-1.5 rounded-lg bg-[#fbbf24]/10 text-[#fbbf24]">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-white font-mono">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center text-[10px] text-[#fbbf24] mt-1">
            <span>Receita total rastreada</span>
          </div>
        </div>

      </div>
    </div>
  );
};

