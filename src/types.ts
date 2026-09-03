export type ProductType = 'PRODUTO_A' | 'PRODUTO_B' | 'SERVICO_X' | 'PRODUTO_C' | 'OUTRO';

export type OriginType = 'campanha' | 'organico' | 'social' | 'direto' | 'parceria' | 'indicacao' | 'outro';

export type ArrivalLevel = 
  | 'nivel_1_lead'        // Nível 1: Primeiro Contato / Lead Recebido
  | 'nivel_2_negociacao'  // Nível 2: Em Negociação / Proposta
  | 'nivel_3_produto_a'   // Nível 3: Comprou Produto Principal
  | 'nivel_4_upsell'      // Nível 4: Comprou Upsell / Recompra
  | 'nivel_5_fidelizado';  // Nível 5: Cliente Fiel / Recorrente (Alto LTV)

export interface ArrivalLevelInfo {
  level: ArrivalLevel;
  number: number;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const ARRIVAL_LEVELS: Record<ArrivalLevel, ArrivalLevelInfo> = {
  nivel_1_lead: {
    level: 'nivel_1_lead',
    number: 1,
    label: 'Nível 1: Primeiro Contato / Lead',
    shortLabel: 'Nível 1 (Lead)',
    description: 'Entrou pela campanha, sem proposta enviada ainda',
    color: '#3b82f6',
    badgeBg: 'bg-blue-950/40',
    badgeBorder: 'border-blue-500/40',
    badgeText: 'text-blue-300'
  },
  nivel_2_negociacao: {
    level: 'nivel_2_negociacao',
    number: 2,
    label: 'Nível 2: Em Negociação / Proposta',
    shortLabel: 'Nível 2 (Negociação)',
    description: 'Recebeu proposta ou demonstrou alto interesse comercial',
    color: '#f59e0b',
    badgeBg: 'bg-amber-950/40',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-300'
  },
  nivel_3_produto_a: {
    level: 'nivel_3_produto_a',
    number: 3,
    label: 'Nível 3: Comprou Produto Principal',
    shortLabel: 'Nível 3 (Produto Principal)',
    description: 'Venda do produto principal concluída e faturada',
    color: '#10b981',
    badgeBg: 'bg-emerald-950/40',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-300'
  },
  nivel_4_upsell: {
    level: 'nivel_4_upsell',
    number: 4,
    label: 'Nível 4: Upsell / Recompra Adquirida',
    shortLabel: 'Nível 4 (Upsell/Recompra)',
    description: 'Comprou produto adicional ou upgrade secundário',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-950/40',
    badgeBorder: 'border-purple-500/40',
    badgeText: 'text-purple-300'
  },
  nivel_5_fidelizado: {
    level: 'nivel_5_fidelizado',
    number: 5,
    label: 'Nível 5: Cliente Fiel / Recorrente',
    shortLabel: 'Nível 5 (Fidelizado)',
    description: 'Cliente com múltiplas compras e alto LTV acumulado',
    color: '#ec4899',
    badgeBg: 'bg-pink-950/40',
    badgeBorder: 'border-pink-500/40',
    badgeText: 'text-pink-300'
  }
};

export interface Company {
  id: string;
  name: string;
  segment: string;
  logo_initials: string;
  color: string;
  monthly_goal?: number;
  created_at: string;
}

export interface Seller {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar_color?: string;
  role?: string; // e.g. 'Closer', 'SDR / Pré-vendas', 'Consultor Comercial', 'Atendente WhatsApp'
  active: boolean;
  created_at: string;
}

export interface SellerRankingItem {
  seller_id: string;
  seller_name: string;
  seller_role?: string;
  avatar_color?: string;
  leads_attended: number; // Quantidade de atendimentos / contatos feitos
  sales_closed: number;   // Quantidade de vendas fechadas
  conversion_rate: number;// Taxa de conversão (% atendimentos que viraram vendas)
  total_revenue: number;  // Faturamento total gerado (R$)
  avg_ticket: number;     // Ticket médio (R$)
}

export interface CustomerLead {
  id: string;
  company_id?: string;
  name: string;
  email: string;
  phone: string;
  created_at: string; // ISO string
  channel: string; // 'Google Ads', 'Meta Ads', 'TikTok Ads', 'Organico', etc.
  origin_type?: OriginType;
  campaign_name?: string; // De qual campanha veio
  referrer_name?: string;
  seller_id?: string | null;
  seller_name?: string | null;
  status: 'lead' | 'customer_a' | 'customer_ab' | 'churned';
  arrival_level?: ArrivalLevel;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  price: number;
  description: string;
}

export interface Sale {
  id: string;
  company_id?: string;
  customer_id: string;
  customer_name?: string;
  product_id: string;
  product_name: string;
  product_type: ProductType;
  amount: number;
  sale_date: string;
  parent_sale_id: string | null; // NULL = primária (Produto A); Not NULL = secundária/upsell
  channel: string;
  origin_type: OriginType;
  campaign_name?: string; // Nome da campanha de onde o produto veio
  referrer_name?: string;
  seller_id?: string | null;
  seller_name?: string | null;
  arrival_level?: ArrivalLevel;
  notes?: string;
}

export interface JourneyEvent {
  id: string;
  date: string;
  type: 'LEAD_CREATED' | 'PRIMARY_SALE' | 'CHAINED_SALE' | 'INDICATION_MADE' | 'INDICATION_CONVERTED';
  title: string;
  description: string;
  amount?: number;
  metadata?: {
    product_type?: ProductType;
    parent_sale_id?: string | null;
    campaign_name?: string;
    channel?: string;
  };
}

export interface CustomerWithJourney extends CustomerLead {
  sales: Sale[];
  journey_events: JourneyEvent[];
  total_direct_spend: number;
  total_chained_spend: number;
  total_customer_value: number; // LTV (Direto + Encadeado)
}

export interface FunnelMetricsResponse {
  period: { start: string; end: string };
  summary: {
    total_leads: number;
    converted_to_A: number;
    conversion_rate_A: number; // %
    converted_to_B_from_A: number;
    chained_upsell_rate_B: number; // %
    total_revenue: number;
    campaign_revenue: number;
    organic_revenue: number;
  };
  sankey_nodes: Array<{ id: string; name: string; category: string; value: number; color: string }>;
  sankey_links: Array<{ source: string; target: string; value: number; label: string; rate?: string }>;
}

export interface TimelineDataPoint {
  period: string; // "2026-01", "2026-02", etc.
  formatted_period: string;
  leads_entrantes: number;
  conversoes_produto_a: number;
  conversoes_produto_b_encadeadas: number;
  receita_total: number;
  receita_campanhas: number;
  receita_organico: number;
  taxa_conversao_a: number;
  taxa_upsell_b: number;
}

export interface TimelineMetricsResponse {
  group_by: 'month' | 'week';
  timeline: TimelineDataPoint[];
  totals: {
    leads: number;
    conversoes_a: number;
    conversoes_b_encadeadas: number;
    receita_total: number;
    receita_campanhas: number;
    receita_organico: number;
  };
}

export interface AttributionTreeItem {
  id: string;
  name: string;
  category: 'Campanhas Pagas' | 'Orgânico & SEO' | 'Vendas Diretas / WhatsApp' | 'Recompras / Upsell' | 'Outros';
  revenue: number;
  count: number;
  percentage_of_total: number;
  color: string;
  avg_ticket: number;
  sub_items?: Array<{
    name: string;
    revenue: number;
    count: number;
  }>;
}

export interface AttributionTreeResponse {
  total_revenue: number;
  direct_revenue: number;
  indirect_chained_revenue: number;
  campaign_revenue: number;
  tree_data: AttributionTreeItem[];
  ltv_uplift_percentage: number;
}

// -------------------------------------------------------------
// Instagram Organic Growth Types
// -------------------------------------------------------------
export interface InstagramGrowthLog {
  id: string;
  company_id?: string;
  date: string; // YYYY-MM-DD
  followers_count: number; // Total de seguidores
  new_followers: number; // Novos seguidores no período
  unfollows: number; // Deixaram de seguir
  net_followers_growth: number; // Crescimento líquido (Novos - Unfollows)
  profile_views: number; // Visitas ao perfil
  accounts_reached: number; // Contas alcançadas (Alcance orgânico)
  impressions: number; // Impressões totais
  link_clicks: number; // Cliques no link da bio / WhatsApp
  dms_received: number; // Mensagens diretas (DMs / Directs) recebidas
  posts_count: number; // Publicações no feed
  reels_count: number; // Reels postados
  stories_count: number; // Stories postados
  organic_leads_generated: number; // Leads orgânicos gerados via Instagram
  notes?: string; // Anotações sobre estratégia ou viralização
  created_at: string;
}

export interface InstagramMetricsSummary {
  total_followers_now: number;
  total_growth_period: number;
  growth_rate_pct: number;
  total_reach_period: number;
  total_profile_views: number;
  total_link_clicks: number;
  total_dms_received: number;
  total_organic_leads: number;
  avg_daily_reach: number;
  total_posts: number;
  total_reels: number;
  logs: InstagramGrowthLog[];
}

export interface ArrivalLevelMetricItem {
  level: ArrivalLevel;
  number: number;
  label: string;
  shortLabel: string;
  description: string;
  count: number;
  total_revenue: number;
  percentage_of_total: number;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export interface ArrivalLevelsResponse {
  total_contacts: number;
  total_revenue: number;
  levels: ArrivalLevelMetricItem[];
  conversion_to_main_product_rate: number; // % que chegou no Nível 3
  conversion_to_upsell_rate: number;       // % que chegou no Nível 4
  conversion_to_promoter_rate: number;     // % fidelizados (Nível 5)
}

export interface CampaignSummaryItem {
  campaign_name: string;
  channel: string;
  origin_type: OriginType;
  total_revenue: number;
  total_sales: number;
  leads_count: number;
  avg_ticket: number;
  products_sold: Array<{
    product_name: string;
    count: number;
    revenue: number;
  }>;
}

export interface AIPredictionResult {
  customer_id: string;
  customer_name: string;
  current_product: string;
  propensity_score_upsell_b: number; // 0 to 100
  propensity_score_referral: number; // 0 to 100
  recommended_action: string;
  reasoning: string;
  optimal_contact_window: string;
  projected_revenue_opportunity: number;
}

export interface Indication {
  id: string;
  referrer_id?: string;
  referrer_name: string;
  customer_id?: string;
  customer_name: string;
  sale_id?: string;
  date: string;
  status: 'indicated' | 'converted';
  amount?: number;
  notes?: string;
}

// -------------------------------------------------------------
// Controle Diário de Fluxo de Loja (Vendedora Chefe)
// -------------------------------------------------------------
export interface DailyStoreTraffic {
  id: string;
  company_id: string;
  company_name?: string;
  date: string; // YYYY-MM-DD
  recorded_by: string; // Nome da Vendedora Chefe / Gerente de Loja
  seller_id?: string;
  customers_arrived: number; // Total de clientes que chegaram no dia (Fluxo de loja / balcão)
  customers_attended: number; // Clientes atendidos / qualificados pela equipe
  sales_count: number; // Vendas fechadas no dia
  revenue: number; // Faturamento total gerado no dia (R$)
  conversion_rate: number; // (sales_count / customers_arrived) * 100
  avg_ticket: number; // revenue / sales_count
  traffic_sources: {
    paid_ads: number; // Chegaram por Anúncios (Instagram / Facebook / Google Ads)
    referral_word_of_mouth: number; // Indicação de amigos / Boca a boca
    walk_in_pedestrians: number; // Passantes / Vitrine / Fachada da loja
    return_customer: number; // Clientes recorrentes / Recompra
    other: number; // Outros
  };
  shift?: 'integral' | 'manha' | 'tarde' | 'noite';
  weather_or_event?: string; // Ex: 'Dia ensolarado', 'Chuva forte', 'Black Friday', 'Feriado'
  notes?: string; // Anotações do dia pela vendedora chefe
  created_at: string;
}

export interface DailyStoreTrafficSummary {
  total_customers_arrived: number;
  total_customers_attended: number;
  total_sales: number;
  total_revenue: number;
  overall_conversion_rate: number;
  overall_avg_ticket: number;
  avg_daily_customers: number;
  avg_daily_revenue: number;
  records_count: number;
  best_traffic_day?: {
    date: string;
    customers_arrived: number;
    sales_count: number;
    revenue: number;
  };
  sources_breakdown: {
    paid_ads: number;
    referral_word_of_mouth: number;
    walk_in_pedestrians: number;
    return_customer: number;
    other: number;
  };
  records: DailyStoreTraffic[];
}

