export const SQL_DDL_SCRIPT = `-- =========================================================================
-- ARQUITETURA RELACIONAL & ATRIBUIÇÃO DE VENDAS ENCADEADAS (CRM & BI)
-- Compatível com PostgreSQL 14+ / Supabase / Cloud SQL / MySQL 8+
-- =========================================================================

-- 1. Tabela de Leads e Clientes
CREATE TABLE leads_clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    channel VARCHAR(50) NOT NULL, -- 'Google Ads', 'Meta Ads', 'Organico', 'Indicacao', 'Outbound'
    status VARCHAR(30) DEFAULT 'lead', -- 'lead', 'customer_a', 'customer_ab', 'churned'
    referrer_customer_id UUID REFERENCES leads_clientes(id) ON DELETE SET NULL, -- Se o lead veio de indicação direta
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Índices para agregação de funil e cohort por período de aquisição
CREATE INDEX idx_leads_created_at ON leads_clientes(created_at);
CREATE INDEX idx_leads_channel ON leads_clientes(channel);
CREATE INDEX idx_leads_referrer ON leads_clientes(referrer_customer_id);

-- 2. Tabela de Catálogo de Produtos
CREATE TABLE produtos (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    product_type VARCHAR(50) NOT NULL, -- 'PRODUTO_A', 'PRODUTO_B', 'SERVICO_X', 'PRODUTO_C'
    price NUMERIC(12, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Tabela de Vendas & Relacionamento Encadeado (Core da Atribuição)
CREATE TABLE vendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES leads_clientes(id) ON DELETE RESTRICT,
    product_id VARCHAR(50) NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
    product_type VARCHAR(50) NOT NULL, -- Desnormalizado para agilizar consultas analíticas
    amount NUMERIC(12, 2) NOT NULL,
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- REGRA DE ATRIBUIÇÃO CRUCIAL:
    -- Se parent_sale_id IS NULL: Venda primária/direta (Produto A ou Serviço X)
    -- Se parent_sale_id IS NOT NULL: Venda secundária/encadeada (Produto B / Upsell pós-venda A)
    parent_sale_id UUID REFERENCES vendas(id) ON DELETE SET NULL,
    
    -- Vínculo com a indicação originária (caso a venda tenha sido fruto de indicação de outro cliente)
    indication_id UUID,
    
    channel VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Índices cruciais para junções recursivas e agregação de vendas encadeadas em alta velocidade
CREATE INDEX idx_vendas_customer_date ON vendas(customer_id, sale_date);
CREATE INDEX idx_vendas_parent_sale ON vendas(parent_sale_id);
CREATE INDEX idx_vendas_product_type_date ON vendas(product_type, sale_date);
CREATE INDEX idx_vendas_indication ON vendas(indication_id);

-- 4. Tabela de Indicações (Referral Tracking)
CREATE TABLE indicacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indicador_id UUID NOT NULL REFERENCES leads_clientes(id) ON DELETE CASCADE, -- Cliente A que indicou
    indicado_id UUID NOT NULL REFERENCES leads_clientes(id) ON DELETE CASCADE,  -- Novo Lead gerado
    venda_gerada BOOLEAN DEFAULT FALSE NOT NULL, -- Rastreia se a indicação virou venda efetiva
    sale_id UUID REFERENCES vendas(id) ON DELETE SET NULL, -- ID da venda gerada
    sale_amount NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT uq_indicador_indicado UNIQUE(indicador_id, indicado_id)
);

-- Índices para cálculo de viralidade (K-Factor) e receita por indicação
CREATE INDEX idx_indicacoes_indicador ON indicacoes(indicador_id);
CREATE INDEX idx_indicacoes_venda_gerada ON indicacoes(venda_gerada, created_at);

-- Adicionando a Foreign Key atrasada de vendas.indication_id -> indicacoes.id
ALTER TABLE vendas 
ADD CONSTRAINT fk_vendas_indicacao 
FOREIGN KEY (indication_id) REFERENCES indicacoes(id) ON DELETE SET NULL;
`;

