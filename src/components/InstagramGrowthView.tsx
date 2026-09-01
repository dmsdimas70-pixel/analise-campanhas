import React, { useState, useEffect } from 'react';
import { 
  Instagram, 
  TrendingUp, 
  Users, 
  Eye, 
  Link, 
  MessageCircle, 
  Plus, 
  Trash2, 
  Edit, 
  Calendar, 
  ArrowUpRight, 
  Sparkles, 
  Video, 
  FileText, 
  CheckCircle2, 
  RefreshCw,
  HelpCircle,
  BarChart2,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { InstagramGrowthLog, InstagramMetricsSummary } from '../types';
import { InstagramLogModal } from './InstagramLogModal';
import { TermExplainer } from './TermExplainer';

interface InstagramGrowthViewProps {
  onOpenAddLeadModal?: () => void;
  selectedCompanyId?: string;
}

export const InstagramGrowthView: React.FC<InstagramGrowthViewProps> = ({ 
  onOpenAddLeadModal,
  selectedCompanyId 
}) => {
  const [summary, setSummary] = useState<InstagramMetricsSummary | null>(null);
  const [logs, setLogs] = useState<InstagramGrowthLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | 'all'>('30d');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<InstagramGrowthLog | null>(null);
  const [chartView, setChartView] = useState<'followers' | 'reach' | 'leads'>('followers');

  const fetchInstagramData = async () => {
    try {
      setIsLoading(true);
      const companyQuery = selectedCompanyId ? `?company_id=${selectedCompanyId}` : '';
      const res = await fetch(`/api/instagram/summary${companyQuery}`);
      if (res.ok) {
        const data: InstagramMetricsSummary = await res.json();
        setSummary(data);
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do Instagram:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstagramData();
  }, [selectedCompanyId]);

  const handleDeleteLog = async (id: string, date: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a anotação do dia ${date}?`)) return;
    try {
      const res = await fetch(`/api/instagram/logs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchInstagramData();
      }
    } catch (err) {
      console.error('Erro ao excluir registro:', err);
    }
  };

  // Filter logs for charts based on time filter
  const getFilteredChartLogs = () => {
    if (!logs || logs.length === 0) return [];
    if (timeFilter === '7d') return logs.slice(-7);
    if (timeFilter === '30d') return logs.slice(-30);
    return logs;
  };

  const chartData = getFilteredChartLogs().map(log => {
    const d = new Date(log.date + 'T12:00:00');
    const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return {
      ...log,
      displayDate: label,
      netGrowth: log.net_followers_growth
    };
  });

  const latestFollowers = summary?.total_followers_now || (logs.length > 0 ? logs[logs.length - 1].followers_count : 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Header */}
      <div className="bg-gradient-to-r from-[#833ab4]/15 via-[#fd1d1d]/15 to-[#fcb045]/15 border border-[#e1306c]/30 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] flex items-center justify-center text-white shadow-md">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  Crescimento Orgânico do Instagram
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#e1306c]/20 border border-[#e1306c]/40 text-[#f43f5e]">
                    Rede Social da Empresa
                  </span>
                </h1>
                <p className="text-xs text-[#94a3b8]">
                  Anotação diária de seguidores, alcance sem anúncios pagos, visitas e geração de novos clientes.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setEditingLog(null);
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#e1306c] to-[#fd1d1d] hover:from-[#c13584] hover:to-[#e1306c] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Anotar Crescimento Hoje</span>
            </button>

            <button
              onClick={fetchInstagramData}
              disabled={isLoading}
              className="flex items-center space-x-1.5 bg-[#1e222b] hover:bg-[#282d38] text-[#cbd5e1] text-xs font-medium px-3 py-2.5 rounded-lg border border-[#2d3139] transition-colors"
              title="Atualizar métricas"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </div>

        {/* Guia Rápido de Termos em Inglês */}
        <div className="mt-4 pt-3 border-t border-[#e1306c]/20 flex flex-wrap items-center gap-2 text-[11px] text-[#cbd5e1]">
          <span className="text-[#94a3b8] font-semibold flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-[#38bdf8]" />
            Explicação dos Termos em Inglês:
          </span>
          <span className="bg-[#14171d]/80 px-2 py-0.5 rounded border border-[#2d3139]">
            <strong className="text-white">Followers</strong> = Total de Seguidores
          </span>
          <span className="bg-[#14171d]/80 px-2 py-0.5 rounded border border-[#2d3139]">
            <strong className="text-white">Reach (Alcance)</strong> = Pessoas únicas que viram os posts
          </span>
          <span className="bg-[#14171d]/80 px-2 py-0.5 rounded border border-[#2d3139]">
            <strong className="text-white">Profile Views</strong> = Visitas ao perfil
          </span>
          <span className="bg-[#14171d]/80 px-2 py-0.5 rounded border border-[#2d3139]">
            <strong className="text-white">Link Clicks</strong> = Cliques no link da bio / WhatsApp
          </span>
          <span className="bg-[#14171d]/80 px-2 py-0.5 rounded border border-[#2d3139]">
            <strong className="text-white">DMs (Direct Messages)</strong> = Mensagens privadas recebidas
          </span>
          <span className="bg-[#14171d]/80 px-2 py-0.5 rounded border border-[#2d3139]">
            <strong className="text-white">Leads Orgânicos</strong> = Contatos que pediram proposta sem custo de anúncio
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total de Seguidores */}
        <div className="bg-[#14171d] border border-[#2d3139] rounded-xl p-4.5 hover:border-[#e1306c]/40 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94a3b8] flex items-center gap-1">
              <span>Seguidores Atuais</span>
              <span className="text-[10px] text-[#38bdf8]">(Followers)</span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-pink-950/40 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black text-white">
              {latestFollowers.toLocaleString('pt-BR')}
            </div>
            {summary && summary.growth_rate_pct > 0 && (
              <span className="text-xs font-bold text-emerald-400 flex items-center bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3" />
                +{summary.growth_rate_pct}%
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-1">
            {summary?.total_growth_period ? `+${summary.total_growth_period.toLocaleString('pt-BR')} novos no período` : 'Anotação acumulada'}
          </p>
        </div>

        {/* Card 2: Alcance Orgânico */}
        <div className="bg-[#14171d] border border-[#2d3139] rounded-xl p-4.5 hover:border-[#38bdf8]/40 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94a3b8] flex items-center gap-1">
              <span>Alcance Orgânico Total</span>
              <span className="text-[10px] text-[#38bdf8]">(Reach)</span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/40 border border-blue-500/30 flex items-center justify-center text-[#38bdf8]">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black text-[#38bdf8]">
              {(summary?.total_reach_period || 0).toLocaleString('pt-BR')}
            </div>
            <span className="text-[10px] text-[#94a3b8] bg-[#1e222b] px-2 py-0.5 rounded border border-[#2d3139]">
              Sem pagar anúncio
            </span>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-1">
            Média de ~{(summary?.avg_daily_reach || 0).toLocaleString('pt-BR')} contas alcançadas/dia
          </p>
        </div>

        {/* Card 3: Visitas & Cliques no Link */}
        <div className="bg-[#14171d] border border-[#2d3139] rounded-xl p-4.5 hover:border-amber-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94a3b8] flex items-center gap-1">
              <span>Visitas &amp; Cliques</span>
              <span className="text-[10px] text-[#38bdf8]">(Profile Views / Link)</span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Link className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black text-amber-300">
              {(summary?.total_profile_views || 0).toLocaleString('pt-BR')}
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-1.5 py-0.5 rounded">
              {(summary?.total_link_clicks || 0)} cliques no link
            </span>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-1">
            Pessoas que visitaram a bio ou clicaram para WhatsApp
          </p>
        </div>

        {/* Card 4: Leads Orgânicos & Directs */}
        <div className="bg-[#14171d] border border-[#2d3139] rounded-xl p-4.5 hover:border-emerald-500/40 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94a3b8] flex items-center gap-1">
              <span>Leads Orgânicos Gerados</span>
              <span className="text-[10px] text-[#38bdf8]">(DMs &amp; WhatsApp)</span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black text-emerald-400">
              {(summary?.total_organic_leads || 0)} leads
            </div>
            <span className="text-xs font-bold text-purple-300 bg-purple-950/40 border border-purple-500/30 px-1.5 py-0.5 rounded">
              {(summary?.total_dms_received || 0)} DMs
            </span>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-1">
            Contatos que se interessaram organicamente pelo produto
          </p>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="bg-[#14171d] border border-[#2d3139] rounded-xl p-5 shadow-sm space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222630]">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#e1306c]" />
              <span>Gráfico de Evolução do Instagram</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Acompanhe a curva de seguidores e o impacto do conteúdo orgânico nas vendas
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Chart Mode Selector */}
            <div className="flex items-center bg-[#0f1115] p-1 rounded-lg border border-[#2d3139] text-xs">
              <button
                onClick={() => setChartView('followers')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  chartView === 'followers'
                    ? 'bg-[#e1306c] text-white shadow-sm'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                Seguidores (Followers)
              </button>
              <button
                onClick={() => setChartView('reach')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  chartView === 'reach'
                    ? 'bg-[#38bdf8] text-slate-900 font-bold shadow-sm'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                Alcance (Reach) &amp; Visitas
              </button>
              <button
                onClick={() => setChartView('leads')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  chartView === 'leads'
                    ? 'bg-emerald-500 text-slate-900 font-bold shadow-sm'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                Leads Orgânicos &amp; DMs
              </button>
            </div>

            {/* Time Filter */}
            <div className="flex items-center bg-[#0f1115] p-1 rounded-lg border border-[#2d3139] text-xs">
              <button
                onClick={() => setTimeFilter('7d')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  timeFilter === '7d' ? 'bg-[#2d3139] text-white' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                7 dias
              </button>
              <button
                onClick={() => setTimeFilter('30d')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  timeFilter === '30d' ? 'bg-[#2d3139] text-white' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                30 dias
              </button>
              <button
                onClick={() => setTimeFilter('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  timeFilter === 'all' ? 'bg-[#2d3139] text-white' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                Tudo
              </button>
            </div>
          </div>
        </div>

        {/* Chart Rendering */}
        <div className="h-[320px] w-full pt-2">
          {chartData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#94a3b8] space-y-2">
              <Instagram className="w-10 h-10 text-slate-600" />
              <p className="text-sm">Nenhuma anotação de crescimento cadastrada ainda.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-[#e1306c] hover:underline font-semibold"
              >
                Clique aqui para anotar a primeira métrica do Instagram
              </button>
            </div>
          ) : chartView === 'followers' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e1306c" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#e1306c" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" opacity={0.5} />
                <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  domain={['dataMin - 100', 'dataMax + 100']}
                  tickFormatter={val => `${val}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as InstagramGrowthLog & { displayDate: string };
                      return (
                        <div className="bg-[#1a1d24] border border-[#2d3139] p-3 rounded-lg shadow-xl text-xs space-y-1.5">
                          <p className="font-bold text-white flex items-center justify-between gap-4">
                            <span>Data: {data.date}</span>
                            <span className="text-[#e1306c] font-black">{data.followers_count.toLocaleString('pt-BR')} seguidores</span>
                          </p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[#94a3b8] pt-1 border-t border-[#2d3139]">
                            <span>Novos Seguidores: <strong className="text-emerald-400">+{data.new_followers}</strong></span>
                            <span>Unfollows: <strong className="text-rose-400">-{data.unfollows || 0}</strong></span>
                            <span>Alcance: <strong className="text-[#38bdf8]">{data.accounts_reached.toLocaleString('pt-BR')}</strong></span>
                            <span>Visitas Perfil: <strong className="text-amber-400">{data.profile_views}</strong></span>
                          </div>
                          {data.notes && (
                            <p className="text-[11px] text-purple-300 italic pt-1 border-t border-[#2d3139]">
                              📝 {data.notes}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  formatter={(value) => {
                    if (value === 'followers_count') return 'Total de Seguidores (Followers)';
                    if (value === 'new_followers') return 'Novos no Dia (+)';
                    return value;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="followers_count"
                  name="followers_count"
                  stroke="#e1306c"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorFollowers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : chartView === 'reach' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" opacity={0.5} />
                <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as InstagramGrowthLog;
                      return (
                        <div className="bg-[#1a1d24] border border-[#2d3139] p-3 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white">Data: {data.date}</p>
                          <p className="text-[#38bdf8]">Alcance (Reach): <strong>{data.accounts_reached.toLocaleString('pt-BR')} contas</strong></p>
                          <p className="text-amber-400">Visitas ao Perfil: <strong>{data.profile_views}</strong></p>
                          <p className="text-purple-400">Cliques no Link Bio: <strong>{data.link_clicks}</strong></p>
                          {data.notes && <p className="text-slate-300 text-[11px] italic">"{data.notes}"</p>}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  formatter={(value) => {
                    if (value === 'accounts_reached') return 'Alcance (Contas alcançadas - Reach)';
                    if (value === 'profile_views') return 'Visitas ao Perfil (Profile Views)';
                    return value;
                  }}
                />
                <Bar dataKey="accounts_reached" name="accounts_reached" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profile_views" name="profile_views" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" opacity={0.5} />
                <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as InstagramGrowthLog;
                      return (
                        <div className="bg-[#1a1d24] border border-[#2d3139] p-3 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white">Data: {data.date}</p>
                          <p className="text-emerald-400">Leads Orgânicos: <strong>{data.organic_leads_generated} contatos</strong></p>
                          <p className="text-purple-400">Mensagens DMs: <strong>{data.dms_received} mensagens</strong></p>
                          <p className="text-amber-400">Cliques Link Bio: <strong>{data.link_clicks} cliques</strong></p>
                          {data.notes && <p className="text-slate-300 text-[11px] italic">"{data.notes}"</p>}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  formatter={(value) => {
                    if (value === 'organic_leads_generated') return 'Leads Orgânicos (Contatos interessados)';
                    if (value === 'dms_received') return 'Mensagens no Direct (DMs)';
                    if (value === 'link_clicks') return 'Cliques no Link Bio / WhatsApp';
                    return value;
                  }}
                />
                <Line type="monotone" dataKey="organic_leads_generated" name="organic_leads_generated" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="dms_received" name="dms_received" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="link_clicks" name="link_clicks" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* History Log Table Section */}
      <div className="bg-[#14171d] border border-[#2d3139] rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[#222630] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#e1306c]" />
              <span>Histórico de Anotações do Instagram ({logs.length} dias registrados)</span>
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Registros diários do crescimento de seguidores, alcance orgânico e anotações do que foi postado
            </p>
          </div>

          <button
            onClick={() => {
              setEditingLog(null);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-1.5 bg-[#1e222b] hover:bg-[#282d38] text-white border border-[#2d3139] text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#e1306c]" />
            <span>+ Nova Anotação</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#cbd5e1]">
            <thead className="bg-[#0f1115] text-[#94a3b8] uppercase text-[10px] tracking-wider border-b border-[#222630]">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Total Seguidores <span className="text-[#38bdf8] lowercase font-normal">(followers)</span></th>
                <th className="px-4 py-3">Crescimento <span className="text-[#38bdf8] lowercase font-normal">(novos - unfollows)</span></th>
                <th className="px-4 py-3">Alcance <span className="text-[#38bdf8] lowercase font-normal">(reach)</span></th>
                <th className="px-4 py-3">Visitas / Cliques <span className="text-[#38bdf8] lowercase font-normal">(perfil &amp; link)</span></th>
                <th className="px-4 py-3">DMs &amp; Leads <span className="text-[#38bdf8] lowercase font-normal">(direct &amp; propostas)</span></th>
                <th className="px-4 py-3">Posts &amp; Anotação</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e222b]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#94a3b8]">
                    Nenhuma anotação cadastrada. Clique no botão acima para registrar o crescimento de hoje!
                  </td>
                </tr>
              ) : (
                [...logs].reverse().map((log) => {
                  const net = log.net_followers_growth;
                  return (
                    <tr key={log.id} className="hover:bg-[#1a1d24] transition-colors">
                      {/* Data */}
                      <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                        {new Date(log.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Total Followers */}
                      <td className="px-4 py-3 font-black text-white whitespace-nowrap">
                        {log.followers_count.toLocaleString('pt-BR')}
                      </td>

                      {/* Growth */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`font-bold inline-flex items-center px-2 py-0.5 rounded text-xs ${
                          net > 0 
                            ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30' 
                            : net < 0 
                              ? 'bg-rose-950/50 text-rose-300 border border-rose-500/30' 
                              : 'bg-[#1e222b] text-[#94a3b8]'
                        }`}>
                          {net > 0 ? `+${net}` : net}
                        </span>
                        {log.unfollows > 0 && (
                          <span className="text-[10px] text-[#94a3b8] ml-1.5">
                            (+{log.new_followers} / -{log.unfollows})
                          </span>
                        )}
                      </td>

                      {/* Reach */}
                      <td className="px-4 py-3 text-[#38bdf8] font-medium whitespace-nowrap">
                        {log.accounts_reached.toLocaleString('pt-BR')}
                      </td>

                      {/* Profile & Link */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-amber-300 font-medium">{log.profile_views} visitas</span>
                        <span className="text-[#64748b] mx-1.5">•</span>
                        <span className="text-purple-300 font-medium">{log.link_clicks} cliques</span>
                      </td>

                      {/* DMs & Leads */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-purple-300 font-semibold">{log.dms_received} DMs</span>
                        <span className="text-[#64748b] mx-1.5">•</span>
                        <span className="text-emerald-400 font-bold">{log.organic_leads_generated} leads</span>
                      </td>

                      {/* Posts & Notes */}
                      <td className="px-4 py-3 max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            {log.reels_count > 0 && (
                              <span className="bg-purple-950/40 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-semibold">
                                {log.reels_count} Reel{log.reels_count > 1 ? 's' : ''}
                              </span>
                            )}
                            {log.posts_count > 0 && (
                              <span className="bg-blue-950/40 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded font-semibold">
                                {log.posts_count} Feed
                              </span>
                            )}
                            {log.stories_count > 0 && (
                              <span className="bg-amber-950/40 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-semibold">
                                {log.stories_count} Stories
                              </span>
                            )}
                          </div>
                          {log.notes && (
                            <p className="text-[11px] text-[#94a3b8] truncate font-normal" title={log.notes}>
                              📝 {log.notes}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              setEditingLog(log);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-[#94a3b8] hover:text-white hover:bg-[#222630] rounded transition-colors"
                            title="Editar anotação"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLog(log.id, log.date)}
                            className="p-1.5 text-[#94a3b8] hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                            title="Excluir anotação"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Modal */}
      <InstagramLogModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLog(null);
        }}
        onSuccess={fetchInstagramData}
        editingLog={editingLog}
        lastFollowersCount={latestFollowers}
        selectedCompanyId={selectedCompanyId}
      />
    </div>
  );
};
