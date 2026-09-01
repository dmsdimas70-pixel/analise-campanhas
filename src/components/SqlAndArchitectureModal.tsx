import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Code, 
  Layers, 
  Smartphone, 
  Zap, 
  Copy, 
  Check, 
  Server, 
  FileText, 
  Gauge, 
  ShieldCheck 
} from 'lucide-react';
import { SQL_DDL_SCRIPT, MATERIALIZED_VIEW_SQL, MOBILE_TECH_COMPARISON, PERFORMANCE_STRATEGY } from '../data/technicalDocs';

export const SqlAndArchitectureModal: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ddl' | 'endpoints' | 'business_rules' | 'mobile_tech' | 'performance' | 'roadmap'>('ddl');
  const [copied, setCopied] = useState(false);
  const [perfBenchmarks, setPerfBenchmarks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/performance-stats')
      .then(res => res.json())
      .then(data => setPerfBenchmarks(data.benchmarks || []))
      .catch(() => {});
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-3.5 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#2d3139] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 bg-[#10b981]/20 text-[#34d399] rounded border border-[#10b981]/30">
              <Database className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Entregáveis Técnicos &amp; Engenharia de Dados BI
            </h2>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-0.5">
            Scripts DDL de banco de dados, especificação de APIs REST, regras de negócio, benchmark de bibliotecas mobile e arquitetura de alta performance.
          </p>
        </div>
      </div>

      {/* Sub-Tabs Nav */}
      <div className="flex space-x-1 border-b border-[#2d3139] pb-2.5 mb-4 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('ddl')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'ddl' ? 'bg-[#2d3139] text-white border border-[#3f444e]' : 'bg-[#0f1115] text-[#94a3b8] hover:text-slate-200 border border-[#2d3139]'
          }`}
        >
          <Code className="w-3 h-3 text-[#34d399]" />
          <span>1. Modelagem SQL (DDL)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('endpoints')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'endpoints' ? 'bg-[#2d3139] text-white border border-[#3f444e]' : 'bg-[#0f1115] text-[#94a3b8] hover:text-slate-200 border border-[#2d3139]'
          }`}
        >
          <Server className="w-3 h-3 text-[#818cf8]" />
          <span>2. Endpoints da API</span>
        </button>

        <button
          onClick={() => setActiveSubTab('business_rules')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'business_rules' ? 'bg-[#2d3139] text-white border border-[#3f444e]' : 'bg-[#0f1115] text-[#94a3b8] hover:text-slate-200 border border-[#2d3139]'
          }`}
        >
          <FileText className="w-3 h-3 text-[#c084fc]" />
          <span>3. Regras de Atribuição</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mobile_tech')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'mobile_tech' ? 'bg-[#2d3139] text-white border border-[#3f444e]' : 'bg-[#0f1115] text-[#94a3b8] hover:text-slate-200 border border-[#2d3139]'
          }`}
        >
          <Smartphone className="w-3 h-3 text-[#f472b6]" />
          <span>4. Bibliotecas Mobile</span>
        </button>

        <button
          onClick={() => setActiveSubTab('performance')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'performance' ? 'bg-[#2d3139] text-white border border-[#3f444e]' : 'bg-[#0f1115] text-[#94a3b8] hover:text-slate-200 border border-[#2d3139]'
          }`}
        >
          <Gauge className="w-3 h-3 text-[#fbbf24]" />
          <span>5. Performance (&gt;50k Vendas)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roadmap')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
            activeSubTab === 'roadmap' ? 'bg-[#2d3139] text-white border border-[#3f444e]' : 'bg-[#0f1115] text-[#94a3b8] hover:text-slate-200 border border-[#2d3139]'
          }`}
        >
          <Zap className="w-3 h-3 text-[#38bdf8]" />
          <span>6. Fases de Desenvolvimento</span>
        </button>
      </div>

      {/* TAB 1: DDL SCRIPT */}
      {activeSubTab === 'ddl' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#cbd5e1]">
              Script DDL Relacional (PostgreSQL / Cloud SQL / MySQL) com chaves estrangeiras <code>parent_sale_id</code> e <code>indication_id</code>:
            </span>
            <button
              onClick={() => handleCopy(SQL_DDL_SCRIPT)}
              className="flex items-center space-x-1.5 bg-[#0f1115] hover:bg-[#2d3139] text-[#e2e8f0] text-xs px-2.5 py-1 rounded border border-[#2d3139] transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-[#34d399]" /> : <Copy className="w-3 h-3 text-[#94a3b8]" />}
              <span>{copied ? 'Copiado!' : 'Copiar DDL SQL'}</span>
            </button>
          </div>

          <div className="bg-[#0f1115] rounded-lg p-3.5 border border-[#2d3139] overflow-x-auto max-h-[420px] custom-scrollbar">
            <pre className="text-xs font-mono text-[#34d399] leading-relaxed whitespace-pre">
              {SQL_DDL_SCRIPT}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: REST ENDPOINTS */}
      {activeSubTab === 'endpoints' && (
        <div className="space-y-4 text-xs">
          {/* Endpoint 1 */}
          <div className="bg-[#0f1115] p-3.5 rounded-lg border border-[#2d3139]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <span className="bg-[#6366f1] text-white font-mono px-1.5 py-0.2 rounded font-bold text-[10px]">GET</span>
                <span className="font-mono text-white text-xs font-semibold">/api/metrics/conversion-funnel</span>
              </div>
              <span className="text-[#94a3b8] text-[11px]">Gera dados do Sankey e Funil Duplo</span>
            </div>
            <p className="text-[#94a3b8] text-[11px] mb-2">
              <strong>Query Params:</strong> <code>startDate</code> (YYYY-MM-DD), <code>endDate</code> (YYYY-MM-DD), <code>product</code> (all, PRODUTO_A, PRODUTO_B).
            </p>
            <div className="bg-[#1a1d23] p-2.5 rounded border border-[#2d3139] font-mono text-[10px] text-[#818cf8]">
              <pre className="whitespace-pre-wrap">{`{
  "period": { "start": "2026-01-01", "end": "2026-08-31" },
  "summary": {
    "total_leads": 1895,
    "converted_to_A": 624,
    "conversion_rate_A": 32.93,
    "converted_to_B_from_A": 256,
    "chained_upsell_rate_B": 41.03,
    "clients_A_who_referred": 142,
    "total_indications_made": 310,
    "indications_converted": 138,
    "indication_conversion_rate": 44.52,
    "viral_coefficient_k": 0.221
  },
  "sankey_nodes": [ ... ],
  "sankey_links": [ ... ]
}`}</pre>
            </div>
          </div>

          {/* Endpoint 2 */}
          <div className="bg-[#0f1115] p-3.5 rounded-lg border border-[#2d3139]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <span className="bg-[#10b981] text-white font-mono px-1.5 py-0.2 rounded font-bold text-[10px]">GET</span>
                <span className="font-mono text-white text-xs font-semibold">/api/metrics/timeline?group_by=month</span>
              </div>
              <span className="text-[#94a3b8] text-[11px]">Gera dados dos Gráficos de Linhas / Barras Empilhadas</span>
            </div>
            <p className="text-[#94a3b8] text-[11px] mb-2">
              <strong>Query Params:</strong> <code>group_by</code> (month | week), <code>startDate</code>, <code>endDate</code>.
            </p>
            <div className="bg-[#1a1d23] p-2.5 rounded border border-[#2d3139] font-mono text-[10px] text-[#34d399]">
              <pre className="whitespace-pre-wrap">{`{
  "group_by": "month",
  "timeline": [
    {
      "period": "2026-01",
      "formatted_period": "Jan/26",
      "leads_entrantes": 140,
      "conversoes_produto_a": 39,
      "conversoes_produto_b_encadeadas": 14,
      "vendas_por_indicacao": 8,
      "receita_total": 92400,
      "taxa_conversao_a": 27.9,
      "taxa_upsell_b": 35.9
    }
  ]
}`}</pre>
            </div>
          </div>

          {/* Endpoint 3 */}
          <div className="bg-[#0f1115] p-3.5 rounded-lg border border-[#2d3139]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <span className="bg-[#a855f7] text-white font-mono px-1.5 py-0.2 rounded font-bold text-[10px]">GET</span>
                <span className="font-mono text-white text-xs font-semibold">/api/metrics/attribution-tree</span>
              </div>
              <span className="text-[#94a3b8] text-[11px]">Gera dados do Treemap / Split de Receita</span>
            </div>
            <div className="bg-[#1a1d23] p-2.5 rounded border border-[#2d3139] font-mono text-[10px] text-[#c084fc]">
              <pre className="whitespace-pre-wrap">{`{
  "total_revenue": 1784200,
  "direct_revenue": 936000,
  "indirect_chained_revenue": 614400,
  "referral_revenue": 233800,
  "ltv_uplift_percentage": 90.6,
  "tree_data": [
    { "name": "Receita Direta (Produto A)", "revenue": 936000, "percentage_of_total": 52.5 },
    { "name": "Receita Indireta Encadeada (Produto B)", "revenue": 614400, "percentage_of_total": 34.4 },
    { "name": "Receita de Indicações", "revenue": 233800, "percentage_of_total": 13.1 }
  ]
}`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUSINESS RULES */}
      {activeSubTab === 'business_rules' && (
        <div className="space-y-3 text-xs text-[#cbd5e1] leading-relaxed">
          <div className="bg-[#0f1115] p-3.5 rounded-lg border border-[#2d3139]">
            <h4 className="text-xs font-bold text-white mb-2 flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
              <span>Regra de Diferenciação: Venda Primária vs Venda Encadeada</span>
            </h4>
            <p className="mb-2 text-[#94a3b8] text-[11px]">
              A atribuição é modelada através do ponteiro recursivo <code>parent_sale_id</code> na tabela de vendas:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-2.5">
              <div className="bg-[#1a1d23] p-2.5 rounded border border-[#10b981]/40">
                <span className="font-bold text-[#34d399] text-xs">Venda Primária (Produto A ou Serviço X)</span>
                <p className="text-[10px] text-[#94a3b8] mt-1">
                  <code>parent_sale_id IS NULL</code>: Representa o primeiro negócio fechado pelo cliente na empresa (conversão bruta de aquisição).
                </p>
              </div>
              <div className="bg-[#1a1d23] p-2.5 rounded border border-[#a855f7]/40">
                <span className="font-bold text-[#c084fc] text-xs">Venda Secundária / Encadeada (Produto B)</span>
                <p className="text-[10px] text-[#94a3b8] mt-1">
                  <code>parent_sale_id IS NOT NULL</code>: Aponta diretamente para a venda primária que a originou (Upsell / Cross-sell atribuído à adoção do Produto A).
                </p>
              </div>
            </div>
            <p className="text-[#94a3b8] text-[11px]">
              <strong className="text-white">Atribuição de Indicação (Referral Attribution):</strong> Quando o cliente do Produto A gera uma indicação, cria-se um registro na tabela <code>indicacoes</code> com <code>indicador_id = cliente_A.id</code>. Ao fechar negócio, <code>venda_gerada = true</code> e a venda criada recebe <code>indication_id</code>, permitindo mensurar a receita viral gerada por cada cliente.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: MOBILE TECH COMPARISON */}
      {activeSubTab === 'mobile_tech' && (
        <div className="space-y-3">
          <div className="text-xs text-[#94a3b8] mb-1">
            Análise e recomendação de bibliotecas mobile para renderização de gráficos complexos (Sankey, Funil e Séries Temporais):
          </div>

          <div className="grid grid-cols-1 gap-3">
            {MOBILE_TECH_COMPARISON.map((tech, idx) => (
              <div key={idx} className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139] text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div>
                    <span className="font-bold text-xs text-white">{tech.library}</span>
                    <span className="ml-2 text-[#94a3b8] text-[11px]">({tech.ecosystem})</span>
                  </div>
                  <span className="bg-[#6366f1]/20 text-[#818cf8] font-semibold px-2 py-0.2 rounded border border-[#6366f1]/30 text-[10px]">
                    {tech.rating}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <div className="bg-[#1a1d23] p-2 rounded border border-[#2d3139]">
                    <span className="text-[#34d399] font-bold block mb-1 text-[11px]">Vantagens:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[10px] text-[#cbd5e1]">
                      {tech.pros.map((p, pIdx) => (
                        <li key={pIdx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#1a1d23] p-2 rounded border border-[#2d3139]">
                    <span className="text-[#fbbf24] font-bold block mb-1 text-[11px]">Limitações:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[10px] text-[#cbd5e1]">
                      {tech.cons.map((c, cIdx) => (
                        <li key={cIdx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="text-[10px] text-[#94a3b8]">
                  <strong className="text-white">Veredito do PM / Arquiteto:</strong> {tech.verdict}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: HIGH-SCALE PERFORMANCE (> 50,000 VENDAS) */}
      {activeSubTab === 'performance' && (
        <div className="space-y-3 text-xs">
          <div className="bg-[#0f1115] p-3.5 rounded-lg border border-[#2d3139]">
            <h4 className="text-xs font-bold text-white mb-2 flex items-center space-x-2">
              <Gauge className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Resposta Obrigatória: Estratégia de Performance (&gt;50.000 a 1.000.000 de Vendas)</span>
            </h4>
            <p className="text-[#94a3b8] text-[11px] mb-3">
              Quando o volume de transações cresce, consultas com JOINs recursivos em <code>parent_sale_id</code> tornam-se o gargalo da aplicação mobile. Implementamos a seguinte arquitetura em 4 camadas:
            </p>

            {/* Benchmark Latency Simulation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
              {perfBenchmarks.map((b, idx) => (
                <div key={idx} className="bg-[#1a1d23] p-2.5 rounded border border-[#2d3139]">
                  <div className="text-[9px] uppercase font-bold text-[#94a3b8]">{b.tier}</div>
                  <div className="text-lg font-bold my-0.5 text-white flex items-baseline space-x-1">
                    <span>{b.latency_ms} ms</span>
                  </div>
                  <div className="text-[10px] text-[#94a3b8]">{b.description}</div>
                </div>
              ))}
            </div>

            {/* 4 Layers breakdown */}
            <div className="space-y-2">
              {PERFORMANCE_STRATEGY.layers.map((layer, idx) => (
                <div key={idx} className="bg-[#1a1d23] p-2.5 rounded border border-[#2d3139]">
                  <span className="font-bold text-[#34d399] block mb-0.5 text-[11px]">{layer.name}</span>
                  <p className="text-[#94a3b8] text-[10px] mb-1 leading-normal">{layer.description}</p>
                  <span className="text-[9px] font-semibold text-[#818cf8] bg-[#6366f1]/10 px-1.5 py-0.2 rounded border border-[#6366f1]/20 inline-block">
                    Impacto: {layer.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ROADMAP */}
      {activeSubTab === 'roadmap' && (
        <div className="space-y-2.5 text-xs">
          <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139]">
            <span className="font-bold text-xs text-[#818cf8] block mb-0.5">MVP (60 dias) - Foco Total nos Gráficos de Funil &amp; Séries Temporais</span>
            <p className="text-[#94a3b8] text-[10px] mb-1.5 leading-normal">
              &bull; Estrutura de banco com chaves <code>parent_sale_id</code> e <code>indication_id</code>.<br />
              &bull; Cadastro básico de clientes e lançamento de vendas com vínculo à venda original.<br />
              &bull; Gráfico A (Funil Duplo / Sankey) e Gráfico B (Série Temporal de Conversão).
            </p>
            <span className="bg-[#6366f1]/20 text-[#818cf8] text-[9px] font-bold px-1.5 py-0.2 rounded border border-[#6366f1]/30">Status: Entregue</span>
          </div>

          <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139]">
            <span className="font-bold text-xs text-[#c084fc] block mb-0.5">Fase 2 - Gráfico de Atribuição (Treemap) &amp; Jornada Individual</span>
            <p className="text-[#94a3b8] text-[10px] mb-1.5 leading-normal">
              &bull; Gráfico C (Treemap de faturamento direto vs indireto encadeado vs indicações).<br />
              &bull; Gráfico D (Timeline interativa da jornada individual do cliente com árvore de indicações).
            </p>
            <span className="bg-[#a855f7]/20 text-[#c084fc] text-[9px] font-bold px-1.5 py-0.2 rounded border border-[#a855f7]/30">Status: Entregue</span>
          </div>

          <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139]">
            <span className="font-bold text-xs text-[#34d399] block mb-0.5">Fase 3 - Motor de IA Preditiva para Upsell e Indicação</span>
            <p className="text-[#94a3b8] text-[10px] mb-1.5 leading-normal">
              &bull; Integração Gemini Flash para prever propensão de compra de Produto B e geração de indicações baseada em dados históricos do funil.
            </p>
            <span className="bg-[#10b981]/20 text-[#34d399] text-[9px] font-bold px-1.5 py-0.2 rounded border border-[#10b981]/30">Status: Entregue</span>
          </div>
        </div>
      )}
    </div>
  );
};
