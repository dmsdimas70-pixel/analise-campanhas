import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  CheckCircle2, 
  MessageCircle, 
  Printer, 
  Edit2, 
  Trash2, 
  Filter, 
  HelpCircle, 
  ShoppingBag, 
  Award, 
  CalendarDays,
  CloudRain,
  Sun,
  Clock,
  Sparkles,
  ArrowUpRight,
  Share2,
  X
} from 'lucide-react';
import { DailyStoreTraffic, DailyStoreTrafficSummary, Company, Seller } from '../types';

interface DailyStoreTrafficViewProps {
  selectedCompanyId: string;
  onOpenAddModal?: () => void;
}

export const DailyStoreTrafficView: React.FC<DailyStoreTrafficViewProps> = ({
  selectedCompanyId
}) => {
  const [trafficRecords, setTrafficRecords] = useState<DailyStoreTraffic[]>([]);
  const [summary, setSummary] = useState<DailyStoreTrafficSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DailyStoreTraffic | null>(null);

  // Companies & Sellers for auto-selection
  const [companies, setCompanies] = useState<Company[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);

  // Filter dates
  const todayStr = new Date().toISOString().split('T')[0];
  const thirtyDaysAgoStr = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(thirtyDaysAgoStr);
  const [endDate, setEndDate] = useState(todayStr);

  // Form State
  const [formData, setFormData] = useState({
    company_id: selectedCompanyId || 'empresa-1',
    date: todayStr,
    recorded_by: '',
    seller_id: '',
    customers_arrived: 0,
    customers_attended: 0,
    sales_count: 0,
    revenue: 0,
    paid_ads: 0,
    referral_word_of_mouth: 0,
    walk_in_pedestrians: 0,
    return_customer: 0,
    other: 0,
    shift: 'integral' as 'integral' | 'manha' | 'tarde' | 'noite',
    weather_or_event: '',
    notes: ''
  });

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchAuxiliaryData();
  }, []);

  useEffect(() => {
    fetchTrafficData();
  }, [selectedCompanyId, startDate, endDate]);

  const fetchAuxiliaryData = async () => {
    try {
      const [compRes, sellRes] = await Promise.all([
        fetch('/api/companies'),
        fetch('/api/sellers')
      ]);
      if (compRes.ok) {
        const comps = await compRes.json();
        setCompanies(Array.isArray(comps) ? comps : []);
      }
      if (sellRes.ok) {
        const sells = await sellRes.json();
        setSellers(Array.isArray(sells) ? sells : []);
        // Suggest a default head saleswoman name if available
        const head = sells.find((s: Seller) => s.role?.toLowerCase().includes('chefe') || s.role?.toLowerCase().includes('gerente') || s.role?.toLowerCase().includes('closer'));
        if (head && !formData.recorded_by) {
          setFormData(prev => ({ ...prev, recorded_by: `${head.name} (Vendedora Chefe)`, seller_id: head.id }));
        }
      }
    } catch (err) {
      console.error('Erro ao carregar empresas/vendedores:', err);
    }
  };

  const fetchTrafficData = async () => {
    setIsLoading(true);
    try {
      const compParam = selectedCompanyId ? `&company_id=${selectedCompanyId}` : '';
      const [listRes, sumRes] = await Promise.all([
        fetch(`/api/daily-store-traffic?startDate=${startDate}&endDate=${endDate}${compParam}`),
        fetch(`/api/daily-store-traffic/summary?startDate=${startDate}&endDate=${endDate}${compParam}`)
      ]);

      if (listRes.ok) {
        const listData = await listRes.json();
        setTrafficRecords(Array.isArray(listData) ? listData : []);
      }
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setSummary(sumData);
      }
    } catch (err) {
      console.error('Erro ao carregar dados de fluxo de loja:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentCompany = companies.find(c => c.id === selectedCompanyId) || companies[0] || {
    id: 'empresa-1',
    name: 'Loja Principal',
    segment: 'Comércio / Serviços',
    color: '#10b981',
    logo_initials: 'LJ'
  };

  const handleOpenNewForm = () => {
    setEditingRecord(null);
    const headSeller = sellers.find(s => s.role?.toLowerCase().includes('chefe') || s.role?.toLowerCase().includes('gerente'));
    setFormData({
      company_id: selectedCompanyId || companies[0]?.id || 'empresa-1',
      date: new Date().toISOString().split('T')[0],
      recorded_by: headSeller ? `${headSeller.name} (Vendedora Chefe)` : (formData.recorded_by || 'Juliana Duarte (Vendedora Chefe)'),
      seller_id: headSeller?.id || '',
      customers_arrived: 35,
      customers_attended: 30,
      sales_count: 8,
      revenue: 12000,
      paid_ads: 18,
      referral_word_of_mouth: 7,
      walk_in_pedestrians: 6,
      return_customer: 4,
      other: 0,
      shift: 'integral',
      weather_or_event: 'Movimento normal de semana',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleEditRecord = (record: DailyStoreTraffic) => {
    setEditingRecord(record);
    setFormData({
      company_id: record.company_id,
      date: record.date,
      recorded_by: record.recorded_by,
      seller_id: record.seller_id || '',
      customers_arrived: record.customers_arrived,
      customers_attended: record.customers_attended,
      sales_count: record.sales_count,
      revenue: record.revenue,
      paid_ads: record.traffic_sources?.paid_ads || 0,
      referral_word_of_mouth: record.traffic_sources?.referral_word_of_mouth || 0,
      walk_in_pedestrians: record.traffic_sources?.walk_in_pedestrians || 0,
      return_customer: record.traffic_sources?.return_customer || 0,
      other: record.traffic_sources?.other || 0,
      shift: record.shift || 'integral',
      weather_or_event: record.weather_or_event || '',
      notes: record.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm('Deseja realmente excluir este registro de fluxo diário?')) return;
    try {
      const res = await fetch(`/api/daily-store-traffic/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('Registro excluído com sucesso!');
        fetchTrafficData();
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recorded_by.trim()) {
      alert('Por favor, informe o nome da Vendedora Chefe / Responsável.');
      return;
    }

    try {
      const payload = {
        company_id: formData.company_id,
        date: formData.date,
        recorded_by: formData.recorded_by,
        seller_id: formData.seller_id || undefined,
        customers_arrived: Number(formData.customers_arrived) || 0,
        customers_attended: Number(formData.customers_attended) || 0,
        sales_count: Number(formData.sales_count) || 0,
        revenue: Number(formData.revenue) || 0,
        traffic_sources: {
          paid_ads: Number(formData.paid_ads) || 0,
          referral_word_of_mouth: Number(formData.referral_word_of_mouth) || 0,
          walk_in_pedestrians: Number(formData.walk_in_pedestrians) || 0,
          return_customer: Number(formData.return_customer) || 0,
          other: Number(formData.other) || 0
        },
        shift: formData.shift,
        weather_or_event: formData.weather_or_event,
        notes: formData.notes
      };

      let res;
      if (editingRecord) {
        res = await fetch(`/api/daily-store-traffic/${editingRecord.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/daily-store-traffic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        showNotification(editingRecord ? 'Lançamento atualizado com sucesso!' : 'Lançamento diário registrado com sucesso!');
        fetchTrafficData();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao salvar lançamento');
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro de conexão ao salvar.');
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // WhatsApp share message generator
  const handleShareWhatsApp = () => {
    if (!summary || trafficRecords.length === 0) {
      alert('Nenhum dado registrado no período para compartilhar.');
      return;
    }

    const latest = trafficRecords[0];
    const text = 
`📊 *DIÁRIO DE FLUXO DE LOJA - ${currentCompany.name.toUpperCase()}*
📅 *Data:* ${latest.date.split('-').reverse().join('/')}
👩‍💼 *Preenchido por:* ${latest.recorded_by}

🚪 *Clientes que Chegaram:* ${latest.customers_arrived} pessoas
👥 *Clientes Atendidos:* ${latest.customers_attended} pessoas
🛍️ *Vendas Fechadas:* ${latest.sales_count} vendas
💰 *Faturamento do Dia:* R$ ${latest.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
📈 *Taxa de Conversão da Loja:* ${latest.conversion_rate}%
🏷️ *Ticket Médio:* R$ ${latest.avg_ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

📍 *Origem dos Clientes Hoje:*
- Anúncios (Instagram/Google): ${latest.traffic_sources.paid_ads}
- Indicação / Boca a boca: ${latest.traffic_sources.referral_word_of_mouth}
- Passantes / Vitrine: ${latest.traffic_sources.walk_in_pedestrians}
- Clientes Antigos: ${latest.traffic_sources.return_customer}

📝 *Observação da Vendedora Chefe:*
"${latest.notes || 'Sem observações adicionais.'}"

---
🏆 *Acumulado no Período (${startDate.split('-').reverse().join('/')} a ${endDate.split('-').reverse().join('/')}):*
• Total de Clientes Recebidos: ${summary.total_customers_arrived}
• Média Diária: ${summary.avg_daily_customers} clientes/dia
• Vendas Totais: ${summary.total_sales}
• Faturamento Acumulado: R$ ${summary.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• Conversão Média da Loja: ${summary.overall_conversion_rate}%`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // Preview conversion calculation for modal form
  const previewConversion = formData.customers_arrived > 0 
    ? ((formData.sales_count / formData.customers_arrived) * 100).toFixed(1) 
    : '0.0';

  const previewTicket = formData.sales_count > 0 
    ? (formData.revenue / formData.sales_count).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) 
    : '0,00';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 border border-emerald-400/50 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Hero / Header da Guia da Vendedora Chefe */}
      <div className="bg-[#1a1d23] p-5 sm:p-6 rounded-2xl border border-[#2d3139] shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-inner">
              <Store className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xl font-black tracking-tight text-white">
                  Diário de Chegada de Clientes por Loja
                </h2>
                <span className="bg-emerald-950/60 text-emerald-400 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Vendedora Chefe / Gerente
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] mt-1 max-w-2xl">
                Guia diária para a vendedora chefe preencher o número de clientes que chegaram na loja por dia, quantos foram atendidos, fechamentos e faturamento de balcão.
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-[#64748b]">Loja Selecionada:</span>
                <span 
                  className="text-xs font-black px-2 py-0.5 rounded-md text-white border"
                  style={{ 
                    backgroundColor: `${currentCompany.color}25`, 
                    borderColor: currentCompany.color, 
                    color: currentCompany.color 
                  }}
                >
                  {currentCompany.name} ({currentCompany.segment.split('&')[0].trim()})
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center space-x-1.5 bg-[#128c7e] hover:bg-[#075e54] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Compartilhar resumo do dia no WhatsApp da diretoria ou gestor de tráfego"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Enviar no WhatsApp</span>
            </button>

            <button
              onClick={handleOpenNewForm}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>+ Preencher Chegada de Clientes</span>
            </button>
          </div>
        </div>

        {/* Date Filter Strip */}
        <div className="mt-5 pt-4 border-t border-[#2d3139] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-[#94a3b8]">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">Filtrar período de lançamento:</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)}
              className="bg-[#0f1115] text-[#e2e8f0] px-2.5 py-1 rounded-lg border border-[#2d3139] text-xs focus:border-emerald-500 focus:outline-none cursor-pointer"
            />
            <span>até</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)}
              className="bg-[#0f1115] text-[#e2e8f0] px-2.5 py-1 rounded-lg border border-[#2d3139] text-xs focus:border-emerald-500 focus:outline-none cursor-pointer"
            />
          </div>

          <div className="text-xs text-[#94a3b8]">
            Total de dias registrados: <span className="font-bold text-white">{trafficRecords.length} dias</span>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Clientes Chegaram */}
        <div className="bg-[#1a1d23] p-4 rounded-xl border border-[#2d3139] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-1">
            <span>Clientes Chegaram</span>
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {summary ? summary.total_customers_arrived : 0}
          </div>
          <div className="text-[11px] text-blue-400 font-medium mt-1">
            Fluxo total na porta
          </div>
        </div>

        {/* Média Clientes / Dia */}
        <div className="bg-[#1a1d23] p-4 rounded-xl border border-[#2d3139] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-1">
            <span>Média por Dia</span>
            <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {summary ? summary.avg_daily_customers : 0}
            <span className="text-xs text-[#94a3b8] font-normal ml-1">/dia</span>
          </div>
          <div className="text-[11px] text-[#94a3b8] mt-1">
            Clientes/dia na loja
          </div>
        </div>

        {/* Clientes Atendidos */}
        <div className="bg-[#1a1d23] p-4 rounded-xl border border-[#2d3139] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-1">
            <span>Atendimentos</span>
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {summary ? summary.total_customers_attended : 0}
          </div>
          <div className="text-[11px] text-[#94a3b8] mt-1">
            Qualificados pela equipe
          </div>
        </div>

        {/* Vendas Fechadas */}
        <div className="bg-[#1a1d23] p-4 rounded-xl border border-[#2d3139] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-1">
            <span>Vendas Fechadas</span>
            <Award className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">
            {summary ? summary.total_sales : 0}
          </div>
          <div className="text-[11px] text-[#94a3b8] mt-1">
            Pedidos faturados
          </div>
        </div>

        {/* Taxa de Conversão */}
        <div className="bg-[#1a1d23] p-4 rounded-xl border border-[#2d3139] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-1">
            <span>Conversão Loja</span>
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400">
            {summary ? `${summary.overall_conversion_rate}%` : '0%'}
          </div>
          <div className="text-[11px] text-teal-500 font-medium mt-1">
            Vendas / Chegadas
          </div>
        </div>

        {/* Faturamento Balcão */}
        <div className="bg-[#1a1d23] p-4 rounded-xl border border-[#2d3139] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-1">
            <span>Faturamento</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 truncate" title={`R$ ${summary?.total_revenue || 0}`}>
            R$ {summary ? (summary.total_revenue > 9999 ? `${(summary.total_revenue / 1000).toFixed(1)}k` : summary.total_revenue.toLocaleString('pt-BR')) : 0}
          </div>
          <div className="text-[11px] text-[#94a3b8] mt-1">
            TM: R$ {summary ? Math.round(summary.overall_avg_ticket).toLocaleString('pt-BR') : 0}
          </div>
        </div>
      </div>

      {/* Seção Central: Distribuição de Origem & Melhor Dia */}
      {summary && summary.records_count > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* De onde chegaram os clientes */}
          <div className="lg:col-span-2 bg-[#1a1d23] p-5 rounded-2xl border border-[#2d3139]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Canais de Chegada dos Clientes na Loja</span>
                </h3>
                <p className="text-xs text-[#94a3b8]">
                  Distribuição informada pela vendedora chefe ao entrevistar os clientes
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0f1115] p-3 rounded-xl border border-[#2d3139]">
                <div className="text-xs text-[#94a3b8]">Anúncios Pagos</div>
                <div className="text-lg font-bold text-indigo-400 mt-1">
                  {summary.sources_breakdown.paid_ads}
                </div>
                <div className="text-[10px] text-[#64748b]">Instagram / Face / Google</div>
              </div>

              <div className="bg-[#0f1115] p-3 rounded-xl border border-[#2d3139]">
                <div className="text-xs text-[#94a3b8]">Indicação / Amigos</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">
                  {summary.sources_breakdown.referral_word_of_mouth}
                </div>
                <div className="text-[10px] text-[#64748b]">Boca a boca</div>
              </div>

              <div className="bg-[#0f1115] p-3 rounded-xl border border-[#2d3139]">
                <div className="text-xs text-[#94a3b8]">Passantes / Vitrine</div>
                <div className="text-lg font-bold text-amber-400 mt-1">
                  {summary.sources_breakdown.walk_in_pedestrians}
                </div>
                <div className="text-[10px] text-[#64748b]">Fachada da loja</div>
              </div>

              <div className="bg-[#0f1115] p-3 rounded-xl border border-[#2d3139]">
                <div className="text-xs text-[#94a3b8]">Clientes Antigos</div>
                <div className="text-lg font-bold text-purple-400 mt-1">
                  {summary.sources_breakdown.return_customer}
                </div>
                <div className="text-[10px] text-[#64748b]">Recompra / Retorno</div>
              </div>
            </div>
          </div>

          {/* Card de Melhor Dia de Movimento */}
          {summary.best_traffic_day && (
            <div className="bg-gradient-to-br from-[#1e1b4b]/60 to-[#1a1d23] p-5 rounded-2xl border border-[#6366f1]/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-[#818cf8]">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Melhor Dia de Faturamento da Loja</span>
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  {summary.best_traffic_day.date.split('-').reverse().join('/')}
                </div>
                <div className="text-xs text-[#94a3b8] mt-1">
                  Recorde de vendas do período
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2d3139] grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] text-[#94a3b8]">Clientes</div>
                  <div className="text-sm font-bold text-blue-300">{summary.best_traffic_day.customers_arrived}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#94a3b8]">Vendas</div>
                  <div className="text-sm font-bold text-purple-300">{summary.best_traffic_day.sales_count}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#94a3b8]">Faturamento</div>
                  <div className="text-sm font-bold text-emerald-300">R$ {summary.best_traffic_day.revenue.toLocaleString('pt-BR')}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabela de Lançamentos Diários */}
      <div className="bg-[#1a1d23] rounded-2xl border border-[#2d3139] overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-[#2d3139] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Histórico de Chegada de Clientes (Dia a Dia)</span>
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Registros preenchidos pela vendedora chefe com fluxo de loja, atendimentos e notas
            </p>
          </div>

          <button
            onClick={handleOpenNewForm}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Lançamento Diário</span>
          </button>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-xs text-[#94a3b8]">
            Carregando lançamentos de fluxo de loja...
          </div>
        ) : trafficRecords.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#0f1115] border border-[#2d3139] flex items-center justify-center mx-auto text-emerald-400">
              <Store className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Nenhum lançamento encontrado neste período</h4>
            <p className="text-xs text-[#94a3b8] max-w-sm mx-auto">
              A vendedora chefe ainda não preencheu o fluxo de clientes para a loja selecionada. Clique no botão abaixo para registrar o primeiro dia!
            </p>
            <button
              onClick={handleOpenNewForm}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md inline-flex items-center space-x-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Preencher Primeiro Dia</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f1115] text-[#94a3b8] border-b border-[#2d3139] uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Vendedora Chefe</th>
                  <th className="py-3 px-4 text-center">Clientes Chegaram</th>
                  <th className="py-3 px-4 text-center">Atendidos</th>
                  <th className="py-3 px-4 text-center">Vendas Fechadas</th>
                  <th className="py-3 px-4 text-center">Conversão</th>
                  <th className="py-3 px-4 text-right">Faturamento (R$)</th>
                  <th className="py-3 px-4">Observações da Loja</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3139]">
                {trafficRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-[#222630]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      {r.date.split('-').reverse().join('/')}
                      {r.shift && (
                        <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-[#2d3139] text-[#94a3b8] font-normal uppercase">
                          {r.shift}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-[#e2e8f0]">
                      <div className="font-semibold">{r.recorded_by}</div>
                      <div className="text-[10px] text-[#64748b]">{r.company_name}</div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-black text-blue-400 bg-blue-950/40 border border-blue-800/40 px-2 py-0.5 rounded-md">
                        {r.customers_arrived}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center text-[#94a3b8]">
                      {r.customers_attended}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-purple-400">
                        {r.sales_count}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`font-black px-2 py-0.5 rounded-full text-[11px] border ${
                        r.conversion_rate >= 25 
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                          : r.conversion_rate >= 15
                          ? 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                          : 'bg-rose-950/60 text-rose-400 border-rose-500/40'
                      }`}>
                        {r.conversion_rate}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-black text-emerald-400 whitespace-nowrap">
                      R$ {r.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4 text-[#94a3b8] max-w-xs truncate" title={r.notes || ''}>
                      {r.weather_or_event && (
                        <span className="text-[10px] text-amber-300 font-medium block truncate">
                          &bull; {r.weather_or_event}
                        </span>
                      )}
                      <span className="text-xs text-[#cbd5e1]">{r.notes || 'Sem anotação'}</span>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => handleEditRecord(r)}
                          className="p-1 rounded-md text-[#94a3b8] hover:text-white hover:bg-[#2d3139] transition-colors cursor-pointer"
                          title="Editar lançamento"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(r.id)}
                          className="p-1 rounded-md text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Excluir lançamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Preenchimento da Vendedora Chefe */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#1a1d23] w-full max-w-2xl rounded-2xl border border-[#2d3139] shadow-2xl overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="bg-[#0f1115] p-5 border-b border-[#2d3139] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingRecord ? 'Editar Lançamento do Dia' : 'Lançar Chegada de Clientes (Dia a Dia)'}
                  </h3>
                  <p className="text-xs text-[#94a3b8]">
                    Preenchimento diário da Vendedora Chefe para controle de fluxo de loja
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#94a3b8] hover:text-white p-1 rounded-lg hover:bg-[#2d3139] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
              
              {/* Row 1: Loja, Data e Vendedora Chefe */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#e2e8f0] mb-1">
                    Loja / Empresa *
                  </label>
                  <select
                    value={formData.company_id}
                    onChange={e => setFormData({ ...formData, company_id: e.target.value })}
                    className="w-full bg-[#0f1115] text-white text-xs px-3 py-2 rounded-xl border border-[#2d3139] focus:border-emerald-500 focus:outline-none"
                    required
                  >
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#e2e8f0] mb-1">
                    Data do Dia *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#0f1115] text-white text-xs px-3 py-2 rounded-xl border border-[#2d3139] focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#e2e8f0] mb-1">
                    Turno
                  </label>
                  <select
                    value={formData.shift}
                    onChange={e => setFormData({ ...formData, shift: e.target.value as any })}
                    className="w-full bg-[#0f1115] text-white text-xs px-3 py-2 rounded-xl border border-[#2d3139] focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="integral">Dia Todo (Integral)</option>
                    <option value="manha">Manhã</option>
                    <option value="tarde">Tarde</option>
                    <option value="noite">Noite</option>
                  </select>
                </div>
              </div>

              {/* Vendedora Chefe Responsável */}
              <div>
                <label className="block text-xs font-bold text-[#e2e8f0] mb-1">
                  Nome da Vendedora Chefe / Responsável pelo Registro *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.recorded_by}
                    onChange={e => setFormData({ ...formData, recorded_by: e.target.value })}
                    placeholder="Ex: Juliana Castro (Vendedora Chefe)"
                    className="flex-1 bg-[#0f1115] text-white text-xs px-3 py-2 rounded-xl border border-[#2d3139] focus:border-emerald-500 focus:outline-none"
                    required
                  />
                  {sellers.length > 0 && (
                    <select
                      onChange={e => {
                        const s = sellers.find(sel => sel.id === e.target.value);
                        if (s) {
                          setFormData({ ...formData, recorded_by: `${s.name} (${s.role || 'Vendedora'})`, seller_id: s.id });
                        }
                      }}
                      className="bg-[#0f1115] text-[#94a3b8] text-xs px-2 py-2 rounded-xl border border-[#2d3139] focus:border-emerald-500"
                    >
                      <option value="">+ Selecionar da Equipe</option>
                      {sellers.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.role || 'Vendedora'})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Row 2: Clientes que Chegaram, Atendidos, Vendas e Faturamento */}
              <div className="p-4 bg-[#0f1115] rounded-xl border border-[#2d3139] space-y-3">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Números do Dia (Fluxo de Entrada e Fechamentos)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#cbd5e1] mb-1">
                      1. Clientes que Chegaram *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.customers_arrived}
                      onChange={e => setFormData({ ...formData, customers_arrived: Number(e.target.value) })}
                      placeholder="Ex: 40"
                      className="w-full bg-[#1a1d23] text-blue-400 font-black text-sm px-3 py-2 rounded-lg border border-[#2d3139] focus:border-blue-500 focus:outline-none"
                      required
                    />
                    <span className="text-[10px] text-[#64748b]">Fluxo na porta</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#cbd5e1] mb-1">
                      2. Atendidos / Qualificados
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.customers_attended}
                      onChange={e => setFormData({ ...formData, customers_attended: Number(e.target.value) })}
                      placeholder="Ex: 34"
                      className="w-full bg-[#1a1d23] text-[#e2e8f0] font-bold text-sm px-3 py-2 rounded-lg border border-[#2d3139] focus:border-amber-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-[#64748b]">Atendidos no balcão</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#cbd5e1] mb-1">
                      3. Vendas Fechadas
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sales_count}
                      onChange={e => setFormData({ ...formData, sales_count: Number(e.target.value) })}
                      placeholder="Ex: 10"
                      className="w-full bg-[#1a1d23] text-purple-400 font-black text-sm px-3 py-2 rounded-lg border border-[#2d3139] focus:border-purple-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-[#64748b]">Contratos / Pedidos</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#cbd5e1] mb-1">
                      4. Faturamento Total (R$)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.revenue}
                      onChange={e => setFormData({ ...formData, revenue: Number(e.target.value) })}
                      placeholder="Ex: 15000"
                      className="w-full bg-[#1a1d23] text-emerald-400 font-black text-sm px-3 py-2 rounded-lg border border-[#2d3139] focus:border-emerald-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-[#64748b]">Receita do dia</span>
                  </div>
                </div>

                {/* Live Calculated Stats Indicator */}
                <div className="bg-[#1a1d23] p-3 rounded-lg flex items-center justify-between text-xs border border-[#2d3139]">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#94a3b8]">Taxa de Conversão:</span>
                    <span className="font-black text-teal-400 text-sm">{previewConversion}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#94a3b8]">Ticket Médio Calculado:</span>
                    <span className="font-black text-emerald-400 text-sm">R$ {previewTicket}</span>
                  </div>
                </div>
              </div>

              {/* Row 3: Origem dos Clientes que Chegaram */}
              <div className="p-4 bg-[#0f1115] rounded-xl border border-[#2d3139] space-y-2">
                <label className="block text-xs font-bold text-[#e2e8f0]">
                  De onde vieram os clientes que chegaram hoje? (Aproximação)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-[#94a3b8] block mb-1">Anúncios Pagos</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.paid_ads}
                      onChange={e => setFormData({ ...formData, paid_ads: Number(e.target.value) })}
                      className="w-full bg-[#1a1d23] text-white text-xs px-2.5 py-1.5 rounded-lg border border-[#2d3139]"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-[#94a3b8] block mb-1">Indicação / Amigos</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.referral_word_of_mouth}
                      onChange={e => setFormData({ ...formData, referral_word_of_mouth: Number(e.target.value) })}
                      className="w-full bg-[#1a1d23] text-white text-xs px-2.5 py-1.5 rounded-lg border border-[#2d3139]"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-[#94a3b8] block mb-1">Passantes / Vitrine</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.walk_in_pedestrians}
                      onChange={e => setFormData({ ...formData, walk_in_pedestrians: Number(e.target.value) })}
                      className="w-full bg-[#1a1d23] text-white text-xs px-2.5 py-1.5 rounded-lg border border-[#2d3139]"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-[#94a3b8] block mb-1">Clientes Antigos</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.return_customer}
                      onChange={e => setFormData({ ...formData, return_customer: Number(e.target.value) })}
                      className="w-full bg-[#1a1d23] text-white text-xs px-2.5 py-1.5 rounded-lg border border-[#2d3139]"
                    />
                  </div>
                </div>
              </div>

              {/* Evento / Clima do Dia */}
              <div>
                <label className="block text-xs font-bold text-[#e2e8f0] mb-1">
                  Evento do Dia / Clima / Destaque
                </label>
                <input
                  type="text"
                  value={formData.weather_or_event}
                  onChange={e => setFormData({ ...formData, weather_or_event: e.target.value })}
                  placeholder="Ex: Dia chuvoso à tarde / Anúncio novo de implantes no ar"
                  className="w-full bg-[#0f1115] text-white text-xs px-3 py-2 rounded-xl border border-[#2d3139] focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Observações da Vendedora Chefe */}
              <div>
                <label className="block text-xs font-bold text-[#e2e8f0] mb-1">
                  Observações e Diário de Bordo da Vendedora Chefe
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Clientes muito qualificados que viram o anúncio no Instagram. Objeção principal foi preço a prazo. Excelente trabalho da equipe."
                  className="w-full bg-[#0f1115] text-white text-xs p-3 rounded-xl border border-[#2d3139] focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-[#2d3139] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#0f1115] hover:bg-[#2d3139] text-[#94a3b8] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg transition-all cursor-pointer"
                >
                  {editingRecord ? 'Salvar Alterações' : 'Confirmar e Gravar Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
