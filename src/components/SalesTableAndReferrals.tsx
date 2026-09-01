import React, { useState, useEffect } from 'react';
import { Sale, SellerRankingItem, ArrivalLevel, ARRIVAL_LEVELS } from '../types';
import { 
  TrendingUp, 
  Search, 
  Trash2, 
  Plus, 
  UserCheck, 
  Users,
  Award,
  Layers, 
  DollarSign, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight,
  Target,
  Percent,
  PhoneCall,
  ShoppingBag,
  UserPlus
} from 'lucide-react';

interface SalesTableAndReferralsProps {
  onOpenAddModal: () => void;
  onRefreshMetrics: () => void;
  selectedCompanyId?: string;
  selectedLevelFilter?: ArrivalLevel | null;
  selectedCampaignFilter?: string | null;
  onOpenManageTeam?: () => void;
}

export const SalesTableAndReferrals: React.FC<SalesTableAndReferralsProps> = ({
  onOpenAddModal,
  onRefreshMetrics,
  selectedCompanyId,
  selectedLevelFilter,
  selectedCampaignFilter,
  onOpenManageTeam
}) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [sellersRanking, setSellersRanking] = useState<SellerRankingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [originFilter, setOriginFilter] = useState('all');
  const [sellerFilter, setSellerFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState<string>(selectedLevelFilter || 'all');
  const [rankingSortBy, setRankingSortBy] = useState<'revenue' | 'sales' | 'conversion'>('revenue');

  useEffect(() => {
    fetchSalesAndRanking();
  }, [selectedCompanyId]);

  useEffect(() => {
    if (selectedLevelFilter) {
      setLevelFilter(selectedLevelFilter);
    }
  }, [selectedLevelFilter]);

  const fetchSalesAndRanking = async () => {
    setIsLoading(true);
    try {
      const companyQuery = selectedCompanyId ? `company_id=${selectedCompanyId}` : '';
      const [salesRes, rankRes] = await Promise.all([
        fetch(`/api/sales?${companyQuery}`),
        fetch(`/api/sellers/ranking?${companyQuery}`)
      ]);
      const [salesData, rankData] = await Promise.all([
        salesRes.json(),
        rankRes.json()
      ]);
      setSales(Array.isArray(salesData) ? salesData : []);
      setSellersRanking(Array.isArray(rankData) ? rankData : []);
    } catch (err) {
      console.error('Error fetching sales and sellers ranking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro de venda?')) return;
    try {
      const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSalesAndRanking();
        onRefreshMetrics();
      }
    } catch (err) {
      console.error('Error deleting sale:', err);
    }
  };

  const handleUpdateArrivalLevel = async (saleId: string, newLevel: ArrivalLevel) => {
    try {
      const res = await fetch('/api/arrival-level', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: saleId, level: newLevel })
      });
      if (res.ok) {
        fetchSalesAndRanking();
        onRefreshMetrics();
      }
    } catch (err) {
      console.error('Error updating arrival level:', err);
    }
  };

  // Filter Sales
  const filteredSales = sales.filter(s => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchCust = (s.customer_name || '').toLowerCase().includes(q);
      const matchProd = (s.product_name || '').toLowerCase().includes(q);
      const matchCamp = (s.campaign_name || '').toLowerCase().includes(q);
      const matchSeller = (s.seller_name || '').toLowerCase().includes(q);
      if (!matchCust && !matchProd && !matchCamp && !matchSeller) return false;
    }

    if (originFilter !== 'all') {
      if (originFilter === 'campanha' && s.origin_type !== 'campanha') return false;
      if (originFilter === 'indicacao' && s.origin_type !== 'indicacao' && !s.referrer_name) return false;
      if (originFilter === 'organico' && s.origin_type !== 'organico') return false;
      if (originFilter === 'upsell' && !s.parent_sale_id) return false;
    }

    if (sellerFilter !== 'all') {
      if (s.seller_id !== sellerFilter && s.seller_name !== sellerFilter) return false;
    }

    if (levelFilter !== 'all') {
      const currentLevel = s.arrival_level || 'nivel_3_produto_a';
      if (currentLevel !== levelFilter) return false;
    }

    if (selectedCampaignFilter) {
      const cName = (s.campaign_name || s.channel || '').toLowerCase();
      if (!cName.includes(selectedCampaignFilter.toLowerCase())) return false;
    }

    return true;
  });

  const getOriginBadge = (sale: Sale) => {
    if (sale.origin_type === 'indicacao' || sale.referrer_name) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-pink-950/60 text-pink-300 border border-pink-700/40">
          Indicação {sale.referrer_name ? `(${sale.referrer_name})` : ''}
        </span>
      );
    }
    if (sale.origin_type === 'organico') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-700/40">
          Orgânico / Instagram
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-700/40">
        {sale.campaign_name || sale.channel || 'Tráfego Pago'}
      </span>
    );
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  // Sort ranking
  const sortedRanking = [...sellersRanking].sort((a, b) => {
    if (rankingSortBy === 'revenue') return b.total_revenue - a.total_revenue;
    if (rankingSortBy === 'sales') return b.sales_closed - a.sales_closed;
    return b.conversion_rate - a.conversion_rate;
  });

  // Calculate team summary stats
  const totalTeamLeads = sellersRanking.reduce((acc, s) => acc + s.leads_attended, 0);
  const totalTeamSales = sellersRanking.reduce((acc, s) => acc + s.sales_closed, 0);
  const totalTeamRevenue = sellersRanking.reduce((acc, s) => acc + s.total_revenue, 0);
  const avgTeamConversion = totalTeamLeads > 0 ? Math.round((totalTeamSales / totalTeamLeads) * 1000) / 10 : 0;

  return (
    <div id="vendas-e-vendedores" className="space-y-6">
      {/* Top Section / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1a1d23] border border-[#2d3139] rounded-xl p-4">
        <div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-[#38bdf8]" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Central de Atendimentos & Ranking de Vendedores
            </h2>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Acompanhe o desempenho de cada vendedor: quantos atendimentos foram realizados, quantas vendas foram fechadas e a taxa de conversão da equipe comercial.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenManageTeam && (
            <button
              onClick={onOpenManageTeam}
              className="flex items-center space-x-1.5 px-3 py-2 bg-[#2d3139] hover:bg-[#374151] text-white text-xs font-semibold rounded-lg border border-[#4b5563] transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Gerenciar Equipe</span>
            </button>
          )}
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#4f46e5] hover:to-[#4338ca] text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Lançar Atendimento / Venda</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Col Table of Sales (8 cols) | Right Col Seller Ranking (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Sales Table (Col 1-7 or 8) */}
        <div className="lg:col-span-7 bg-[#1a1d23] border border-[#2d3139] rounded-xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#2d3139]">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-[#10b981]" />
                <span>Histórico de Vendas Concretizadas</span>
              </h3>
              <span className="text-[11px] text-[#94a3b8]">
                {filteredSales.length} {filteredSales.length === 1 ? 'venda encontrada' : 'vendas encontradas'}
              </span>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Buscar cliente, vendedor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#0f1115] text-xs text-white pl-8 pr-3 py-1.5 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#6366f1] w-40"
                />
              </div>

              {/* Origin filter */}
              <select
                value={originFilter}
                onChange={(e) => setOriginFilter(e.target.value)}
                className="bg-[#0f1115] text-xs text-white py-1.5 px-2.5 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#6366f1] cursor-pointer"
              >
                <option value="all">Todas Origens</option>
                <option value="campanha">Tráfego Pago (Ads)</option>
                <option value="indicacao">Indicação</option>
                <option value="organico">Instagram / Orgânico</option>
                <option value="upsell">Upsell / Recompra</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#94a3b8]">Carregando vendas...</div>
          ) : filteredSales.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#94a3b8] space-y-2">
              <ShoppingBag className="w-8 h-8 text-[#94a3b8] mx-auto opacity-40" />
              <p>Nenhuma venda encontrada para os filtros selecionados.</p>
              <button
                onClick={onOpenAddModal}
                className="text-[#6366f1] hover:underline font-semibold"
              >
                Clique aqui para cadastrar um atendimento ou venda
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-[#1a1d23] text-[#94a3b8] border-b border-[#2d3139] text-[11px] font-semibold">
                  <tr>
                    <th className="py-2 pr-2">Cliente</th>
                    <th className="py-2 px-2">Vendedor</th>
                    <th className="py-2 px-2">Origem / Campanha</th>
                    <th className="py-2 px-2">Nível</th>
                    <th className="py-2 px-2">Data</th>
                    <th className="py-2 px-2 text-right">Valor (R$)</th>
                    <th className="py-2 pl-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d3139]/40">
                  {filteredSales.map((sale) => {
                    const currentLevel = sale.arrival_level || 'nivel_3_produto_a';
                    const levelInfo = ARRIVAL_LEVELS[currentLevel] || ARRIVAL_LEVELS.nivel_3_produto_a;

                    return (
                      <tr key={sale.id} className="hover:bg-[#0f1115]/50 transition-colors">
                        {/* Cliente & Produto */}
                        <td className="py-2.5 pr-2 font-medium text-white">
                          <div>
                            <span className="font-bold">{sale.customer_name || 'Cliente'}</span>
                            <div className="text-[10px] text-[#94a3b8] truncate max-w-[140px]">
                              {sale.product_name || 'Produto Principal'}
                            </div>
                          </div>
                        </td>

                        {/* Vendedor Responsável */}
                        <td className="py-2.5 px-2">
                          {sale.seller_name ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#2d3139] text-sky-300 border border-[#3b82f6]/30">
                              <UserCheck className="w-2.5 h-2.5 text-sky-400" />
                              <span>{sale.seller_name}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#64748b] italic">Sem vendedor</span>
                          )}
                        </td>

                        {/* Origem */}
                        <td className="py-2.5 px-2">
                          {getOriginBadge(sale)}
                        </td>

                        {/* Nível de Chegada Selector */}
                        <td className="py-2.5 px-2">
                          <select
                            value={currentLevel}
                            onChange={(e) => handleUpdateArrivalLevel(sale.id, e.target.value as ArrivalLevel)}
                            className="bg-[#0f1115] text-[10px] font-semibold py-0.5 px-1.5 rounded border border-[#2d3139] cursor-pointer focus:outline-none focus:border-[#6366f1]"
                            style={{ color: levelInfo.color }}
                          >
                            <option value="nivel_1_lead">1. Lead</option>
                            <option value="nivel_2_negociacao">2. Negociação</option>
                            <option value="nivel_3_produto_a">3. Prod. Principal</option>
                            <option value="nivel_4_upsell">4. Upsell</option>
                            <option value="nivel_5_promotor">5. Promotor</option>
                          </select>
                        </td>

                        {/* Data */}
                        <td className="py-2.5 px-2 text-[#94a3b8] text-[11px] whitespace-nowrap">
                          {formatDate(sale.sale_date)}
                        </td>

                        {/* Valor */}
                        <td className="py-2.5 px-2 text-right font-bold text-[#34d399] whitespace-nowrap">
                          R$ {sale.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>

                        {/* Ações */}
                        <td className="py-2.5 pl-2 text-center">
                          <button
                            onClick={() => handleDeleteSale(sale.id)}
                            className="p-1 text-[#94a3b8] hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors cursor-pointer"
                            title="Excluir Venda"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Col: RANKING DE VENDEDORES (Col 8-12) */}
        <div className="lg:col-span-5 bg-[#1a1d23] border border-[#2d3139] rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2d3139]">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#f59e0b]" />
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Ranking de Vendedores
                </h3>
                <p className="text-[10px] text-[#94a3b8]">
                  Atendimentos realizados vs. Vendas convertidas
                </p>
              </div>
            </div>

            {/* Sort options */}
            <div className="flex items-center space-x-1 bg-[#0f1115] p-0.5 rounded-lg border border-[#2d3139]">
              <button
                onClick={() => setRankingSortBy('revenue')}
                className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                  rankingSortBy === 'revenue' ? 'bg-[#f59e0b] text-black' : 'text-[#94a3b8] hover:text-white'
                }`}
                title="Ordenar por Faturamento"
              >
                R$ Faturamento
              </button>
              <button
                onClick={() => setRankingSortBy('sales')}
                className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                  rankingSortBy === 'sales' ? 'bg-[#38bdf8] text-black' : 'text-[#94a3b8] hover:text-white'
                }`}
                title="Ordenar por Vendas"
              >
                Vendas
              </button>
              <button
                onClick={() => setRankingSortBy('conversion')}
                className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                  rankingSortBy === 'conversion' ? 'bg-[#10b981] text-black' : 'text-[#94a3b8] hover:text-white'
                }`}
                title="Ordenar por Taxa de Conversão"
              >
                % Conv.
              </button>
            </div>
          </div>

          {/* Quick Summary Pills */}
          <div className="grid grid-cols-3 gap-2 bg-[#0f1115] p-2.5 rounded-lg border border-[#2d3139]">
            <div className="text-center">
              <span className="text-[10px] text-[#94a3b8] block">Atendimentos</span>
              <span className="text-sm font-extrabold text-sky-400">{totalTeamLeads}</span>
            </div>
            <div className="text-center border-x border-[#2d3139]">
              <span className="text-[10px] text-[#94a3b8] block">Vendas Fechadas</span>
              <span className="text-sm font-extrabold text-emerald-400">{totalTeamSales}</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-[#94a3b8] block">Conv. Média</span>
              <span className="text-sm font-extrabold text-amber-400">{avgTeamConversion}%</span>
            </div>
          </div>

          {/* Sellers Cards List */}
          {sortedRanking.length === 0 ? (
            <div className="py-8 text-center bg-[#0f1115] rounded-lg border border-[#2d3139] p-4 text-xs text-[#94a3b8] space-y-2">
              <Users className="w-6 h-6 text-[#94a3b8] mx-auto opacity-50" />
              <p>Nenhum vendedor ou atendimento registrado nesta empresa.</p>
              <p className="text-[10px]">Lance atendimentos atribuindo os vendedores responsáveis para visualizar o ranking.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {sortedRanking.map((seller, idx) => {
                const isFirst = idx === 0;
                const isSecond = idx === 1;
                const isThird = idx === 2;

                const medalEmoji = isFirst ? '🥇 1º' : isSecond ? '🥈 2º' : isThird ? '🥉 3º' : `${idx + 1}º`;
                const medalBg = isFirst 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                  : isSecond 
                    ? 'bg-slate-400/20 border-slate-400/50 text-slate-200' 
                    : isThird 
                      ? 'bg-amber-700/20 border-amber-700/50 text-amber-400' 
                      : 'bg-[#2d3139]/40 border-[#2d3139] text-[#94a3b8]';

                return (
                  <div 
                    key={seller.seller_id}
                    className={`bg-[#0f1115] p-3.5 rounded-xl border transition-all hover:border-[#6366f1]/50 ${
                      isFirst ? 'border-amber-500/40 bg-gradient-to-br from-[#1a1d23] to-[#0f1115]' : 'border-[#2d3139]'
                    }`}
                  >
                    {/* Top Row: Medal/Rank, Name, Role and Total Revenue */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-black border ${medalBg}`}>
                          {medalEmoji}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                            <span>{seller.seller_name}</span>
                            {isFirst && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                          </h4>
                          {seller.seller_role && (
                            <span className="text-[10px] text-[#94a3b8] block">
                              {seller.seller_role}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-[#34d399] block">
                          R$ {seller.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[9px] text-[#94a3b8]">
                          Ticket Médio: R$ {seller.avg_ticket.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar of Conversion */}
                    <div className="mt-2.5 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#94a3b8] flex items-center space-x-1">
                          <PhoneCall className="w-3 h-3 text-sky-400 inline" />
                          <span>{seller.leads_attended} atendimentos</span>
                          <span className="text-[#475569]">➔</span>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
                          <span className="font-bold text-white">{seller.sales_closed} vendas</span>
                        </span>
                        <span className="font-black text-amber-300">
                          {seller.conversion_rate}% conversão
                        </span>
                      </div>

                      <div className="w-full bg-[#1e232d] h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] via-[#10b981] to-[#f59e0b] transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(5, seller.conversion_rate))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
