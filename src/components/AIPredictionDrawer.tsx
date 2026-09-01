import React, { useState } from 'react';
import { AIPredictionResult } from '../types';
import { Sparkles, Bot, TrendingUp, Share2, DollarSign, Clock, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';

export const AIPredictionDrawer: React.FC = () => {
  const [predictions, setPredictions] = useState<AIPredictionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<string>('');

  const runPrediction = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/predict-upsell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      setPredictions(data.predictions || []);
      setSource(data.source || 'gemini');
    } catch (err) {
      console.error('Error running AI prediction:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-3.5 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#2d3139] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 bg-[#a855f7]/20 text-[#c084fc] rounded border border-[#a855f7]/30">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Fase 3: Motor de IA Preditiva para Upsell &amp; Atribuição de Indicações
            </h2>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-0.5">
            Algoritmo preditivo que analisa a coorte de clientes do <strong>Produto A</strong> e calcula a probabilidade de compra do <strong>Produto B</strong> e geração de indicações.
          </p>
        </div>

        <button
          onClick={runPrediction}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow transition-all disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Analisando Base...' : 'Executar Análise Preditiva de IA'}</span>
        </button>
      </div>

      {/* Model explanation banner */}
      <div className="bg-[#0f1115] border border-[#2d3139] p-2.5 rounded-lg mb-4 flex items-center justify-between text-xs text-[#cbd5e1]">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-[#818cf8]" />
          <span className="text-[11px]">
            Modelo: <strong>Gemini Flash &amp; Propensity Heuristics</strong> &bull; Analisando tempo de base, ticket histórico e sinais comportamentais de expansão.
          </span>
        </div>
        {source && (
          <span className="bg-[#1a1d23] text-[#94a3b8] px-2 py-0.5 rounded text-[10px] font-mono border border-[#2d3139]">
            Origem: {source}
          </span>
        )}
      </div>

      {/* Predictions Cards Grid */}
      {predictions.length === 0 ? (
        <div className="bg-[#0f1115] border border-[#2d3139] rounded-lg p-6 text-center text-[#94a3b8]">
          <Sparkles className="w-6 h-6 text-[#c084fc] mx-auto mb-1.5" />
          <p className="font-semibold text-white text-xs">Nenhuma predição gerada ainda nesta sessão.</p>
          <p className="text-[11px] text-[#94a3b8] mt-0.5 mb-3">
            Clique no botão acima para rodar a IA sobre a base de clientes do Produto A.
          </p>
          <button
            onClick={runPrediction}
            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs px-3 py-1 rounded font-semibold transition-colors"
          >
            Gerar Diagnóstico Preditivo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {predictions.map(pred => (
            <div
              key={pred.customer_id}
              className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139] hover:border-[#6366f1]/50 transition-all text-xs"
            >
              {/* Card Title */}
              <div className="flex items-center justify-between border-b border-[#2d3139] pb-1.5 mb-2.5">
                <div>
                  <span className="font-bold text-xs text-white">{pred.customer_name}</span>
                  <div className="text-[10px] text-[#94a3b8]">{pred.current_product}</div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-[#94a3b8] uppercase">Oportunidade</span>
                  <div className="font-extrabold text-[#34d399] text-xs">
                    R$ {pred.projected_revenue_opportunity.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>

              {/* Dual Scores Bar */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                {/* Propensity Upsell B */}
                <div className="bg-[#1a1d23] p-2 rounded border border-[#2d3139]">
                  <div className="flex items-center justify-between text-[10px] text-[#94a3b8] mb-1">
                    <span className="text-[#c084fc] font-semibold">Propensão Upsell B</span>
                    <span className="font-bold text-white">{pred.propensity_score_upsell_b}%</span>
                  </div>
                  <div className="w-full bg-[#0f1115] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#a855f7] h-full rounded-full"
                      style={{ width: `${pred.propensity_score_upsell_b}%` }}
                    ></div>
                  </div>
                </div>

                {/* Propensity Referral */}
                <div className="bg-[#1a1d23] p-2 rounded border border-[#2d3139]">
                  <div className="flex items-center justify-between text-[10px] text-[#94a3b8] mb-1">
                    <span className="text-[#f472b6] font-semibold">Propensão Indicação</span>
                    <span className="font-bold text-white">{pred.propensity_score_referral}%</span>
                  </div>
                  <div className="w-full bg-[#0f1115] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#ec4899] h-full rounded-full"
                      style={{ width: `${pred.propensity_score_referral}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="bg-[#1a1d23] p-2 rounded border border-[#2d3139] mb-1.5">
                <div className="text-[9px] uppercase font-bold text-[#818cf8] mb-0.5">Ação Recomendada</div>
                <div className="text-[#e2e8f0] font-medium text-[11px]">{pred.recommended_action}</div>
              </div>

              {/* AI Reasoning */}
              <p className="text-[#94a3b8] text-[10px] mb-1.5 leading-normal">
                <strong className="text-[#cbd5e1]">Justificativa:</strong> {pred.reasoning}
              </p>

              {/* Contact Window */}
              <div className="flex items-center space-x-1.5 text-[9px] text-[#94a3b8]">
                <Clock className="w-2.5 h-2.5 text-[#94a3b8]" />
                <span>Janela ideal: <strong className="text-white">{pred.optimal_contact_window}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
