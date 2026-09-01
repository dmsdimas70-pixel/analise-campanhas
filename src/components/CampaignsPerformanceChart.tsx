import React, { useState, useEffect } from 'react';
import { CampaignSummaryItem } from '../types';
import { Target, TrendingUp, DollarSign, ShoppingBag, Layers, BarChart2, Tag, ChevronRight } from 'lucide-react';
import { TermExplainer } from './TermExplainer';

interface CampaignsPerformanceChartProps {
  startDate?: string;
  endDate?: string;
  selectedCompanyId?: string;
  onSelectCampaign?: (campaignName: string | null) => void;
  selectedCampaign?: string | null;
}

export const CampaignsPerformanceChart: React.FC<CampaignsPerformanceChartProps> = ({
  startDate,
  endDate,
  selectedCompanyId,
  onSelectCampaign,
  selectedCampaign
}) => {
  const [campaigns, setCampaigns] = useState<CampaignSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, [startDate, endDate, selectedCompanyId]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const companyPart = selectedCompanyId ? `&company_id=${selectedCompanyId}` : '';
      const q = `startDate=${startDate || ''}&endDate=${endDate || ''}${companyPart}`;
      const res = await fetch(`/api/metrics/campaigns-summary?${q}`);
      const data = await res.json();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching campaigns summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalRevenueAll = campaigns.reduce((sum, c) => sum + c.total_revenue, 0);
  const totalSalesAll = campaigns.reduce((sum, c) => sum + c.total_sales, 0);
  const maxRevenue = Math.max(...campaigns.map(c => c.total_revenue), 1);

  return (
    <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2d3139]/60 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/20">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Origem &amp; Desempenho por Campanha
            </h3>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-0.5">
            Descubra exatamente de qual campanha cada produto foi vendido e qual gerou mais receita.
          </p>
        </div>

        {/* Global summary badge */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-[#0f1115] border border-[#2d3139] text-[#94a3b8]">
            <strong className="text-white">{campaigns.length}</strong> Origens Rastreadas
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-[#94a3b8] text-xs">
          Carregando dados das campanhas...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-[#0f1115] border border-[#2d3139] rounded-lg p-6 text-center space-y-2">
          <Target className="w-8 h-8 text-[#64748b] mx-auto opacity-50" />
          <p className="text-xs text-[#cbd5e1] font-semibold">Nenhuma venda ou campanha registrada ainda</p>
          <p className="text-[11px] text-[#94a3b8]">
            Adicione uma nova venda informando o nome do produto e a campanha de origem para visualizar os gráficos.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((camp, idx) => {
            const isSelected = selectedCampaign === camp.campaign_name;
            const percentageOfTotal = totalRevenueAll > 0 ? Math.round((camp.total_revenue / totalRevenueAll) * 100) : 0;
            const barWidth = Math.max(Math.round((camp.total_revenue / maxRevenue) * 100), 5);

            // Channel color badge
            let channelColor = '#3b82f6';
            if (camp.origin_type === 'indicacao') channelColor = '#ec4899';
            else if (camp.origin_type === 'organico') channelColor = '#10b981';
            else if (camp.origin_type === 'direto') channelColor = '#6b7280';

            return (
              <div
                key={camp.campaign_name || idx}
                onClick={() => onSelectCampaign && onSelectCampaign(isSelected ? null : camp.campaign_name)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1e3a8a]/20 border-[#3b82f6] ring-1 ring-[#3b82f6]'
                    : 'bg-[#0f1115] border-[#2d3139] hover:border-[#475569]'
                }`}
              >
                {/* Top Row: Campaign name, tag and revenue */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: channelColor }}
                    ></span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">
                      {camp.campaign_name}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1d23] text-[#94a3b8] border border-[#2d3139]">
                      {camp.channel}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-[#94a3b8] text-[11px]">
                      {camp.total_sales} {camp.total_sales === 1 ? 'venda' : 'vendas'}
                    </span>
                    <span className="font-bold text-[#34d399] text-xs sm:text-sm">
                      R$ {camp.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-mono text-[#94a3b8] bg-[#1a1d23] px-1.5 py-0.5 rounded">
                      {percentageOfTotal}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#1a1d23] h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%`, backgroundColor: channelColor }}
                  ></div>
                </div>

                {/* Products sold breakdown in this campaign */}
                {camp.products_sold && camp.products_sold.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-[#2d3139]/40 text-[10px]">
                    <span className="text-[#94a3b8] flex items-center space-x-1">
                      <Tag className="w-2.5 h-2.5 text-[#94a3b8]" />
                      <span>Produtos:</span>
                    </span>
                    {camp.products_sold.map((prod, pIdx) => (
                      <span
                        key={pIdx}
                        className="bg-[#1a1d23] text-[#cbd5e1] px-2 py-0.5 rounded border border-[#2d3139] flex items-center space-x-1"
                      >
                        <span className="font-medium text-white">{prod.product_name}</span>
                        <span className="text-[#94a3b8]">({prod.count}x)</span>
                        <span className="text-[#34d399] font-bold">R$ {prod.revenue.toLocaleString('pt-BR')}</span>
                      </span>
                    ))}
                    <span className="text-[#94a3b8] ml-auto flex items-center gap-1">
                      <span>Ticket Médio</span>
                      <TermExplainer term="Avg Ticket" translation="Valor médio gasto por cada comprador (Receita ÷ Vendas)" />
                      : <strong className="text-white">R$ {camp.avg_ticket.toLocaleString('pt-BR')}</strong>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
