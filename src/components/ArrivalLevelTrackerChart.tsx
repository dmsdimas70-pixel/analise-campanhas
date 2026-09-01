import React from 'react';
import { ArrivalLevel, ArrivalLevelsResponse, ARRIVAL_LEVELS } from '../types';
import { Layers, TrendingUp, Users, DollarSign, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { TermExplainer } from './TermExplainer';

interface ArrivalLevelTrackerChartProps {
  arrivalData: ArrivalLevelsResponse | null;
  selectedLevel: ArrivalLevel | null;
  onSelectLevel: (level: ArrivalLevel | null) => void;
}

export const ArrivalLevelTrackerChart: React.FC<ArrivalLevelTrackerChartProps> = ({
  arrivalData,
  selectedLevel,
  onSelectLevel
}) => {
  if (!arrivalData) {
    return (
      <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-4 sm:p-5 text-center text-[#94a3b8] text-xs">
        Carregando níveis de chegada...
      </div>
    );
  }

  const { levels, total_contacts, total_revenue, conversion_to_main_product_rate, conversion_to_upsell_rate, conversion_to_promoter_rate } = arrivalData;

  const maxCount = Math.max(...levels.map(l => l.count), 1);

  return (
    <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2d3139]/60 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/20">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Nível de Chegada do Cliente &amp; Conversão
            </h3>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-0.5">
            Acompanhe o estágio de evolução de cada contato, desde a entrada pela campanha até a indicação.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-3 bg-[#0f1115] px-3 py-1.5 rounded-lg border border-[#2d3139] text-xs">
          <div>
            <span className="text-[#94a3b8] text-[10px] block">Total de Contatos:</span>
            <span className="font-bold text-white">{total_contacts}</span>
          </div>
          <div className="w-[1px] h-6 bg-[#2d3139]"></div>
          <div>
            <span className="text-[#94a3b8] text-[10px] block">Receita Total:</span>
            <span className="font-bold text-[#34d399]">
              R$ {total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* 5 Levels Progression Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
        {levels.map((lvl) => {
          const isSelected = selectedLevel === lvl.level;
          const barWidth = Math.max(Math.round((lvl.count / maxCount) * 100), lvl.count > 0 ? 8 : 0);

          return (
            <div
              key={lvl.level}
              onClick={() => onSelectLevel(isSelected ? null : lvl.level)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? `${lvl.badgeBg} ${lvl.badgeBorder} border-2 ring-2 ring-[#6366f1]/50 shadow-lg scale-[1.02]`
                  : 'bg-[#0f1115] border-[#2d3139] hover:border-[#475569]'
              }`}
            >
              {/* Top Row: Level number & percentage */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: `${lvl.color}20`, color: lvl.color, border: `1px solid ${lvl.color}40` }}
                >
                  Nível {lvl.number}
                </span>
                <span className="text-[10px] font-mono text-[#94a3b8]">
                  {lvl.percentage_of_total}%
                </span>
              </div>

              {/* Title & Description */}
              <div className="mb-3">
                <h4 className="text-xs font-bold text-white mb-0.5 line-clamp-1">
                  {lvl.shortLabel.replace(/Nível \d+ \((.*?)\)/, '$1')}
                </h4>
                <p className="text-[10px] text-[#94a3b8] line-clamp-2 leading-tight">
                  {lvl.description}
                </p>
              </div>

              {/* Metrics */}
              <div className="space-y-1.5 pt-2 border-t border-[#2d3139]/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#94a3b8] text-[10px] flex items-center space-x-1">
                    <Users className="w-3 h-3 text-[#94a3b8]" />
                    <span>Contatos:</span>
                  </span>
                  <span className="font-bold text-white">{lvl.count}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#94a3b8] text-[10px] flex items-center space-x-1">
                    <DollarSign className="w-3 h-3 text-[#34d399]" />
                    <span>Receita:</span>
                  </span>
                  <span className="font-bold text-[#34d399] text-[11px]">
                    R$ {lvl.total_revenue.toLocaleString('pt-BR')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#1a1d23] h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%`, backgroundColor: lvl.color }}
                  ></div>
                </div>
              </div>

              {isSelected && (
                <div className="mt-2 text-center text-[10px] font-bold text-[#93c5fd] bg-[#1e3a8a]/40 py-0.5 rounded border border-[#3b82f6]/40">
                  Filtro Ativo ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Conversion Benchmarks & Progression Stats */}
      <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/20">
            <ArrowRight className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#94a3b8] block">Conversão para Produto Principal (Nível 3+)</span>
            <span className="font-bold text-[#60a5fa] text-sm">{conversion_to_main_product_rate}%</span>
            <span className="text-[9px] text-[#64748b] block">dos leads fecharam compra</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:border-l sm:border-[#2d3139] sm:pl-3">
          <div className="p-2 rounded-lg bg-[#8b5cf6]/10 text-[#c084fc] border border-[#8b5cf6]/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#94a3b8] flex items-center gap-1">
              <span>Taxa de Recompra</span>
              <TermExplainer term="Upsell" translation="Venda de um produto adicional de maior valor" />
            </span>
            <span className="font-bold text-[#c084fc] text-sm">{conversion_to_upsell_rate}%</span>
            <span className="text-[9px] text-[#64748b] block">compraram produto secundário</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:border-l sm:border-[#2d3139] sm:pl-3">
          <div className="p-2 rounded-lg bg-[#ec4899]/10 text-[#f472b6] border border-[#ec4899]/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#94a3b8] flex items-center gap-1">
              <span>Taxa de Clientes Promotores</span>
              <TermExplainer term="Advocates" translation="Clientes que recomendam a marca para amigos" />
            </span>
            <span className="font-bold text-[#f472b6] text-sm">{conversion_to_promoter_rate}%</span>
            <span className="text-[9px] text-[#64748b] block">geraram indicações convertidas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
