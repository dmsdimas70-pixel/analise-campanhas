import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  ArrowUpRight,
  FileText,
  Plus,
  Store,
  Share2,
  ChevronDown,
  ChevronUp,
  Award,
  Flame,
  ArrowRight,
  ExternalLink,
  Target,
  BarChart3,
  Instagram
} from 'lucide-react';
import { 
  FunnelMetricsResponse, 
  ArrivalLevelsResponse, 
  TimelineMetricsResponse, 
  AttributionTreeResponse,
  SellerRankingItem
} from '../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface SimpleOverviewDashboardProps {
  funnelMetrics: FunnelMetricsResponse | null;
  arrivalData: ArrivalLevelsResponse | null;
  timelineData: TimelineMetricsResponse | null;
  attributionData: AttributionTreeResponse | null;
  selectedCompanyId: string;
  onOpenAddModal: () => void;
  onOpenReportModal: () => void;
  onGoToStoreTraffic: () => void;
  onGoToSales: () => void;
  onGoToInstagram: () => void;
  renderAdvancedCharts: () => React.ReactNode;
}

export const SimpleOverviewDashboard: React.FC<SimpleOverviewDashboardProps> = ({
  funnelMetrics,
  arrivalData,
  timelineData,
  attributionData,
  selectedCompanyId,
  onOpenAddModal,
  onOpenReportModal,
  onGoToStoreTraffic,
  onGoToSales,
  onGoToInstagram,
  renderAdvancedCharts
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [topSellers, setTopSellers] = useState<SellerRankingItem[]>([]);

  // Fetch top sellers ranking for quick summary
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const query = selectedCompanyId ? `company_id=${selectedCompanyId}` : '';
        const res = await fetch(`/api/sellers/ranking?${query}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setTopSellers(data.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching ranking:', err);
      }
    };
    fetchSellers();
  }, [selectedCompanyId]);

  // Key metrics
  const totalLeads = arrivalData?.total_contacts || funnelMetrics?.summary.total_leads || 0;
  const convertedA = funnelMetrics?.summary.converted_to_A || 0;
  const totalRevenue = arrivalData?.total_revenue || funnelMetrics?.summary.total_revenue || 0;
  const conversionRate = funnelMetrics?.summary.conversion_rate_A || (totalLeads > 0 ? Math.round((convertedA / totalLeads) * 100) : 0);
  const avgTicket = convertedA > 0 ? Math.round(totalRevenue / convertedA) : 0;

  // Acquisition channels parsed from attributionData or default friendly list
  const channelList = attributionData?.tree_data?.map(item => ({
    name: item.name,
    category: item.category,
    count: item.count,
    revenue: item.revenue,
    percent: item.percentage_of_total,
    color: item.color
  })) || [
    { name: 'Anúncios no Instagram/Face (Meta Ads)', category: 'Campanhas Pagas', count: 18, revenue: 16500, percent: 45, color: '#3b82f6' },
    { name: 'Anúncios Google Pesquisa', category: 'Campanhas Pagas', count: 10, revenue: 9800, percent: 27, color: '#06b6d4' },
    { name: 'Indicação de Clientes (Boca a Boca)', category: 'Orgânico & SEO', count: 8, revenue: 6400, percent: 18, color: '#ec4899' },
    { name: 'Instagram Orgânico (Posts & Reels)', category: 'Orgânico & SEO', count: 4, revenue: 3800, percent: 10, color: '#e1306c' }
  ];

  // Simple Timeline chart data
  const chartPoints = timelineData?.timeline?.map(t => ({
    period: t.formatted_period || t.period,
    receita: t.receita_total,
    vendas: t.conversoes_produto_a
  })) || [];

  return (
    <div className="space-y-6">
      {/* 1. Header Hero - Boas Vindas & Ações Rápidas */}
      <div className="bg-gradient-to-br from-[#1a1d23] via-[#16181f] to-[#0f1115] border border-[#2d3139] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Visão Geral</span>
              </span>
              <span className="text-xs text-[#94a3b8]">Resultados do Período</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
              Painel de Clientes &amp; Faturamento
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 max-w-2xl">
              Aqui você vê quantas pessoas entraram em contato, quantas compras foram fechadas e de onde seus clientes vieram.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Lançar Atendimento</span>
            </button>

            <button
              onClick={onGoToStoreTraffic}
              className="flex items-center space-x-2 bg-[#1e1b4b] hover:bg-[#2e1065] text-indigo-300 hover:text-white border border-indigo-500/40 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <Store className="w-4 h-4 text-indigo-400" />
              <span>Diário da Loja</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="flex items-center space-x-2 bg-[#222630] hover:bg-[#2d3139] text-[#e2e8f0] border border-[#3f444e] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#c084fc]" />
              <span>Relatório WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 5 Cards de Indicadores Essenciais (Sem Jargão) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Card 1: Pessoas Atendidas */}
        <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-4 shadow-sm hover:border-[#3b82f6]/40 transition-all">
          <div className="flex items-center justify-between text-[#94a3b8] mb-1.5">
            <span className="text-xs font-semibold">1. Clientes Atendidos</span>
            <div className="p-1.5 rounded-lg bg-[#3b82f6]/10 text-[#60a5fa]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalLeads}
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-1">
            Contatos que chegaram no período
          </p>
        </div>

        {/* Card 2: Vendas Fechadas */}
        <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-4 shadow-sm hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-[#94a3b8] mb-1.5">
            <span className="text-xs font-semibold">2. Vendas Fechadas</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {convertedA}
          </div>
          <p className="text-[11px] text-emerald-400/90 font-medium mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Taxa: {conversionRate}% das pessoas compraram</span>
          </p>
        </div>

        {/* Card 3: Faturamento Total */}
        <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-4 shadow-sm hover:border-amber-500/40 transition-all col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#94a3b8] mb-1.5">
            <span className="text-xs font-semibold">3. Faturamento Total</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-1">
            Valor total faturado
          </p>
        </div>

        {/* Card 4: Ticket Médio */}
        <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-4 shadow-sm hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-[#94a3b8] mb-1.5">
            <span className="text-xs font-semibold">4. Ticket Médio</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">
            R$ {avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-1">
            Média gasta por cliente
          </p>
        </div>

        {/* Card 5: Indicações / Boca a Boca */}
        <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-4 shadow-sm hover:border-pink-500/40 transition-all">
          <div className="flex items-center justify-between text-[#94a3b8] mb-1.5">
            <span className="text-xs font-semibold">5. Boca a Boca / Indicação</span>
            <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-pink-400">
            {funnelMetrics?.summary.indications_converted || 0}
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-1">
            Vendas vindas por indicação
          </p>
        </div>

      </div>

      {/* 3. Seção Visual Dividida: Origem dos Clientes & Evolução das Vendas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bloco A: De Onde Chegaram os Clientes */}
        <div className="bg-[#1a1d23] border border-[#2d3139] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#2d3139] pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>📍 De Onde Vieram Seus Clientes?</span>
              </h3>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Saiba quais canais e anúncios trouxeram mais faturamento
              </p>
            </div>
            <button
              onClick={onGoToSales}
              className="text-xs font-bold text-[#818cf8] hover:text-white flex items-center space-x-1 cursor-pointer"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {channelList.map((ch, idx) => (
              <div key={idx} className="bg-[#0f1115] p-3 rounded-xl border border-[#2d3139]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: ch.color || '#6366f1' }}
                    />
                    <span className="font-bold text-white">{ch.name}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">
                    R$ {ch.revenue.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#222630] h-2 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.max(ch.percent, 8)}%`,
                      backgroundColor: ch.color || '#6366f1' 
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#94a3b8] mt-1.5">
                  <span>{ch.count} vendas / contatos</span>
                  <span>{ch.percent}% do total faturado</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco B: Evolução das Vendas e Faturamento */}
        <div className="bg-[#1a1d23] border border-[#2d3139] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="border-b border-[#2d3139] pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>📈 Evolução das Vendas no Período</span>
            </h3>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Acompanhamento diário e semanal de faturamento
            </p>
          </div>

          <div className="h-60 sm:h-64 w-full pt-4">
            {chartPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartPoints}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" />
                  <XAxis 
                    dataKey="period" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false}
                    tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f1115', 
                      borderColor: '#2d3139',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                    formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Faturamento']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="receita" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#94a3b8]">
                Sem dados para o período selecionado
              </div>
            )}
          </div>

          <div className="bg-[#0f1115] p-3 rounded-xl border border-[#2d3139] flex items-center justify-between text-xs mt-2">
            <span className="text-[#94a3b8]">Meta mensal da empresa:</span>
            <span className="text-white font-bold font-mono">R$ 50.000,00</span>
          </div>
        </div>

      </div>

      {/* 4. Destaque dos Vendedores */}
      {topSellers.length > 0 && (
        <div className="bg-[#1a1d23] border border-[#2d3139] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Equipe de Vendas
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Quem mais fechou vendas e atendeu clientes
                </p>
              </div>
            </div>

            <button
              onClick={onGoToSales}
              className="text-xs font-bold text-[#818cf8] hover:text-white flex items-center space-x-1 cursor-pointer"
            >
              <span>Ver Ranking Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {topSellers.map((seller, idx) => (
              <div 
                key={seller.seller_id}
                className="bg-[#0f1115] border border-[#2d3139] rounded-xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-sm shrink-0"
                    style={{ backgroundColor: seller.avatar_color || '#6366f1' }}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white truncate max-w-[110px]">
                      {seller.seller_name}
                    </div>
                    <div className="text-[10px] text-[#94a3b8]">
                      {seller.sales_closed} vendas ({seller.conversion_rate || 0}%)
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono font-bold text-xs text-emerald-400">
                  R$ {seller.total_revenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Seção Opcional de Métricas Técnicas Avançadas (Retrátil) */}
      <div className="border border-[#2d3139] rounded-2xl overflow-hidden bg-[#16181f]">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-left bg-[#1a1d23] hover:bg-[#222630] transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="font-bold text-xs sm:text-sm text-white block">
                {showAdvanced ? 'Ocultar Gráficos Avançados de Tráfego' : '🔍 Ver Gráficos Técnicos Avançados (Gestor de Tráfego)'}
              </span>
              <span className="text-[11px] text-[#94a3b8]">
                Níveis 1 a 5, Funil Duplo Sankey, Desempenho por Campanha e Árvore de Atribuição
              </span>
            </div>
          </div>

          <div className="p-1 rounded bg-[#0f1115] text-[#94a3b8]">
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showAdvanced && (
          <div className="p-4 sm:p-6 border-t border-[#2d3139] bg-[#0f1115] space-y-6">
            <div className="bg-[#1a1d23] border border-indigo-500/30 rounded-xl p-3 text-xs text-indigo-300">
              💡 <strong>Modo Técnico:</strong> Estes gráficos mostram o aprofundamento das campanhas pagas, estágios detalhados de funil e mapa de calor de atribuição.
            </div>
            {renderAdvancedCharts()}
          </div>
        )}
      </div>

    </div>
  );
};
