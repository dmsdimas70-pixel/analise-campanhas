import React, { useState } from 'react';
import { AttributionTreeResponse, AttributionTreeItem } from '../types';
import { PieChart, DollarSign, Layers, ArrowUpRight, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Tooltip } from 'recharts';

interface AttributionTreemapChartProps {
  attributionData: AttributionTreeResponse | null;
}

export const AttributionTreemapChart: React.FC<AttributionTreemapChartProps> = ({
  attributionData
}) => {
  const [selectedItem, setSelectedItem] = useState<AttributionTreeItem | null>(null);

  if (!attributionData) {
    return (
      <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-6 flex items-center justify-center min-h-[340px]">
        <div className="text-center text-[#94a3b8]">
          <div className="w-7 h-7 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin mx-auto mb-2.5"></div>
          <p className="text-xs">Calculando distribuição de receita e atribuição...</p>
        </div>
      </div>
    );
  }

  const { total_revenue, direct_revenue, indirect_chained_revenue, referral_revenue, tree_data, ltv_uplift_percentage } = attributionData;

  const pieChartData = tree_data.map(item => ({
    name: item.name,
    value: item.revenue,
    color: item.color,
    percentage: item.percentage_of_total,
    count: item.count,
    avg_ticket: item.avg_ticket,
    sub_items: item.sub_items
  }));

  const activeDetail = selectedItem || tree_data[0];

  return (
    <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-3.5 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#2d3139] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 bg-[#a855f7]/20 text-[#c084fc] rounded border border-[#a855f7]/30">
              <PieChart className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Gráfico C: Atribuição Hierárquica de Receita (Treemap / Split)
            </h2>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-0.5">
            Divisão do faturamento total entre <strong>Receita Direta (A)</strong> vs <strong>Receita Indireta (B pós A)</strong> vs <strong>Indicações</strong>.
          </p>
        </div>

        {/* LTV Expansion Highlight */}
        <div className="bg-[#0f1115] border border-[#2d3139] px-3 py-1.5 rounded-lg flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-[#c084fc]" />
          <div>
            <div className="text-[9px] uppercase font-bold text-[#c084fc] tracking-wider">LTV Uplift Encadeado</div>
            <div className="text-xs font-bold text-white">+{ltv_uplift_percentage}% de expansão</div>
          </div>
        </div>
      </div>

      {/* Main Attribution Cards & Donut Chart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        
        {/* Left Side: Visual Treemap & Proportion Blocks (Col 1-7) */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-0.5">
            <span className="font-semibold text-[#cbd5e1] text-[11px]">Proporção de Receita por Origem de Atribuição</span>
            <span className="font-bold text-[#34d399] text-xs">
              Total: R$ {total_revenue.toLocaleString('pt-BR')}
            </span>
          </div>

          {/* Treemap visual blocks */}
          <div className="space-y-2">
            {tree_data.map(item => {
              const isSelected = activeDetail.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#242831] border-[#6366f1] ring-1 ring-[#6366f1]'
                      : 'bg-[#0f1115] border-[#2d3139] hover:border-[#3f444e]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="font-bold text-xs text-white">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded" style={{ backgroundColor: `${item.color}25`, color: item.color }}>
                      {item.percentage_of_total}% do total
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-[11px] text-[#cbd5e1]">
                    <span className="text-base font-extrabold text-white">
                      R$ {item.revenue.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[#94a3b8] text-[10px]">
                      {item.count} transações &bull; Ticket Médio: R$ {item.avg_ticket.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  {/* Progress proportion bar */}
                  <div className="mt-2 w-full bg-[#0f1115] h-1 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage_of_total}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Interactive Donut & Selected Drilldown (Col 8-12) */}
        <div className="lg:col-span-5 bg-[#0f1115] p-3 rounded-lg border border-[#2d3139] flex flex-col items-center">
          <div className="w-full text-center mb-0.5">
            <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">
              Distribuição Relativa
            </span>
          </div>

          <div className="w-40 h-40 relative my-1">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={64}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`R$ ${val.toLocaleString('pt-BR')}`, 'Receita']}
                  contentStyle={{ backgroundColor: '#1a1d23', borderColor: '#2d3139', borderRadius: '6px', fontSize: '11px', color: '#e2e8f0' }}
                />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] text-[#94a3b8] uppercase">Receita</span>
              <span className="text-xs font-bold text-white">100%</span>
            </div>
          </div>

          {/* Detailed Drilldown of Selected Category */}
          {activeDetail && activeDetail.sub_items && (
            <div className="w-full bg-[#1a1d23] p-2.5 rounded-lg border border-[#2d3139] text-xs mt-1">
              <div className="flex items-center justify-between text-[#cbd5e1] font-semibold mb-1.5 border-b border-[#2d3139] pb-1">
                <span className="text-[11px]">Canais em {activeDetail.name.split('(')[0]}</span>
                <span className="text-[#34d399] font-bold text-[11px]">R$ {activeDetail.revenue.toLocaleString('pt-BR')}</span>
              </div>
              <div className="space-y-1">
                {activeDetail.sub_items.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[#94a3b8] text-[10px]">
                    <span>&bull; {sub.name}</span>
                    <span className="text-white font-medium">
                      R$ {sub.revenue.toLocaleString('pt-BR')} ({sub.count} vendas)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
