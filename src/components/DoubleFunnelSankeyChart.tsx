import React, { useState } from 'react';
import { 
  FunnelMetricsResponse, 
  CustomerWithJourney 
} from '../types';
import { 
  GitBranch, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Share2, 
  CheckCircle2, 
  DollarSign, 
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { TermExplainer } from './TermExplainer';

interface DoubleFunnelSankeyChartProps {
  metrics: FunnelMetricsResponse | null;
  onSelectStage?: (stageKey: string) => void;
  selectedStage?: string | null;
}

export const DoubleFunnelSankeyChart: React.FC<DoubleFunnelSankeyChartProps> = ({
  metrics,
  onSelectStage,
  selectedStage
}) => {
  const [activeTooltip, setActiveTooltip] = useState<{
    title: string;
    value: string | number;
    sub: string;
    x: number;
    y: number;
  } | null>(null);

  if (!metrics) {
    return (
      <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-6 flex items-center justify-center min-h-[340px]">
        <div className="text-center text-[#94a3b8]">
          <div className="w-7 h-7 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin mx-auto mb-2.5"></div>
          <p className="text-xs">Calculando fluxos de atribuição encadeada...</p>
        </div>
      </div>
    );
  }

  const { summary } = metrics;

  const handleStageClick = (stageKey: string) => {
    if (onSelectStage) {
      onSelectStage(stageKey === selectedStage ? '' : stageKey);
    }
  };

  return (
    <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-3.5 sm:p-5 shadow-sm relative overflow-hidden">
      {/* Chart Header with 3 Core Business Answers */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#2d3139] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 bg-[#6366f1]/20 text-[#818cf8] rounded border border-[#6366f1]/30">
              <GitBranch className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Gráfico A: Funil Duplo &amp; Sankey de Atribuição Encadeada
            </h2>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-0.5">
            Visualização bifurcada: <strong>Ramo Esquerdo</strong> (Conversão Direta &rarr; Upsell Encadeado) vs <strong>Ramo Direito</strong> (Indicações &rarr; Vendas por Indicação).
          </p>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] bg-[#0f1115] px-2.5 py-1 rounded border border-[#2d3139] text-[#94a3b8]">
          <Info className="w-3.5 h-3.5 text-[#6366f1]" />
          <span>Clique em qualquer bloco para filtrar clientes</span>
        </div>
      </div>

      {/* 3 Key Metric Highlight Cards (As 3 Perguntas de Negócio) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-4">
        {/* Pergunta 1: Aquisição */}
        <div 
          onClick={() => handleStageClick('leads')}
          className={`p-3 rounded-lg border transition-all cursor-pointer ${
            selectedStage === 'leads' 
              ? 'bg-[#1e1b4b] border-[#6366f1] ring-1 ring-[#6366f1]' 
              : 'bg-[#0f1115] border-[#2d3139] hover:border-[#3f444e]'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] mb-1">
            <span className="font-bold text-[#818cf8] uppercase tracking-wider text-[10px] flex items-center gap-1">
              <span>1. Aquisição de</span>
              <TermExplainer term="Leads" translation="Contatos cadastrados / interessados" />
            </span>
            <Users className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {summary.total_leads.toLocaleString('pt-BR')}
          </div>
          <p className="text-[10px] text-[#94a3b8] mt-0.5">
            Total de leads entrantes no período
          </p>
        </div>

        {/* Pergunta 2: Conversão Direta */}
        <div 
          onClick={() => handleStageClick('prod_a')}
          className={`p-3 rounded-lg border transition-all cursor-pointer ${
            selectedStage === 'prod_a' 
              ? 'bg-[#064e3b] border-[#10b981] ring-1 ring-[#10b981]' 
              : 'bg-[#0f1115] border-[#2d3139] hover:border-[#3f444e]'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] mb-1">
            <span className="font-bold text-[#34d399] uppercase tracking-wider text-[10px]">2. Conversão Direta (Prod A)</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-black text-white">{summary.converted_to_A.toLocaleString('pt-BR')}</span>
            <span className="text-[10px] font-bold text-[#34d399] bg-[#065f46] px-1.5 py-0.5 rounded">
              {summary.conversion_rate_A}% tx bruta
            </span>
          </div>
          <p className="text-[10px] text-[#94a3b8] mt-0.5">
            Vendas primárias (<code className="text-[#34d399]">parent_sale_id IS NULL</code>)
          </p>
        </div>

        {/* Pergunta 3: Conversão Indireta / Encadeada */}
        <div 
          onClick={() => handleStageClick('prod_b')}
          className={`p-3 rounded-lg border transition-all cursor-pointer ${
            selectedStage === 'prod_b' 
              ? 'bg-[#581c87] border-[#a855f7] ring-1 ring-[#a855f7]' 
              : 'bg-[#0f1115] border-[#2d3139] hover:border-[#3f444e]'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8] mb-1">
            <span className="font-bold text-[#c084fc] uppercase tracking-wider text-[10px] flex items-center gap-1">
              <span>3. Encadeada</span>
              <TermExplainer term="Upsell" translation="Segunda compra de maior valor pelo mesmo cliente" />
              <span>&amp; Indicação</span>
            </span>
            <Share2 className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-black text-white">{summary.converted_to_B_from_A}</span>
            <span className="text-[10px] font-bold text-[#c084fc] bg-[#6b21a8] px-1.5 py-0.5 rounded">
              {summary.chained_upsell_rate_B}% de A
            </span>
            <span className="text-[11px] text-[#f472b6] font-bold ml-auto">
              +{summary.indications_converted} ind.
            </span>
          </div>
          <p className="text-[10px] text-[#94a3b8] mt-0.5">
            Upsell pós-A (<code className="text-[#c084fc]">parent_sale_id</code>) + Viral K: {summary.viral_coefficient_k}
          </p>
        </div>
      </div>

      {/* Visual Double Funnel Flow Diagram (Custom Responsive Sankey) */}
      <div className="bg-[#0f1115] rounded-lg p-3 sm:p-4 border border-[#2d3139] relative">
        <div className="text-xs font-semibold text-[#94a3b8] mb-3 flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-[#6366f1]" />
            <span className="text-[#e2e8f0]">Fluxo Interativo de Atribuição (Dupla Saída a partir de Produto A)</span>
          </span>
          <span className="text-[10px] text-[#94a3b8]">Toque ou clique sobre as etapas para filtrar</span>
        </div>

        {/* Funnel Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          
          {/* Level 1: Leads Entrantes (Col 1-3) */}
          <div className="lg:col-span-3">
            <div 
              onClick={() => handleStageClick('leads')}
              className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
                selectedStage === 'leads'
                  ? 'bg-[#1e1b4b] border-[#6366f1]'
                  : 'bg-[#1a1d23] border-[#2d3139] hover:border-[#6366f1]'
              }`}
            >
              <div className="flex items-center justify-between text-[#818cf8] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <span>Leads Entrantes</span>
                <span className="px-1.5 py-0.5 rounded bg-[#6366f1]/20 text-[#818cf8]">100% Base</span>
              </div>
              <div className="text-2xl font-extrabold text-white mb-0.5">
                {summary.total_leads.toLocaleString('pt-BR')}
              </div>
              <div className="text-[10px] text-[#94a3b8]">
                Google, Meta, Orgânico e Outbound
              </div>
              <div className="mt-2.5 w-full bg-[#0f1115] h-1 rounded-full overflow-hidden">
                <div className="bg-[#6366f1] h-full w-full"></div>
              </div>
            </div>
          </div>

          {/* Transition Connector 1 */}
          <div className="lg:col-span-1 flex justify-center py-1 lg:py-0">
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-[#34d399] bg-[#065f46] px-1.5 py-0.5 rounded mb-1">
                {summary.conversion_rate_A}%
              </span>
              <ArrowRight className="w-4 h-4 text-[#94a3b8] hidden lg:block" />
            </div>
          </div>

          {/* Level 2: Clientes Produto A (Centro do Funil) (Col 5-7) */}
          <div className="lg:col-span-4">
            <div 
              onClick={() => handleStageClick('prod_a')}
              className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
                selectedStage === 'prod_a'
                  ? 'bg-[#064e3b] border-[#10b981]'
                  : 'bg-[#1a1d23] border-[#2d3139] hover:border-[#10b981]'
              }`}
            >
              <div className="flex items-center justify-between text-[#34d399] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>Compraram Produto A (Core)</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#065f46] text-[#34d399]">
                  {summary.conversion_rate_A}%
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white mb-0.5">
                {summary.converted_to_A.toLocaleString('pt-BR')} <span className="text-xs font-normal text-[#94a3b8]">clientes</span>
              </div>
              <div className="text-[10px] text-[#cbd5e1] mb-1.5">
                Ponto de bifurcação: Clientes gerando Upsell e Indicações
              </div>
              
              <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-[#2d3139] text-[10px]">
                <div className="bg-[#581c87]/60 p-1 rounded border border-[#6b21a8] text-[#e9d5ff] text-center font-medium">
                  &darr; {summary.chained_upsell_rate_B}% viram Prod B
                </div>
                <div className="bg-[#831843]/60 p-1 rounded border border-[#9d174d] text-[#fbcfe8] text-center font-medium">
                  &darr; {summary.clients_A_who_referred} geram indicações
                </div>
              </div>
            </div>
          </div>

          {/* Transition Connector 2 */}
          <div className="lg:col-span-1 flex justify-center py-1 lg:py-0">
            <ArrowRight className="w-4 h-4 text-[#94a3b8] hidden lg:block" />
          </div>

          {/* Level 3: Dual Output (Bifurcação Encadeada) (Col 9-12) */}
          <div className="lg:col-span-3 flex flex-col space-y-2">
            {/* Saída A: Upsell Produto B Encadeado */}
            <div 
              onClick={() => handleStageClick('prod_b')}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                selectedStage === 'prod_b'
                  ? 'bg-[#581c87] border-[#a855f7]'
                  : 'bg-[#1a1d23] border-[#2d3139] hover:border-[#a855f7]'
              }`}
            >
              <div className="flex items-center justify-between text-[#c084fc] text-[10px] font-bold mb-0.5">
                <span>Upsell Produto B (Pós-A)</span>
                <span className="px-1 py-0.5 rounded bg-[#6b21a8] text-[#e9d5ff]">
                  {summary.chained_upsell_rate_B}% de A
                </span>
              </div>
              <div className="text-lg font-black text-white">
                {summary.converted_to_B_from_A} <span className="text-[10px] font-normal text-[#94a3b8]">clientes</span>
              </div>
              <div className="text-[9px] text-[#c084fc] mt-0.5">
                <code>parent_sale_id</code> aponta para Venda A
              </div>
            </div>

            {/* Saída B: Indicações Convertidas */}
            <div 
              onClick={() => handleStageClick('indications')}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                selectedStage === 'indications'
                  ? 'bg-[#831843] border-[#ec4899]'
                  : 'bg-[#1a1d23] border-[#2d3139] hover:border-[#ec4899]'
              }`}
            >
              <div className="flex items-center justify-between text-[#f472b6] text-[10px] font-bold mb-0.5">
                <span>Indicações Convertidas</span>
                <span className="px-1 py-0.5 rounded bg-[#9d174d] text-[#fbcfe8]">
                  {summary.indication_conversion_rate}% conv.
                </span>
              </div>
              <div className="text-lg font-black text-white flex items-baseline space-x-1">
                <span>{summary.indications_converted}</span>
                <span className="text-[10px] font-normal text-[#94a3b8]">de {summary.total_indications_made} geradas</span>
              </div>
              <div className="text-[9px] text-[#f472b6] mt-0.5">
                Atribuição de referral: {summary.clients_A_who_referred} clientes indicadores
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Funnel Flow Graph Visualization with Flow Ribbons */}
        <div className="mt-4 pt-3 border-t border-[#2d3139]">
          <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-2">
            <span className="font-semibold text-[#e2e8f0] text-[11px]">Diagrama de Fluxo de Volume (Sankey Streams)</span>
            <span className="text-[10px] text-[#94a3b8]">Largura proporcional ao volume relativo</span>
          </div>

          <div className="space-y-1.5">
            {/* Stream 1: Leads -> Prod A */}
            <div className="flex items-center text-xs">
              <span className="w-36 text-[#cbd5e1] truncate font-medium text-[11px]">1. Leads &rarr; Prod A</span>
              <div className="flex-1 bg-[#0f1115] h-5 rounded overflow-hidden flex mx-2 border border-[#2d3139]">
                <div 
                  style={{ width: `${Math.min(100, Math.max(10, summary.conversion_rate_A))}%` }} 
                  className="bg-[#10b981] h-full flex items-center justify-end px-2 text-[10px] font-bold text-black"
                  title={`${summary.converted_to_A} de ${summary.total_leads}`}
                >
                  {summary.converted_to_A} ({summary.conversion_rate_A}%)
                </div>
                <div 
                  style={{ width: `${100 - summary.conversion_rate_A}%` }} 
                  className="bg-[#1a1d23] h-full flex items-center px-2 text-[9px] text-[#94a3b8]"
                >
                  Perda/Nutrição ({summary.total_leads - summary.converted_to_A})
                </div>
              </div>
            </div>

            {/* Stream 2: Prod A -> Prod B (Upsell Encadeado) */}
            <div className="flex items-center text-xs">
              <span className="w-36 text-[#c084fc] truncate font-medium text-[11px]">2. Prod A &rarr; Prod B (Upsell)</span>
              <div className="flex-1 bg-[#0f1115] h-5 rounded overflow-hidden flex mx-2 border border-[#2d3139]">
                <div 
                  style={{ width: `${Math.min(100, Math.max(10, summary.chained_upsell_rate_B))}%` }} 
                  className="bg-[#a855f7] h-full flex items-center justify-end px-2 text-[10px] font-bold text-white"
                  title={`${summary.converted_to_B_from_A} de ${summary.converted_to_A}`}
                >
                  {summary.converted_to_B_from_A} ({summary.chained_upsell_rate_B}%)
                </div>
                <div 
                  style={{ width: `${100 - summary.chained_upsell_rate_B}%` }} 
                  className="bg-[#1a1d23] h-full flex items-center px-2 text-[9px] text-[#94a3b8]"
                >
                  Apenas Produto A ({summary.converted_to_A - summary.converted_to_B_from_A})
                </div>
              </div>
            </div>

            {/* Stream 3: Prod A -> Indicações -> Vendas */}
            <div className="flex items-center text-xs">
              <span className="w-36 text-[#f472b6] truncate font-medium text-[11px]">3. Clientes A &rarr; Indicações</span>
              <div className="flex-1 bg-[#0f1115] h-5 rounded overflow-hidden flex mx-2 border border-[#2d3139]">
                <div 
                  style={{ width: `${Math.min(100, Math.max(10, summary.indication_conversion_rate))}%` }} 
                  className="bg-[#ec4899] h-full flex items-center justify-end px-2 text-[10px] font-bold text-white"
                  title={`${summary.indications_converted} de ${summary.total_indications_made}`}
                >
                  {summary.indications_converted} vendas ({summary.indication_conversion_rate}%)
                </div>
                <div 
                  style={{ width: `${100 - summary.indication_conversion_rate}%` }} 
                  className="bg-[#1a1d23] h-full flex items-center px-2 text-[9px] text-[#94a3b8]"
                >
                  Indicações em Aberto ({summary.total_indications_made - summary.indications_converted})
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
