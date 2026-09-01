import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Smartphone, 
  Check, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Layers, 
  Filter,
  BarChart2,
  PieChart as PieIcon,
  Sparkles,
  ArrowRight,
  Award,
  Share2
} from 'lucide-react';
import { Sale, CustomerLead, ArrivalLevelsResponse, ARRIVAL_LEVELS, CampaignSummaryItem, FunnelMetricsResponse, SellerRankingItem } from '../types';

interface TrafficReportsViewProps {
  onOpenAddModal: () => void;
  selectedCompanyId?: string;
}

export const TrafficReportsView: React.FC<TrafficReportsViewProps> = ({ 
  onOpenAddModal,
  selectedCompanyId 
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [periodPreset, setPeriodPreset] = useState<'month' | 'last7' | 'today' | 'all' | 'custom'>('month');
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(todayStr);
  const [campaignFilter, setCampaignFilter] = useState('all');

  const [sales, setSales] = useState<Sale[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignSummaryItem[]>([]);
  const [arrivalData, setArrivalData] = useState<ArrivalLevelsResponse | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelMetricsResponse | null>(null);
  const [sellersRanking, setSellersRanking] = useState<SellerRankingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [startDate, endDate, selectedCompanyId]);

  const handlePresetChange = (preset: 'month' | 'last7' | 'today' | 'all' | 'custom') => {
    setPeriodPreset(preset);
    const now = new Date();
    if (preset === 'today') {
      const today = now.toISOString().split('T')[0];
      setStartDate(today);
      setEndDate(today);
    } else if (preset === 'last7') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      setStartDate(d.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (preset === 'month') {
      const fDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      setStartDate(fDay);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (preset === 'all') {
      setStartDate('2025-01-01');
      setEndDate(now.toISOString().split('T')[0]);
    }
  };

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const companyPart = selectedCompanyId ? `&company_id=${selectedCompanyId}` : '';
      const companyOnly = selectedCompanyId ? `company_id=${selectedCompanyId}` : '';
      const query = `startDate=${startDate}&endDate=${endDate}${companyPart}`;

      const [salesRes, campRes, arrivalRes, funnelRes, rankRes] = await Promise.all([
        fetch(`/api/sales?${companyOnly}`),
        fetch(`/api/metrics/campaigns-summary?${query}`),
        fetch(`/api/metrics/arrival-levels?${query}`),
        fetch(`/api/metrics/conversion-funnel?${query}`),
        fetch(`/api/sellers/ranking?${companyOnly}`)
      ]);

      const [salesJson, campJson, arrivalJson, funnelJson, rankJson] = await Promise.all([
        salesRes.json(),
        campRes.json(),
        arrivalRes.json(),
        funnelRes.json(),
        rankRes.json()
      ]);

      setSales(Array.isArray(salesJson) ? salesJson : []);
      setCampaigns(Array.isArray(campJson) ? campJson : []);
      setArrivalData(arrivalJson);
      setFunnelData(funnelJson);
      setSellersRanking(Array.isArray(rankJson) ? rankJson : []);
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered sales
  const filteredSales = sales.filter(s => {
    const saleDate = s.sale_date ? s.sale_date.split('T')[0] : '';
    if (startDate && saleDate < startDate) return false;
    if (endDate && saleDate > endDate) return false;
    if (campaignFilter !== 'all') {
      const cName = (s.campaign_name || s.channel || '').toLowerCase();
      if (!cName.includes(campaignFilter.toLowerCase())) return false;
    }
    return true;
  });

  // Calculate totals
  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.amount, 0);
  const totalSalesCount = filteredSales.length;
  const avgTicket = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
  const totalLeads = funnelData?.totalLeads || totalSalesCount;
  const conversionRate = totalLeads > 0 ? ((totalSalesCount / totalLeads) * 100).toFixed(1) : '0';

  // Format date helper
  const formatDateBR = (dStr: string) => {
    try {
      const [y, m, d] = dStr.split('-');
      return `${d}/${m}/${y}`;
    } catch {
      return dStr;
    }
  };

  // Generate formatted WhatsApp text report
  const generateWhatsAppReport = () => {
    const periodHeader = `📊 *RELATÓRIO DE TRÁFEGO & CONVERSÃO*
📅 *Período:* ${formatDateBR(startDate)} até ${formatDateBR(endDate)}
🏢 *Status:* Performance de Chegada & Vendas

══════════════════════
💰 *RESUMO GERAL*
• *Total Faturado:* R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• *Vendas Realizadas:* ${totalSalesCount}
• *Ticket Médio:* R$ ${avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• *Leads / Contatos Chegados:* ${totalLeads}
• *Taxa de Conversão Geral:* ${conversionRate}%

══════════════════════
🎯 *CHEGADA POR NÍVEL DE CONSCIÊNCIA*
${arrivalData ? arrivalData.summary.map(s => `• *${s.name.split('(')[0].trim()}:* ${s.count} (${s.percentage}%) - R$ ${s.total_amount.toLocaleString('pt-BR')}`).join('\n') : 'Sem dados'}

══════════════════════
🏆 *RANKING DE VENDEDORES (Atendimentos vs Vendas)*
${sellersRanking.length > 0 ? sellersRanking.map((sel, i) => `${i + 1}º *${sel.seller_name}* (${sel.seller_role || 'Vendas'})
   📞 ${sel.leads_attended} atendimentos ➔ 🛒 ${sel.sales_closed} vendas (${sel.conversion_rate}% conv.)
   💵 Faturamento: R$ ${sel.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`).join('\n\n') : 'Sem vendedores registrados.'}

══════════════════════
🚀 *DESEMPENHO POR CANAL / CAMPANHA*
${campaigns.slice(0, 5).map(c => `• *${c.campaign_name}:* ${c.sales_count} vendas | R$ ${c.total_revenue.toLocaleString('pt-BR')} | ROAS: ${c.roas}x`).join('\n')}

══════════════════════
✨ *Origem.Vendas* - Gestão de Tráfego Inteligente`;

    return periodHeader;
  };

  const handleCopyWhatsApp = () => {
    const text = generateWhatsAppReport();
    navigator.clipboard.writeText(text);
    setCopiedWhatsapp(true);
    setTimeout(() => setCopiedWhatsapp(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="relatorios-executivos" className="space-y-6">
      
      {/* Top Banner / Actions */}
      <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#c084fc]" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Gerador de Relatórios Executivos de Chegada &amp; Vendas
            </h2>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Gere relatórios claros para clientes e diretores com gráficos de conversão, níveis de chegada e ranking da equipe comercial.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyWhatsApp}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
              copiedWhatsapp 
                ? 'bg-emerald-600 text-white' 
                : 'bg-[#25D366] hover:bg-[#20bd5a] text-black'
            }`}
          >
            {copiedWhatsapp ? <Check className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            <span>{copiedWhatsapp ? 'Copiado para WhatsApp!' : 'Copiar Resumo WhatsApp'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#2d3139] hover:bg-[#374151] text-white rounded-lg text-xs font-semibold border border-[#4b5563] transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0f1115] border border-[#2d3139] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Presets */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[#94a3b8] font-bold text-[11px] uppercase mr-1">Período:</span>
          <button
            onClick={() => handlePresetChange('today')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
              periodPreset === 'today' ? 'bg-[#6366f1] text-white' : 'bg-[#1a1d23] text-[#94a3b8] hover:text-white'
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => handlePresetChange('last7')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
              periodPreset === 'last7' ? 'bg-[#6366f1] text-white' : 'bg-[#1a1d23] text-[#94a3b8] hover:text-white'
            }`}
          >
            Últimos 7 dias
          </button>
          <button
            onClick={() => handlePresetChange('month')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
              periodPreset === 'month' ? 'bg-[#6366f1] text-white' : 'bg-[#1a1d23] text-[#94a3b8] hover:text-white'
            }`}
          >
            Este Mês
          </button>
          <button
            onClick={() => handlePresetChange('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
              periodPreset === 'all' ? 'bg-[#6366f1] text-white' : 'bg-[#1a1d23] text-[#94a3b8] hover:text-white'
            }`}
          >
            Todo o Histórico
          </button>
        </div>

        {/* Custom Dates */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-[#1a1d23] px-2.5 py-1 rounded-lg border border-[#2d3139]">
            <Calendar className="w-3.5 h-3.5 text-[#6366f1]" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPeriodPreset('custom');
              }}
              className="bg-transparent text-white text-[11px] focus:outline-none"
            />
            <span className="text-[#94a3b8]">➔</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPeriodPreset('custom');
              }}
              className="bg-transparent text-white text-[11px] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* EXECUTIVE REPORT DOCUMENT PREVIEW */}
      <div className="bg-[#1a1d23] border border-[#2d3139] rounded-2xl p-6 shadow-xl space-y-6 print:bg-white print:text-black print:p-0 print:border-none">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#2d3139] print:border-gray-300 gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#6366f1] bg-[#6366f1]/10 px-2 py-0.5 rounded print:text-indigo-600">
              Relatório Executivo de Performance
            </span>
            <h1 className="text-xl font-black text-white mt-1 print:text-black">
              Chegada de Clientes, Vendas &amp; Ranking Comercial
            </h1>
            <p className="text-xs text-[#94a3b8] print:text-gray-600">
              Período Analisado: <span className="text-white font-bold print:text-black">{formatDateBR(startDate)}</span> até <span className="text-white font-bold print:text-black">{formatDateBR(endDate)}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-[#34d399] bg-[#059669]/20 px-3 py-1 rounded-full border border-[#059669]/40 print:border-emerald-600 print:text-emerald-800">
              ● Tráfego Ativo &amp; Monitorado
            </span>
          </div>
        </div>

        {/* 4 Key Executive Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0f1115] print:bg-gray-50 p-4 rounded-xl border border-[#2d3139] print:border-gray-200">
            <div className="flex items-center justify-between text-[#94a3b8] print:text-gray-600 text-xs mb-1">
              <span>Faturamento Total</span>
              <DollarSign className="w-4 h-4 text-[#34d399]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white print:text-black">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-[#34d399] font-bold">100% de receita rastreada</span>
          </div>

          <div className="bg-[#0f1115] print:bg-gray-50 p-4 rounded-xl border border-[#2d3139] print:border-gray-200">
            <div className="flex items-center justify-between text-[#94a3b8] print:text-gray-600 text-xs mb-1">
              <span>Vendas Concluídas</span>
              <TrendingUp className="w-4 h-4 text-[#6366f1]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white print:text-black">
              {totalSalesCount}
            </div>
            <span className="text-[10px] text-[#94a3b8] print:text-gray-600">Transações no período</span>
          </div>

          <div className="bg-[#0f1115] print:bg-gray-50 p-4 rounded-xl border border-[#2d3139] print:border-gray-200">
            <div className="flex items-center justify-between text-[#94a3b8] print:text-gray-600 text-xs mb-1">
              <span>Ticket Médio</span>
              <Target className="w-4 h-4 text-[#38bdf8]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white print:text-black">
              R$ {avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-sky-400 font-bold">Por cliente convertido</span>
          </div>

          <div className="bg-[#0f1115] print:bg-gray-50 p-4 rounded-xl border border-[#2d3139] print:border-gray-200">
            <div className="flex items-center justify-between text-[#94a3b8] print:text-gray-600 text-xs mb-1">
              <span>Taxa de Conversão</span>
              <BarChart2 className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white print:text-black">
              {conversionRate}%
            </div>
            <span className="text-[10px] text-amber-400 font-bold">{totalSalesCount} vendas de {totalLeads} leads</span>
          </div>
        </div>

        {/* Section 1: Ranking de Vendedores / Equipe Comercial */}
        <div className="bg-[#0f1115] print:bg-gray-50 p-4 rounded-xl border border-[#2d3139] print:border-gray-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#2d3139]">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#f59e0b]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider print:text-black">
                Desempenho da Equipe Comercial &amp; Ranking de Vendedores
              </h3>
            </div>
            <span className="text-[10px] text-[#94a3b8]">Atendimentos vs Vendas fechadas</span>
          </div>

          {sellersRanking.length === 0 ? (
            <p className="text-xs text-[#94a3b8] py-4 text-center">Nenhum vendedor registrado nesta empresa.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#94a3b8] border-b border-[#2d3139] text-[10px]">
                  <tr>
                    <th className="py-2">Posição &amp; Vendedor</th>
                    <th className="py-2 text-center">Atendimentos</th>
                    <th className="py-2 text-center">Vendas Fechadas</th>
                    <th className="py-2 text-center">% Conversão</th>
                    <th className="py-2 text-right">Faturamento Total</th>
                    <th className="py-2 text-right">Ticket Médio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d3139]/40 text-white print:text-black">
                  {sellersRanking.map((sel, idx) => (
                    <tr key={sel.seller_id} className="hover:bg-[#1a1d23]/50">
                      <td className="py-2.5 flex items-center space-x-2 font-bold">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          idx === 0 ? 'bg-amber-500 text-black' : idx === 1 ? 'bg-slate-400 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-[#2d3139] text-[#94a3b8]'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <span>{sel.seller_name}</span>
                          <span className="text-[10px] text-[#94a3b8] block font-normal">{sel.seller_role || 'Vendas'}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-center font-semibold text-sky-400">{sel.leads_attended}</td>
                      <td className="py-2.5 text-center font-bold text-emerald-400">{sel.sales_closed}</td>
                      <td className="py-2.5 text-center font-black text-amber-300">{sel.conversion_rate}%</td>
                      <td className="py-2.5 text-right font-black text-[#34d399]">
                        R$ {sel.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 text-right text-[#94a3b8]">
                        R$ {sel.avg_ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 2: Chegada por Níveis (Níveis 1 a 5) */}
        <div className="bg-[#0f1115] print:bg-gray-50 p-4 rounded-xl border border-[#2d3139] print:border-gray-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#2d3139]">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#ec4899]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider print:text-black">
                Chegada de Clientes por Nível de Consciência (Níveis 1 a 5)
              </h3>
            </div>
            <span className="text-[10px] text-[#94a3b8]">Classificação do Funil</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
            {arrivalData?.summary.map((lvl) => {
              const info = ARRIVAL_LEVELS[lvl.level as keyof typeof ARRIVAL_LEVELS] || ARRIVAL_LEVELS.nivel_3_produto_a;
              return (
                <div key={lvl.level} className="bg-[#1a1d23] print:bg-white p-3 rounded-lg border border-[#2d3139] print:border-gray-300">
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${info.badgeBg} ${info.badgeText} border ${info.badgeBorder}`}>
                    {info.shortLabel}
                  </span>
                  <div className="mt-2">
                    <span className="text-lg font-black text-white print:text-black">{lvl.count}</span>
                    <span className="text-[10px] text-[#94a3b8] ml-1">({lvl.percentage}%)</span>
                  </div>
                  <div className="text-[10px] font-bold text-[#34d399] mt-0.5">
                    R$ {lvl.total_amount.toLocaleString('pt-BR')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Performance por Canal / Campanha */}
        <div className="bg-[#0f1115] print:bg-gray-50 p-4 rounded-xl border border-[#2d3139] print:border-gray-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#2d3139]">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-[#38bdf8]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider print:text-black">
                Desempenho por Canal &amp; Campanhas de Anúncios
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#94a3b8] border-b border-[#2d3139] text-[10px]">
                <tr>
                  <th className="py-2">Canal / Campanha</th>
                  <th className="py-2 text-center">Vendas Fechadas</th>
                  <th className="py-2 text-right">Faturamento Gerado</th>
                  <th className="py-2 text-right">Investimento</th>
                  <th className="py-2 text-right">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3139]/40 text-white print:text-black">
                {campaigns.map((c) => (
                  <tr key={c.campaign_name} className="hover:bg-[#1a1d23]/50">
                    <td className="py-2 font-semibold flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#6366f1]"></span>
                      <span>{c.campaign_name}</span>
                    </td>
                    <td className="py-2 text-center font-bold">{c.sales_count}</td>
                    <td className="py-2 text-right font-black text-[#34d399]">
                      R$ {c.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 text-right text-[#94a3b8]">
                      R$ {c.ad_spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 text-right font-black text-[#38bdf8]">
                      {c.roas}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