export const MATERIALIZED_VIEW_SQL = `-- =========================================================================
-- MATERIALIZED VIEWS & ESTRATÉGIA DE PERFORMANCE (> 50.000 VENDAS)
-- Pré-agregação diária/mensal para alimentar os dashboards em < 50ms
-- =========================================================================

CREATE MATERIALIZED VIEW mv_funnel_attribution_monthly AS
WITH monthly_leads AS (
    SELECT 
        DATE_TRUNC('month', created_at) AS cohort_month,
        COUNT(*) AS total_leads
    FROM leads_clientes
    GROUP BY 1
),
primary_sales_a AS (
    SELECT 
        DATE_TRUNC('month', v.sale_date) AS sale_month,
        COUNT(DISTINCT v.customer_id) AS converted_to_a_clients,
        SUM(v.amount) AS revenue_direct_a
    FROM vendas v
    WHERE v.product_type = 'PRODUTO_A' 
      AND v.parent_sale_id IS NULL
    GROUP BY 1
),
chained_sales_b AS (
    SELECT 
        DATE_TRUNC('month', v.sale_date) AS sale_month,
        COUNT(DISTINCT v.customer_id) AS converted_to_b_from_a,
        SUM(v.amount) AS revenue_chained_b
    FROM vendas v
    WHERE v.product_type = 'PRODUTO_B' 
      AND v.parent_sale_id IS NOT NULL
    GROUP BY 1
),
referral_conversions AS (
    SELECT 
        DATE_TRUNC('month', i.created_at) AS ref_month,
        COUNT(DISTINCT i.indicador_id) AS clients_who_referred,
        COUNT(i.id) AS total_indications,
        COUNT(CASE WHEN i.venda_gerada THEN 1 END) AS indications_converted,
        SUM(COALESCE(i.sale_amount, 0)) AS revenue_referrals
    FROM indicacoes i
    GROUP BY 1
)
SELECT 
    ml.cohort_month,
    COALESCE(ml.total_leads, 0) AS total_leads,
    COALESCE(pa.converted_to_a_clients, 0) AS converted_to_a,
    COALESCE(cb.converted_to_b_from_a, 0) AS converted_to_b_from_a,
    COALESCE(rc.total_indications, 0) AS total_indications,
    COALESCE(rc.indications_converted, 0) AS indications_converted,
    COALESCE(pa.revenue_direct_a, 0) AS revenue_direct_a,
    COALESCE(cb.revenue_chained_b, 0) AS revenue_chained_b,
    COALESCE(rc.revenue_referrals, 0) AS revenue_referrals
FROM monthly_leads ml
LEFT JOIN primary_sales_a pa ON pa.sale_month = ml.cohort_month
LEFT JOIN chained_sales_b cb ON cb.sale_month = ml.cohort_month
LEFT JOIN referral_conversions rc ON rc.ref_month = ml.cohort_month
ORDER BY ml.cohort_month DESC;

-- Criação de índice único para permitir REFRESH MATERIALIZED VIEW CONCURRENTLY
CREATE UNIQUE INDEX idx_mv_funnel_cohort_month ON mv_funnel_attribution_monthly(cohort_month);
`;

