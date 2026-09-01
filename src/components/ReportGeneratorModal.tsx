import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Share2, 
  Layers, 
  ArrowRight, 
  X, 
  BarChart2, 
  Smartphone,
  ExternalLink,
  Award
} from 'lucide-react';
import { Sale, CustomerLead, ArrivalLevelsResponse, ARRIVAL_LEVELS, CampaignSummaryItem, FunnelMetricsResponse, SellerRankingItem } from '../types';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompanyId?: string;
  initialStartDate?: string;
  initialEndDate?: string;
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  selectedCompanyId,
  initialStartDate,
  initialEndDate
}) => {
  // Date preset
  const todayStr = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [periodPreset, setPeriodPreset] = useState<'month' | 'last7' | 'today' | 'all' | 'custom'>('month');
  const [startDate, setStartDate] = useState(initialStartDate || firstDayOfMonth);
  const [endDate, setEndDate] = useState(initialEndDate || todayStr);
  const [campaignFilter, setCampaignFilter] = useState('all');

  // Loaded data
  const [sales, setSales] = useState<Sale[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignSummaryItem[]>([]);
  const [arrivalData, setArrivalData] = useState<ArrivalLevelsResponse | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelMetricsResponse | null>(null);
  const [sellersRanking, setSellersRanking] = useState<SellerRankingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Copy feedback
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchReportData();
    }
  }, [isOpen, startDate, endDate, selectedCompanyId]);

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

  if (!isOpen) return null;

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

  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.amount, 0);
  const totalSalesCount = filteredSales.length;
  const avgTicket = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
  const totalLeads = funnelData?.totalLeads || totalSalesCount;
  const conversionRate = totalLeads > 0 ? ((totalSalesCount / totalLeads) * 100).toFixed(1) : '0';

  const formatDateBR = (dStr: string) => {
    try {
      const [y, m, d] = dStr.split('-');
      return `${d}/${m}/${y}`;
    } catch {
      return dStr;
    }
  };

  const generateWhatsAppReport = () => {
    return `📊 *RELATÓRIO DE TRÁFEGO & PERFORMANCE*
📅 *Período:* ${formatDateBR(startDate)} até ${formatDateBR(endDate)}

══════════════════════
💰 *RESUMO FINANCEIRO & CONVERSÃO*
• *Faturamento Total:* R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• *Vendas Realizadas:* ${totalSalesCount}
• *Ticket Médio:* R$ ${avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• *Taxa de Conversão:* ${conversionRate}%

══════════════════════
🏆 *RANKING DE VENDEDORES*
${sellersRanking.map((sel, i) => `${i + 1}º *${sel.seller_name}* (${sel.seller_role || 'Vendedor'}): ${sel.leads_attended} atendimentos ➔ ${sel.sales_closed} vendas (${sel.conversion_rate}%) | R$ ${sel.total_revenue.toLocaleString('pt-BR')}`).join('\n')}

══════════════════════
🎯 *CHEGADA DE CLIENTES (Níveis 1 a 5)*
${arrivalData ? arrivalData.summary.map(s => `• *${s.name.split('(')[0].trim()}:* ${s.count} (${s.percentage}%) - R$ ${s.total_amount.toLocaleString('pt-BR')}`).join('\n') : 'Sem dados'}

══════════════════════
🚀 *CAMPANHAS TOP PERFORMANCE*
${campaigns.slice(0, 4).map(c => `• *${c.campaign_name}:* R$ ${c.total_revenue.toLocaleString('pt-BR')} (ROAS: ${c.roas}x)`).join('\n')}

✨ *Origem.Vendas* - Gestão de Tráfego`;
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#1a1d23] border border-[#2d3139] rounded-2xl max-w-4xl w-full p-5 shadow-2xl relative text-xs text-[#e2e8f0] my-4 max-h-[92vh] overflow-y-auto custom-scrollbar print:max-w-none print:w-full print:p-0 print:border-none print:bg-white print:text-black">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#94a3b8] hover:text-white p-1 rounded-md hover:bg-[#2d3139] transition-colors cursor-pointer print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2d3139] gap-3 print:hidden">
          <div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#c084fc]" />
              <h3 className="text-base font-bold text-white">
                Relatório Executivo para WhatsApp &amp; Impressão
              </h3>
            </div>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">
              Gere em 1 clique o resumo pronto para envio no WhatsApp do cliente ou exporte em PDF.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyWhatsApp}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                copiedWhatsapp 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-[#25D366] hover:bg-[#20bd5a] text-black'
              }`}
            >
              {copiedWhatsapp ? <Check className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span>{copiedWhatsapp ? 'Copiado!' : 'Copiar WhatsApp'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#2d3139] hover:bg-[#374151] text-white rounded-lg text-xs font-semibold border border-[#4b5563] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Filters in Modal */}
        <div className="bg-[#0f1115] p-3 rounded-xl border border-[#2d3139] my-4 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            <span className="text-[10px] text-[#94a3b8] font-bold uppercase mr-1">Período:</span>
            {(['today', 'last7', 'month', 'all'] as const).map(p => (
              <button
                key={p}
                onClick={() => handlePresetChange(p)}
                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  periodPreset === p ? 'bg-[#6366f1] text-white' : 'bg-[#1a1d23] text-[#94a3b8] hover:text-white'
                }`}
              >
                {p === 'today' ? 'Hoje' : p === 'last7' ? '7 dias' : p === 'month' ? 'Este Mês' : 'Tudo'}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-[#6366f1]" />
            <span>{formatDateBR(startDate)}</span>
            <span className="text-[#94a3b8]">até</span>
            <span>{formatDateBR(endDate)}</span>
          </div>
        </div>

        {/* Printable / Viewable Document */}
        <div className="space-y-4 pt-1">
          {/* Top 4 Metrics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139] text-center">
              <span className="text-[10px] text-[#94a3b8] block">Faturamento</span>
              <span className="text-base font-black text-[#34d399]">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139] text-center">
              <span className="text-[10px] text-[#94a3b8] block">Vendas Concluídas</span>
              <span className="text-base font-black text-white">{totalSalesCount}</span>
            </div>
            <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139] text-center">
              <span className="text-[10px] text-[#94a3b8] block">Ticket Médio</span>
              <span className="text-base font-black text-sky-400">
                R$ {avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139] text-center">
              <span className="text-[10px] text-[#94a3b8] block">Taxa Conversão</span>
              <span className="text-base font-black text-amber-400">{conversionRate}%</span>
            </div>
          </div>

          {/* Ranking de Vendedores */}
          <div className="bg-[#0f1115] p-3.5 rounded-xl border border-[#2d3139] space-y-2">
            <div className="flex items-center space-x-2 pb-1 border-b border-[#2d3139]">
              <Award className="w-4 h-4 text-[#f59e0b]" />
              <h4 className="font-bold text-xs text-white">Ranking de Vendedores</h4>
            </div>
            <div className="space-y-1.5">
              {sellersRanking.map((sel, idx) => (
                <div key={sel.seller_id} className="flex items-center justify-between text-xs py-1 border-b border-[#2d3139]/30">
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-[#2d3139] text-[10px] font-bold flex items-center justify-center text-white">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-white">{sel.seller_name}</span>
                    <span className="text-[10px] text-[#94a3b8]">({sel.leads_attended} atendimentos ➔ {sel.sales_closed} vendas)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-400">
                      R$ {sel.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-amber-300 ml-2 font-bold">{sel.conversion_rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Text Preview Box */}
          <div className="bg-[#0f1115] p-3.5 rounded-xl border border-[#2d3139] space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-[#2d3139]">
              <span className="font-bold text-xs text-white flex items-center space-x-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Texto Formatado para WhatsApp:</span>
              </span>
              <button
                onClick={handleCopyWhatsApp}
                className="text-[10px] text-emerald-400 hover:underline font-bold"
              >
                Copiar Texto
              </button>
            </div>
            <pre className="text-[11px] text-[#94a3b8] font-mono whitespace-pre-wrap bg-[#1a1d23] p-3 rounded-lg border border-[#2d3139] max-h-48 overflow-y-auto">
              {generateWhatsAppReport()}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 mt-4 border-t border-[#2d3139] print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2d3139] hover:bg-[#374151] text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
