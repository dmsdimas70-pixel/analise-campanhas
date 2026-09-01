import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  LineChart, 
  Line, 
  ComposedChart, 
  Area 
} from 'recharts';
import { TimelineMetricsResponse } from '../types';
import { TrendingUp, BarChart2, LineChart as LineIcon, Calendar, ArrowUpRight } from 'lucide-react';

interface TimeSeriesTimelineChartProps {
  timelineData: TimelineMetricsResponse | null;
  groupBy: 'month' | 'week';
  setGroupBy: (g: 'month' | 'week') => void;
}

export const TimeSeriesTimelineChart: React.FC<TimeSeriesTimelineChartProps> = ({
  timelineData,
  groupBy,
  setGroupBy
}) => {
  const [chartType, setChartType] = useState<'composed' | 'stacked_bar' | 'lines'>('composed');

  if (!timelineData || !timelineData.timeline.length) {
    return (
      <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-6 flex items-center justify-center min-h-[340px]">
        <div className="text-center text-[#94a3b8]">
          <div className="w-7 h-7 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin mx-auto mb-2.5"></div>
          <p className="text-xs">Carregando dados da série temporal...</p>
        </div>
      </div>
    );
  }

  const { timeline, totals } = timelineData;

  // Custom Rich Tooltip for Touch & Hover
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload;
      return (
        <div className="bg-[#1a1d23] border border-[#2d3139] p-3 rounded-lg shadow-xl text-xs space-y-1.5 z-50 min-w-[210px]">
          <div className="flex items-center justify-between border-b border-[#2d3139] pb-1">
            <span className="font-bold text-white text-xs">{label}</span>
            <span className="text-[#34d399] font-bold text-[11px]">
              R$ {dataPoint?.receita_total?.toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-[#818cf8]">
                <span className="w-2 h-2 rounded-full bg-[#6366f1] inline-block"></span>
                <span>Novos Leads:</span>
              </span>
              <span className="font-bold text-white">{dataPoint?.leads_entrantes}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-[#34d399]">
                <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block"></span>
                <span>Conversões Produto A:</span>
              </span>
              <span className="font-bold text-white">
                {dataPoint?.conversoes_produto_a} ({dataPoint?.taxa_conversao_a}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-[#c084fc]">
                <span className="w-2 h-2 rounded-full bg-[#a855f7] inline-block"></span>
                <span>Upsell B (Pós-A):</span>
              </span>
              <span className="font-bold text-white">
                {dataPoint?.conversoes_produto_b_encadeadas} ({dataPoint?.taxa_upsell_b}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-[#f472b6]">
                <span className="w-2 h-2 rounded-full bg-[#ec4899] inline-block"></span>
                <span>Vendas por Indicação:</span>
              </span>
              <span className="font-bold text-white">{dataPoint?.vendas_por_indicacao}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-3.5 sm:p-5 shadow-sm">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#2d3139] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 bg-[#10b981]/20 text-[#34d399] rounded border border-[#10b981]/30">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Gráfico B: Série Temporal de Conversões &amp; Atribuição
            </h2>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-0.5">
            Evolução de <strong>Novos Leads</strong> vs <strong>Produto A</strong> vs <strong>Produto B (Encadeado)</strong> vs <strong>Indicações</strong>.
          </p>
        </div>

        {/* Granularity & Chart Type Toggles */}
        <div className="flex items-center space-x-2">
          {/* Month / Week Switcher */}
          <div className="bg-[#0f1115] p-0.5 rounded border border-[#2d3139] flex text-xs">
            <button
              onClick={() => setGroupBy('month')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                groupBy === 'month' ? 'bg-[#2d3139] text-white font-semibold' : 'text-[#94a3b8] hover:text-slate-200'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setGroupBy('week')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                groupBy === 'week' ? 'bg-[#2d3139] text-white font-semibold' : 'text-[#94a3b8] hover:text-slate-200'
              }`}
            >
              Semanal
            </button>
          </div>

          {/* Chart Style Switcher */}
          <div className="bg-[#0f1115] p-0.5 rounded border border-[#2d3139] flex text-xs">
            <button
              onClick={() => setChartType('composed')}
              className={`p-1 rounded transition-colors ${
                chartType === 'composed' ? 'bg-[#2d3139] text-white' : 'text-[#94a3b8] hover:text-slate-200'
              }`}
              title="Misto (Barras + Linhas)"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('lines')}
              className={`p-1 rounded transition-colors ${
                chartType === 'lines' ? 'bg-[#2d3139] text-white' : 'text-[#94a3b8] hover:text-slate-200'
              }`}
              title="Linhas"
            >
              <LineIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
        <div className="bg-[#0f1115] p-2 rounded-lg border border-[#2d3139]">
          <span className="text-[9px] uppercase font-bold text-[#818cf8] tracking-wider">Total Leads</span>
          <div className="text-base font-bold text-white">{totals.leads}</div>
        </div>
        <div className="bg-[#0f1115] p-2 rounded-lg border border-[#2d3139]">
          <span className="text-[9px] uppercase font-bold text-[#34d399] tracking-wider">Vendas Produto A</span>
          <div className="text-base font-bold text-white">{totals.conversoes_a}</div>
        </div>
        <div className="bg-[#0f1115] p-2 rounded-lg border border-[#2d3139]">
          <span className="text-[9px] uppercase font-bold text-[#c084fc] tracking-wider">Upsell B Encadeado</span>
          <div className="text-base font-bold text-white">{totals.conversoes_b_encadeadas}</div>
        </div>
        <div className="bg-[#0f1115] p-2 rounded-lg border border-[#2d3139]">
          <span className="text-[9px] uppercase font-bold text-[#f472b6] tracking-wider">Vendas por Indicação</span>
          <div className="text-base font-bold text-white">{totals.vendas_indicacao}</div>
        </div>
      </div>

      {/* Interactive Responsive Recharts Canvas */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'composed' ? (
            <ComposedChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" opacity={0.6} />
              <XAxis 
                dataKey="formatted_period" 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
              />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} 
                iconType="circle"
              />
              <Bar 
                dataKey="leads_entrantes" 
                name="Novos Leads" 
                fill="#6366f1" 
                opacity={0.35} 
                radius={[3, 3, 0, 0]} 
              />
              <Bar 
                dataKey="conversoes_produto_a" 
                name="Conversões Produto A" 
                fill="#10b981" 
                radius={[3, 3, 0, 0]} 
              />
              <Line 
                type="monotone" 
                dataKey="conversoes_produto_b_encadeadas" 
                name="Upsell Produto B (Pós-A)" 
                stroke="#a855f7" 
                strokeWidth={2.5} 
                dot={{ r: 3.5, fill: '#a855f7' }} 
              />
              <Line 
                type="monotone" 
                dataKey="vendas_por_indicacao" 
                name="Vendas por Indicação" 
                stroke="#ec4899" 
                strokeWidth={2.5} 
                strokeDasharray="4 4"
                dot={{ r: 3.5, fill: '#ec4899' }} 
              />
            </ComposedChart>
          ) : (
            <LineChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" opacity={0.6} />
              <XAxis dataKey="formatted_period" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} iconType="circle" />
              <Line type="monotone" dataKey="leads_entrantes" name="Novos Leads" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="conversoes_produto_a" name="Conversões Produto A" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3.5 }} />
              <Line type="monotone" dataKey="conversoes_produto_b_encadeadas" name="Upsell Produto B" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3.5 }} />
              <Line type="monotone" dataKey="vendas_por_indicacao" name="Vendas por Indicação" stroke="#ec4899" strokeWidth={2.5} dot={{ r: 3.5 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