export const MOBILE_TECH_COMPARISON = [
  {
    library: 'React Native Skia + D3 / Victory Native XL',
    ecosystem: 'React Native / Expo',
    rating: '⭐ Recomendado para Sankey & Funis Customizados',
    pros: [
      'Renderização 60/120 FPS acelerada por GPU via Skia Canvas nativo',
      'Excelente suporte a caminhos Bézier (Sankey streams e curvas de fluxo encadeado)',
      'Gestos táteis nativos fluidos (hover, drag, pinch-to-zoom com react-native-gesture-handler)',
      'Compartilhamento de código 100% entre iOS e Android'
    ],
    cons: ['Requer cálculo matemático prévio das coordenadas dos nós (D3-Sankey helper)'],
    verdict: 'Melhor opção global para apps modernos com gráficos encadeados e animações reativas.'
  },
  {
    library: 'MPAndroidChart (Kotlin) & Charts (SwiftUI)',
    ecosystem: 'Nativo (Android / iOS)',
    rating: '⭐ Excelente para Séries Temporais e Barras Empilhadas',
    pros: [
      'Performance máxima de renderização sem bridge JavaScript',
      'Grande maturidade e documentação para gráficos de linha e barras com 100k+ pontos',
      'Touch tooltips e markerviews nativos de altíssima precisão'
    ],
    cons: [
      'Não possui suporte nativo pronto a diagramas de Sankey complexos (exige desenhar no Canvas nativo)',
      'Duplica esforço de desenvolvimento entre iOS e Android'
    ],
    verdict: 'Ideal se o app for 100% nativo em Kotlin/Java e o foco principal for séries temporais densas.'
  },
  {
    library: 'Apache ECharts (via WebView otimizada / React Native Echarts)',
    ecosystem: 'Multiplataforma',
    rating: '⭐ Mais rápido para implementar Sankey & Treemap Prontos',
    pros: [
      'Possui tipos nativos de Sankey e Treemap extremamente maduros e configuráveis',
      'Tooltips interativos ricos e animações de fluxo embutidas sem código customizado',
      'Permite reutilizar exatamente a mesma configuração gráfica na Web e no Mobile'
    ],
    cons: ['Leve sobrecarga de memória pela camada WebView; latência de toque ligeiramente superior ao Skia.'],
    verdict: 'Excelente alternativa para MVP rápido com zero complexidade de cálculo trigonométrico.'
  }
];

export const PERFORMANCE_STRATEGY = {
  challenge: 'Garantir velocidade de carregamento sub-100ms em gráficos de BI com mais de 50.000 a 1.000.000 de vendas.',
  layers: [
    {
      name: '1. Materialized Views & Rollup Tables (Banco de Dados)',
      description: 'Consultas recursivas com JOINs entre vendas-mãe (parent_sale_id) e indicações são pesadas para rodar em tempo real em 50k+ registros. A criação de Materialized Views diárias/mensais (ex: mv_funnel_attribution_monthly) pré-computa os números de funil. Um cron job faz REFRESH MATERIALIZED VIEW CONCURRENTLY a cada 10 minutos ou a cada fechamento de lote.',
      impact: 'Redução de tempo de query de ~2.400ms para < 8ms.'
    },
    {
      name: '2. Caching em Memória com Redis (Camada de Aplicação)',
      description: 'As respostas JSON dos endpoints /api/metrics/conversion-funnel e /api/metrics/timeline são cacheadas no Redis com chaves indexadas pelos parâmetros de filtro: cache:funnel:${startDate}:${endDate}:${product}. TTL padrão de 300 segundos (5 min), com invalidação orientada a eventos (quando uma nova venda encadeada ou indicação é criada via webhook/trigger, a chave do período afetado é purgada).',
      impact: 'Latência de resposta da API de ~2ms com economia de 95% de I/O no banco relacional.'
    },
    {
      name: '3. Índices Compostos & Covering Indexes',
      description: 'Garantir índices compostos estratégicos: CREATE INDEX idx_vendas_attr ON vendas(product_type, parent_sale_id, sale_date) INCLUDE (amount, customer_id); e CREATE INDEX idx_ind_venda ON indicacoes(indicador_id, venda_gerada) INCLUDE (sale_amount); permitindo Index-Only Scans sem acessar as páginas da tabela física.',
      impact: 'Evita sequential table scans e gargalos de CPU no PostgreSQL.'
    },
    {
      name: '4. Evolução para Banco OLAP (ClickHouse / DuckDB / BigQuery)',
      description: 'Ao ultrapassar 1 milhão de eventos, desacoplar a carga analítica do banco transacional (OLTP). Replicar eventos via CDC (Change Data Capture com Debezium/Kafka) para um banco colunar como ClickHouse ou DuckDB, onde agregações de milhões de linhas rodam em milissegundos.',
      impact: 'Escalabilidade para dezenas de milhões de transações sem impactar a operação do CRM.'
    }
  ]
};
