import {
  Company,
  Seller,
  SellerRankingItem,
  CustomerLead,
  Sale,
  Product,
  CustomerWithJourney,
  JourneyEvent,
  FunnelMetricsResponse,
  TimelineMetricsResponse,
  AttributionTreeResponse,
  TimelineDataPoint,
  OriginType,
  ArrivalLevel,
  ArrivalLevelsResponse,
  ArrivalLevelMetricItem,
  ARRIVAL_LEVELS,
  CampaignSummaryItem,
  InstagramGrowthLog,
  InstagramMetricsSummary
} from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-a',
    name: 'Produto Principal (Produto A)',
    type: 'PRODUTO_A',
    price: 1500,
    description: 'Venda primária do produto/serviço core'
  },
  {
    id: 'prod-b',
    name: 'Upsell / Recompra (Produto B)',
    type: 'PRODUTO_B',
    price: 2400,
    description: 'Venda encadeada/upgrade vinculada à venda anterior'
  },
  {
    id: 'serv-x',
    name: 'Serviço / Consultoria (Serviço X)',
    type: 'SERVICO_X',
    price: 3200,
    description: 'Serviço complementar de alto ticket'
  },
  {
    id: 'prod-c',
    name: 'Módulo Adicional (Produto C)',
    type: 'PRODUTO_C',
    price: 900,
    description: 'Item de entrada ou add-on rápido'
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'empresa-1',
    name: 'Clínica Odonto Prime',
    segment: 'Saúde & Estética Odontológica',
    logo_initials: 'OP',
    color: '#6366f1',
    monthly_goal: 60000,
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'empresa-2',
    name: 'Alpha E-commerce & Nutrição',
    segment: 'E-commerce, Varejo & Suplementos',
    logo_initials: 'AE',
    color: '#10b981',
    monthly_goal: 95000,
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'empresa-3',
    name: 'Nexus Tech & Consultoria B2B',
    segment: 'SaaS & Soluções Corporativas',
    logo_initials: 'NT',
    color: '#f59e0b',
    monthly_goal: 140000,
    created_at: '2025-01-01T00:00:00.000Z'
  }
];

export const INITIAL_SELLERS: Seller[] = [
  // Empresa 1 - Odonto Prime
  {
    id: 'seller-1-1',
    company_id: 'empresa-1',
    name: 'Camila Duarte',
    role: 'Closer VIP / Vendas Altas',
    email: 'camila@odontoprime.com.br',
    phone: '+55 11 98822-1100',
    avatar_color: '#ec4899',
    active: true,
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'seller-1-2',
    company_id: 'empresa-1',
    name: 'Bruno Rezende',
    role: 'SDR / Pré-vendas WhatsApp',
    email: 'bruno@odontoprime.com.br',
    phone: '+55 11 97733-2211',
    avatar_color: '#3b82f6',
    active: true,
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'seller-1-3',
    company_id: 'empresa-1',
    name: 'Juliana Castro',
    role: 'Consultora Comercial',
    email: 'juliana@odontoprime.com.br',
    phone: '+55 11 96644-3322',
    avatar_color: '#10b981',
    active: true,
    created_at: '2025-01-01T00:00:00.000Z'
  },

  // Empresa 2 - Alpha E-commerce
  {
    id: 'seller-2-1',
    company_id: 'empresa-2',
    name: 'Lucas Martins',
    role: 'Gerente Comercial',
    email: 'lucas@alphanutri.com.br',
    phone: '+55 21 99911-3344',
    avatar_color: '#10b981',
    active: true,
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'seller-2-2',
    company_id: 'empresa-2',
    name: 'Fernanda Lima',
    role: 'Especialista em Recompras',
    email: 'fernanda@alphanutri.com.br',
    phone: '+55 21 98822-4455',
    avatar_color: '#8b5cf6',
    active: true,
    created_at: '2025-01-01T00:00:00.000Z'
  },

  // Empresa 3 - Nexus Tech B2B
  {
    id: 'seller-3-1',
    company_id: 'empresa-3',
    name: 'Rodrigo Albuquerque',
    role: 'Executive Account Manager',
    email: 'rodrigo@nexustech.com.br',
    phone: '+55 11 97711-8899',
    avatar_color: '#f59e0b',
    active: true,
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'seller-3-2',
    company_id: 'empresa-3',
    name: 'Beatriz Vasconcelos',
    role: 'Consultora de Soluções B2B',
    email: 'beatriz@nexustech.com.br',
    phone: '+55 11 96600-7788',
    avatar_color: '#38bdf8',
    active: true,
    created_at: '2025-01-01T00:00:00.000Z'
  }
];

// Sample generation function for resetToSeed() if the user requests demo loading
function generateSeedData(): { leads: CustomerLead[]; sales: Sale[] } {
  const leads: CustomerLead[] = [
    {
      id: 'lead-1',
      company_id: 'empresa-1',
      name: 'Mariana Silva',
      email: 'mariana.silva@email.com',
      phone: '+55 11 98765-4321',
      created_at: '2025-01-10T14:30:00.000Z',
      channel: 'Meta Ads',
      origin_type: 'campanha',
      campaign_name: '[Meta] Implantes & Harmonização 2025',
      seller_id: 'seller-1-1',
      seller_name: 'Camila Duarte',
      status: 'customer_ab',
      arrival_level: 'nivel_5_fidelizado'
    },
    {
      id: 'lead-2',
      company_id: 'empresa-1',
      name: 'Carlos Eduardo Santos',
      email: 'carlos.santos@email.com',
      phone: '+55 11 97654-3210',
      created_at: '2025-01-15T09:15:00.000Z',
      channel: 'Google Ads',
      origin_type: 'campanha',
      campaign_name: '[Google] Odontologia Estética Fundo de Funil',
      seller_id: 'seller-1-2',
      seller_name: 'Bruno Rezende',
      status: 'customer_a',
      arrival_level: 'nivel_3_produto_a'
    },
    {
      id: 'lead-3',
      company_id: 'empresa-1',
      name: 'Renata Albuquerque',
      email: 'renata.albuquerque@email.com',
      phone: '+55 11 96543-2109',
      created_at: '2025-02-05T11:20:00.000Z',
      channel: 'Instagram Orgânico',
      origin_type: 'social',
      campaign_name: 'Instagram Stories / Direct',
      seller_id: 'seller-1-3',
      seller_name: 'Juliana Castro',
      status: 'customer_ab',
      arrival_level: 'nivel_4_upsell'
    },
    {
      id: 'lead-4',
      company_id: 'empresa-1',
      name: 'Gabriel Menezes',
      email: 'gabriel.menezes@email.com',
      phone: '+55 11 95432-1098',
      created_at: '2025-02-12T16:45:00.000Z',
      channel: 'Meta Ads',
      origin_type: 'campanha',
      campaign_name: '[Meta] Implantes & Harmonização 2025',
      seller_id: 'seller-1-1',
      seller_name: 'Camila Duarte',
      status: 'lead',
      arrival_level: 'nivel_2_negociacao'
    },
    {
      id: 'lead-5',
      company_id: 'empresa-1',
      name: 'Larissa Ferreira',
      email: 'larissa.f@email.com',
      phone: '+55 11 94321-0987',
      created_at: '2025-02-20T10:00:00.000Z',
      channel: 'Google Ads',
      origin_type: 'campanha',
      campaign_name: '[Google] Odontologia Estética Fundo de Funil',
      seller_id: 'seller-1-2',
      seller_name: 'Bruno Rezende',
      status: 'lead',
      arrival_level: 'nivel_1_lead'
    }
  ];

  const sales: Sale[] = [
    {
      id: 'sale-1',
      company_id: 'empresa-1',
      customer_id: 'lead-1',
      customer_name: 'Mariana Silva',
      product_id: 'prod-a',
      product_name: 'Produto Principal (Produto A)',
      product_type: 'PRODUTO_A',
      amount: 1500,
      sale_date: '2025-01-12T10:00:00.000Z',
      parent_sale_id: null,
      channel: 'Meta Ads',
      origin_type: 'campanha',
      campaign_name: '[Meta] Implantes & Harmonização 2025',
      seller_id: 'seller-1-1',
      seller_name: 'Camila Duarte',
      arrival_level: 'nivel_3_produto_a'
    },
    {
      id: 'sale-2',
      company_id: 'empresa-1',
      customer_id: 'lead-1',
      customer_name: 'Mariana Silva',
      product_id: 'prod-b',
      product_name: 'Upsell / Recompra (Produto B)',
      product_type: 'PRODUTO_B',
      amount: 2400,
      sale_date: '2025-01-25T15:30:00.000Z',
      parent_sale_id: 'sale-1',
      channel: 'Meta Ads',
      origin_type: 'campanha',
      campaign_name: '[Meta] Implantes & Harmonização 2025',
      seller_id: 'seller-1-1',
      seller_name: 'Camila Duarte',
      arrival_level: 'nivel_4_upsell'
    },
    {
      id: 'sale-3',
      company_id: 'empresa-1',
      customer_id: 'lead-2',
      customer_name: 'Carlos Eduardo Santos',
      product_id: 'prod-a',
      product_name: 'Produto Principal (Produto A)',
      product_type: 'PRODUTO_A',
      amount: 1500,
      sale_date: '2025-01-18T14:00:00.000Z',
      parent_sale_id: null,
      channel: 'Google Ads',
      origin_type: 'campanha',
      campaign_name: '[Google] Odontologia Estética Fundo de Funil',
      seller_id: 'seller-1-2',
      seller_name: 'Bruno Rezende',
      arrival_level: 'nivel_3_produto_a'
    },
    {
      id: 'sale-4',
      company_id: 'empresa-1',
      customer_id: 'lead-3',
      customer_name: 'Renata Albuquerque',
      product_id: 'prod-a',
      product_name: 'Produto Principal (Produto A)',
      product_type: 'PRODUTO_A',
      amount: 1500,
      sale_date: '2025-02-08T11:00:00.000Z',
      parent_sale_id: null,
      channel: 'Instagram Orgânico',
      origin_type: 'social',
      campaign_name: 'Instagram Stories / Direct',
      seller_id: 'seller-1-3',
      seller_name: 'Juliana Castro',
      arrival_level: 'nivel_3_produto_a'
    },
    {
      id: 'sale-5',
      company_id: 'empresa-1',
      customer_id: 'lead-3',
      customer_name: 'Renata Albuquerque',
      product_id: 'serv-x',
      product_name: 'Serviço / Consultoria (Serviço X)',
      product_type: 'SERVICO_X',
      amount: 3200,
      sale_date: '2025-02-22T17:15:00.000Z',
      parent_sale_id: 'sale-4',
      channel: 'Instagram Orgânico',
      origin_type: 'social',
      campaign_name: 'Instagram Stories / Direct',
      seller_id: 'seller-1-3',
      seller_name: 'Juliana Castro',
      arrival_level: 'nivel_4_upsell'
    }
  ];

  return { leads, sales };
}

export class AttributionDatabase {
  private companies: Company[] = [...INITIAL_COMPANIES];
  private sellers: Seller[] = [...INITIAL_SELLERS];
  private leads: CustomerLead[] = [];
  private sales: Sale[] = [];
  private instagramLogs: InstagramGrowthLog[] = [];

  constructor() {
    // Starts completely empty as requested ("zere todos os dados para começarem do nada")
    this.leads = [];
    this.sales = [];
    this.instagramLogs = [];
  }

  public resetToEmpty() {
    this.leads = [];
    this.sales = [];
    this.instagramLogs = [];
  }

  public resetToSeed() {
    this.companies = [...INITIAL_COMPANIES];
    this.sellers = [...INITIAL_SELLERS];
    const seed = generateSeedData();
    this.leads = seed.leads;
    this.sales = seed.sales;
    this.instagramLogs = [];
  }

  // =============================================================
  // COMPANIES CRUD
  // =============================================================
  public getCompanies(): Company[] {
    return [...this.companies];
  }

  public getCompany(id: string): Company | null {
    return this.companies.find(c => c.id === id) || null;
  }

  public addCompany(data: Omit<Company, 'id' | 'created_at'>): Company {
    const initials = data.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'EM';
    const newCompany: Company = {
      ...data,
      id: `empresa-${Date.now()}`,
      logo_initials: data.logo_initials || initials,
      color: data.color || '#6366f1',
      monthly_goal: Number(data.monthly_goal) || 50000,
      created_at: new Date().toISOString()
    };
    this.companies.push(newCompany);

    // Add a default seller for this company
    this.addSeller({
      company_id: newCompany.id,
      name: `Consultor Principal (${newCompany.name.split(' ')[0]})`,
      role: 'Consultor Comercial',
      active: true
    });

    return newCompany;
  }

  public updateCompany(id: string, data: Partial<Company>): Company | null {
    const idx = this.companies.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.companies[idx] = { ...this.companies[idx], ...data };
    return this.companies[idx];
  }

  public deleteCompany(id: string): boolean {
    const idx = this.companies.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.companies.splice(idx, 1);
    this.sellers = this.sellers.filter(s => s.company_id !== id);
    this.leads = this.leads.filter(l => l.company_id !== id);
    this.sales = this.sales.filter(s => s.company_id !== id);
    this.instagramLogs = this.instagramLogs.filter(log => log.company_id !== id);
    return true;
  }

  // =============================================================
  // SELLERS CRUD & RANKING
  // =============================================================
  public getSellers(companyId?: string): Seller[] {
    if (!companyId || companyId === 'all') {
      return [...this.sellers];
    }
    return this.sellers.filter(s => s.company_id === companyId);
  }

  public getSeller(id: string): Seller | null {
    return this.sellers.find(s => s.id === id) || null;
  }

  public addSeller(data: Omit<Seller, 'id' | 'created_at'>): Seller {
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#38bdf8'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newSeller: Seller = {
      ...data,
      id: `seller-${Date.now()}`,
      avatar_color: data.avatar_color || randomColor,
      active: data.active !== undefined ? data.active : true,
      created_at: new Date().toISOString()
    };
    this.sellers.push(newSeller);
    return newSeller;
  }

  public updateSeller(id: string, data: Partial<Seller>): Seller | null {
    const idx = this.sellers.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.sellers[idx] = { ...this.sellers[idx], ...data };
    return this.sellers[idx];
  }

  public deleteSeller(id: string): boolean {
    const idx = this.sellers.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.sellers.splice(idx, 1);
    return true;
  }

  public getSellersRanking(companyId?: string, startDate?: string, endDate?: string): SellerRankingItem[] {
    const sellersList = this.getSellers(companyId);
    const filteredSales = this.filterByCompanyAndDate(this.sales, companyId, startDate, endDate, 'sale_date');
    const filteredLeads = this.filterByCompanyAndDate(this.leads, companyId, startDate, endDate, 'created_at');

    return sellersList.map(seller => {
      // 1. Leads attended by this seller
      const leadsAttended = filteredLeads.filter(l => l.seller_id === seller.id || l.seller_name === seller.name).length;
      
      // 2. Sales closed by this seller
      const sellerSales = filteredSales.filter(s => s.seller_id === seller.id || s.seller_name === seller.name);
      const salesClosed = sellerSales.length;

      // Effective leads attended is at least the sales closed count
      const effectiveLeadsAttended = Math.max(leadsAttended, salesClosed);

      // 3. Conversion rate: (sales / leads) * 100
      const conversionRate = effectiveLeadsAttended > 0 
        ? Number(((salesClosed / effectiveLeadsAttended) * 100).toFixed(1))
        : 0;

      // 4. Total revenue
      const totalRevenue = sellerSales.reduce((acc, s) => acc + s.amount, 0);

      // 5. Avg ticket
      const avgTicket = salesClosed > 0 ? Number((totalRevenue / salesClosed).toFixed(2)) : 0;

      return {
        seller_id: seller.id,
        seller_name: seller.name,
        seller_role: seller.role || 'Consultor Comercial',
        avatar_color: seller.avatar_color,
        leads_attended: effectiveLeadsAttended,
        sales_closed: salesClosed,
        conversion_rate: conversionRate,
        total_revenue: totalRevenue,
        avg_ticket: avgTicket
      };
    }).sort((a, b) => {
      if (b.sales_closed !== a.sales_closed) {
        return b.sales_closed - a.sales_closed;
      }
      return b.total_revenue - a.total_revenue;
    });
  }

  // =============================================================
  // LEADS & SALES ACCESSORS
  // =============================================================
  public getLeads(companyId?: string): CustomerLead[] {
    if (!companyId || companyId === 'all') {
      return [...this.leads];
    }
    return this.leads.filter(l => !l.company_id || l.company_id === companyId);
  }

  public getSales(companyId?: string): Sale[] {
    if (!companyId || companyId === 'all') {
      return [...this.sales];
    }
    return this.sales.filter(s => !s.company_id || s.company_id === companyId);
  }

  public addLead(lead: CustomerLead): CustomerLead {
    this.leads.unshift(lead);
    return lead;
  }

  public addSale(sale: Sale): Sale {
    this.sales.unshift(sale);
    return sale;
  }

  public updateSale(id: string, updates: Partial<Sale>): Sale | null {
    const index = this.sales.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.sales[index] = { ...this.sales[index], ...updates };
    return this.sales[index];
  }

  public updateArrivalLevel(id: string, level: ArrivalLevel): boolean {
    const saleIndex = this.sales.findIndex(s => s.id === id);
    if (saleIndex !== -1) {
      this.sales[saleIndex].arrival_level = level;
      return true;
    }
    const leadIndex = this.leads.findIndex(l => l.id === id);
    if (leadIndex !== -1) {
      this.leads[leadIndex].arrival_level = level;
      return true;
    }
    return false;
  }

  public deleteSale(id: string): boolean {
    const initialLength = this.sales.length;
    this.sales = this.sales.filter(s => s.id !== id);
    return this.sales.length < initialLength;
  }

  public deleteLead(id: string): boolean {
    const initialLength = this.leads.length;
    this.leads = this.leads.filter(l => l.id !== id);
    this.sales = this.sales.filter(s => s.customer_id !== id);
    return this.leads.length < initialLength;
  }

  // Quick sale/lead entry
  public addQuickSale(data: {
    company_id?: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    channel: string;
    origin_type: OriginType;
    campaign_name?: string;
    referrer_name?: string;
    seller_id?: string;
    seller_name?: string;
    product_name: string;
    product_type: any;
    amount: number;
    sale_date: string;
    parent_sale_id?: string | null;
    arrival_level?: ArrivalLevel;
    notes?: string;
  }): { lead: CustomerLead; sale?: Sale } {
    let lead = this.leads.find(
      l => l.name.toLowerCase() === data.customer_name.toLowerCase() && (!data.company_id || l.company_id === data.company_id)
    );

    const targetCompanyId = data.company_id || this.companies[0]?.id || 'empresa-1';

    let sellerName = data.seller_name;
    if (data.seller_id && !sellerName) {
      const s = this.getSeller(data.seller_id);
      if (s) sellerName = s.name;
    }

    if (!lead) {
      lead = {
        id: `lead-${Date.now()}`,
        company_id: targetCompanyId,
        name: data.customer_name,
        email: data.customer_email || `${data.customer_name.toLowerCase().replace(/\s+/g, '.')}@cliente.com`,
        phone: data.customer_phone || '+55 11 98888-0000',
        created_at: data.sale_date || new Date().toISOString(),
        channel: data.channel,
        origin_type: data.origin_type,
        campaign_name: data.campaign_name,
        seller_id: data.seller_id || null,
        seller_name: sellerName || null,
        status: data.amount > 0 ? (data.parent_sale_id ? 'customer_ab' : 'customer_a') : 'lead',
        arrival_level: data.arrival_level || (data.amount > 0 ? (data.parent_sale_id ? 'nivel_4_upsell' : 'nivel_3_produto_a') : 'nivel_1_lead'),
        notes: data.notes
      };
      this.leads.unshift(lead);
    } else {
      if (data.seller_id) {
        lead.seller_id = data.seller_id;
        lead.seller_name = sellerName || lead.seller_name;
      }
      if (data.arrival_level) {
        lead.arrival_level = data.arrival_level;
      }
    }

    let newSale: Sale | undefined;
    if (data.amount > 0) {
      newSale = {
        id: `sale-${Date.now()}`,
        company_id: targetCompanyId,
        customer_id: lead.id,
        customer_name: lead.name,
        product_id: `prod-${Date.now()}`,
        product_name: data.product_name,
        product_type: data.product_type || 'PRODUTO_A',
        amount: Number(data.amount),
        sale_date: data.sale_date || new Date().toISOString(),
        parent_sale_id: data.parent_sale_id || null,
        channel: data.channel,
        origin_type: data.origin_type,
        campaign_name: data.campaign_name,
        seller_id: data.seller_id || lead.seller_id || null,
        seller_name: sellerName || lead.seller_name || null,
        arrival_level: data.arrival_level || 'nivel_3_produto_a',
        notes: data.notes
      };
      this.sales.unshift(newSale);
    }

    return { lead, sale: newSale };
  }

  // =============================================================
  // INSTAGRAM GROWTH LOGS CRUD
  // =============================================================
  public getInstagramLogs(startDate?: string, endDate?: string, companyId?: string): InstagramGrowthLog[] {
    return this.filterByCompanyAndDate(this.instagramLogs, companyId, startDate, endDate, 'date');
  }

  public addInstagramLog(data: Omit<InstagramGrowthLog, 'id' | 'created_at' | 'net_followers_growth'>): InstagramGrowthLog {
    const netGrowth = Number(data.new_followers || 0) - Number(data.unfollows || 0);
    const newLog: InstagramGrowthLog = {
      ...data,
      id: `insta-log-${Date.now()}`,
      company_id: data.company_id || 'empresa-1',
      net_followers_growth: netGrowth,
      created_at: new Date().toISOString()
    };
    this.instagramLogs.unshift(newLog);
    return newLog;
  }

  public updateInstagramLog(id: string, updates: Partial<InstagramGrowthLog>): InstagramGrowthLog | null {
    const idx = this.instagramLogs.findIndex(l => l.id === id);
    if (idx === -1) return null;
    const current = this.instagramLogs[idx];
    const updated = { ...current, ...updates };
    if (updates.new_followers !== undefined || updates.unfollows !== undefined) {
      updated.net_followers_growth = Number(updated.new_followers || 0) - Number(updated.unfollows || 0);
    }
    this.instagramLogs[idx] = updated;
    return updated;
  }

  public deleteInstagramLog(id: string): boolean {
    const initialLen = this.instagramLogs.length;
    this.instagramLogs = this.instagramLogs.filter(l => l.id !== id);
    return this.instagramLogs.length < initialLen;
  }

  public getInstagramMetricsSummary(startDate?: string, endDate?: string, companyId?: string): InstagramMetricsSummary {
    const filtered = this.getInstagramLogs(startDate, endDate, companyId);
    if (filtered.length === 0) {
      return {
        total_followers_now: 0,
        total_growth_period: 0,
        growth_rate_pct: 0,
        total_reach_period: 0,
        total_profile_views: 0,
        total_link_clicks: 0,
        total_dms_received: 0,
        total_organic_leads: 0,
        avg_daily_reach: 0,
        total_posts: 0,
        total_reels: 0,
        logs: []
      };
    }

    const sortedByDateAsc = [...filtered].sort((a, b) => a.date.localeCompare(b.date));
    const latestLog = sortedByDateAsc[sortedByDateAsc.length - 1];
    const firstLog = sortedByDateAsc[0];

    const totalFollowersNow = latestLog.followers_count;
    const initialFollowers = firstLog.followers_count - firstLog.net_followers_growth;
    const totalGrowthPeriod = filtered.reduce((acc, l) => acc + l.net_followers_growth, 0);
    const growthRatePct = initialFollowers > 0 ? Number(((totalGrowthPeriod / initialFollowers) * 100).toFixed(1)) : 0;

    const totalReach = filtered.reduce((acc, l) => acc + l.accounts_reached, 0);
    const totalProfileViews = filtered.reduce((acc, l) => acc + l.profile_views, 0);
    const totalLinkClicks = filtered.reduce((acc, l) => acc + l.link_clicks, 0);
    const totalDms = filtered.reduce((acc, l) => acc + l.dms_received, 0);
    const totalOrganicLeads = filtered.reduce((acc, l) => acc + l.organic_leads_generated, 0);
    const totalPosts = filtered.reduce((acc, l) => acc + l.posts_count, 0);
    const totalReels = filtered.reduce((acc, l) => acc + l.reels_count, 0);
    const avgDailyReach = filtered.length > 0 ? Math.round(totalReach / filtered.length) : 0;

    return {
      total_followers_now: totalFollowersNow,
      total_growth_period: totalGrowthPeriod,
      growth_rate_pct: growthRatePct,
      total_reach_period: totalReach,
      total_profile_views: totalProfileViews,
      total_link_clicks: totalLinkClicks,
      total_dms_received: totalDms,
      total_organic_leads: totalOrganicLeads,
      avg_daily_reach: avgDailyReach,
      total_posts: totalPosts,
      total_reels: totalReels,
      logs: sortedByDateAsc
    };
  }

  // =============================================================
  // METRICS & ANALYSIS WITH COMPANY FILTER
  // =============================================================
  private filterByCompanyAndDate<T>(
    items: T[], 
    companyId?: string, 
    startDate?: string, 
    endDate?: string, 
    dateField: string = 'date'
  ): T[] {
    let result = items;
    if (companyId && companyId !== 'all') {
      result = result.filter(item => {
        const itemComp = (item as any).company_id;
        return !itemComp || itemComp === companyId;
      });
    }
    if (startDate) {
      result = result.filter(item => {
        const d = (item as any)[dateField];
        return d && d >= startDate;
      });
    }
    if (endDate) {
      result = result.filter(item => {
        const d = (item as any)[dateField];
        return d && d <= (endDate.includes('T') ? endDate : `${endDate}T23:59:59.999Z`);
      });
    }
    return result;
  }

  // 1. Conversion Funnel Metrics
  public getConversionFunnelMetrics(
    startDate?: string, 
    endDate?: string, 
    product?: string, 
    companyId?: string
  ): FunnelMetricsResponse {
    let filteredLeads = this.filterByCompanyAndDate(this.leads, companyId, startDate, endDate, 'created_at');
    let filteredSales = this.filterByCompanyAndDate(this.sales, companyId, startDate, endDate, 'sale_date');

    const totalLeads = filteredLeads.length || filteredSales.length;
    const convertedToA = filteredSales.filter(s => !s.parent_sale_id).length;
    const convertedToB = filteredSales.filter(s => s.parent_sale_id !== null).length;

    const conversionRateA = totalLeads > 0 ? Number(((convertedToA / totalLeads) * 100).toFixed(1)) : 0;
    const chainedUpsellRateB = convertedToA > 0 ? Number(((convertedToB / convertedToA) * 100).toFixed(1)) : 0;

    const campaignRevenue = filteredSales.filter(s => s.origin_type === 'campanha' || s.channel.toLowerCase().includes('ads')).reduce((sum, s) => sum + s.amount, 0);
    const organicRevenue = filteredSales.filter(s => s.origin_type === 'organico' || s.origin_type === 'social').reduce((sum, s) => sum + s.amount, 0);
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.amount, 0);

    return {
      period: { start: startDate || '2025-01-01', end: endDate || '2026-12-31' },
      summary: {
        total_leads: totalLeads,
        converted_to_A: convertedToA,
        conversion_rate_A: conversionRateA,
        converted_to_B_from_A: convertedToB,
        chained_upsell_rate_B: chainedUpsellRateB,
        total_revenue: totalRevenue,
        campaign_revenue: campaignRevenue,
        organic_revenue: organicRevenue
      },
      sankey_nodes: [
        { id: 'leads', name: '1. Leads (Tráfego Pago & Orgânico)', category: 'acquisition', value: totalLeads, color: '#6366F1' },
        { id: 'drop_lead', name: 'Leads Não Convertidos', category: 'drop', value: Math.max(0, totalLeads - convertedToA), color: '#4B5563' },
        { id: 'prod_a', name: '2. Venda Produto A (Principal)', category: 'conversion', value: convertedToA, color: '#10B981' },
        { id: 'drop_a', name: 'Apenas Produto A (Sem Recompra)', category: 'drop', value: Math.max(0, convertedToA - convertedToB), color: '#6B7280' },
        { id: 'prod_b', name: '3. Upsell / Recompra B', category: 'upsell', value: convertedToB, color: '#8B5CF6' }
      ],
      sankey_links: [
        { source: 'leads', target: 'prod_a', value: convertedToA, label: 'Conversão Produto A', rate: `${conversionRateA}%` },
        { source: 'leads', target: 'drop_lead', value: Math.max(0, totalLeads - convertedToA), label: 'Perda Funil 1' },
        { source: 'prod_a', target: 'prod_b', value: convertedToB, label: 'Upsell / Recompra', rate: `${chainedUpsellRateB}%` },
        { source: 'prod_a', target: 'drop_a', value: Math.max(0, convertedToA - convertedToB), label: 'Sem Recompra' }
      ]
    };
  }

  // 2. Timeline Metrics
  public getTimelineMetrics(
    groupBy: 'month' | 'week' = 'month', 
    startDate?: string, 
    endDate?: string, 
    companyId?: string
  ): TimelineMetricsResponse {
    const filteredSales = this.filterByCompanyAndDate(this.sales, companyId, startDate, endDate, 'sale_date');
    const filteredLeads = this.filterByCompanyAndDate(this.leads, companyId, startDate, endDate, 'created_at');

    const periodsMap = new Map<string, TimelineDataPoint>();

    const getPeriodKey = (isoDate: string) => {
      const d = new Date(isoDate);
      if (groupBy === 'week') {
        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
        const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        return `${d.getFullYear()}-W${weekNum < 10 ? '0' + weekNum : weekNum}`;
      }
      const month = d.getMonth() + 1;
      return `${d.getFullYear()}-${month < 10 ? '0' + month : month}`;
    };

    filteredLeads.forEach(lead => {
      const key = getPeriodKey(lead.created_at);
      if (!periodsMap.has(key)) {
        periodsMap.set(key, {
          period: key,
          formatted_period: key,
          leads_entrantes: 0,
          conversoes_produto_a: 0,
          conversoes_produto_b_encadeadas: 0,
          receita_total: 0,
          receita_campanhas: 0,
          receita_organico: 0,
          taxa_conversao_a: 0,
          taxa_upsell_b: 0
        });
      }
      periodsMap.get(key)!.leads_entrantes += 1;
    });

    filteredSales.forEach(sale => {
      const key = getPeriodKey(sale.sale_date);
      if (!periodsMap.has(key)) {
        periodsMap.set(key, {
          period: key,
          formatted_period: key,
          leads_entrantes: 0,
          conversoes_produto_a: 0,
          conversoes_produto_b_encadeadas: 0,
          receita_total: 0,
          receita_campanhas: 0,
          receita_organico: 0,
          taxa_conversao_a: 0,
          taxa_upsell_b: 0
        });
      }
      const pt = periodsMap.get(key)!;
      pt.receita_total += sale.amount;

      if (!sale.parent_sale_id) {
        pt.conversoes_produto_a += 1;
      } else {
        pt.conversoes_produto_b_encadeadas += 1;
      }

      if (sale.origin_type === 'campanha' || sale.channel.toLowerCase().includes('ads')) {
        pt.receita_campanhas += sale.amount;
      } else {
        pt.receita_organico += sale.amount;
      }
    });

    const sortedTimeline = Array.from(periodsMap.values()).sort((a, b) => a.period.localeCompare(b.period));

    sortedTimeline.forEach(pt => {
      pt.taxa_conversao_a = pt.leads_entrantes > 0 ? Number(((pt.conversoes_produto_a / pt.leads_entrantes) * 100).toFixed(1)) : 0;
      pt.taxa_upsell_b = pt.conversoes_produto_a > 0 ? Number(((pt.conversoes_produto_b_encadeadas / pt.conversoes_produto_a) * 100).toFixed(1)) : 0;
    });

    const totals = {
      leads: filteredLeads.length,
      conversoes_a: filteredSales.filter(s => !s.parent_sale_id).length,
      conversoes_b_encadeadas: filteredSales.filter(s => s.parent_sale_id !== null).length,
      receita_total: filteredSales.reduce((sum, s) => sum + s.amount, 0),
      receita_campanhas: filteredSales.filter(s => s.origin_type === 'campanha' || s.channel.toLowerCase().includes('ads')).reduce((sum, s) => sum + s.amount, 0),
      receita_organico: filteredSales.filter(s => s.origin_type !== 'campanha' && !s.channel.toLowerCase().includes('ads')).reduce((sum, s) => sum + s.amount, 0)
    };

    return {
      group_by: groupBy,
      timeline: sortedTimeline,
      totals
    };
  }

  // 3. Attribution Tree Metrics
  public getAttributionTreeMetrics(startDate?: string, endDate?: string, companyId?: string): AttributionTreeResponse {
    const filteredSales = this.filterByCompanyAndDate(this.sales, companyId, startDate, endDate, 'sale_date');

    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.amount, 0) || 1;
    const directSales = filteredSales.filter(s => !s.parent_sale_id);
    const chainedSales = filteredSales.filter(s => s.parent_sale_id !== null);

    const directRevenue = directSales.reduce((sum, s) => sum + s.amount, 0);
    const chainedRevenue = chainedSales.reduce((sum, s) => sum + s.amount, 0);

    const campaignSales = filteredSales.filter(s => s.origin_type === 'campanha' || s.channel.toLowerCase().includes('ads'));
    const campaignRevenue = campaignSales.reduce((sum, s) => sum + s.amount, 0);

    const organicSales = filteredSales.filter(s => s.origin_type === 'organico' || s.origin_type === 'social');
    const organicRevenue = organicSales.reduce((sum, s) => sum + s.amount, 0);

    const directChannelSales = filteredSales.filter(s => s.origin_type === 'direto' || s.channel.toLowerCase().includes('whatsapp'));
    const directChannelRevenue = directChannelSales.reduce((sum, s) => sum + s.amount, 0);

    const tree_data = [
      {
        id: 'campanhas',
        name: 'Campanhas Pagas (Meta & Google Ads)',
        category: 'Campanhas Pagas' as const,
        revenue: campaignRevenue,
        count: campaignSales.length,
        percentage_of_total: Number(((campaignRevenue / totalRevenue) * 100).toFixed(1)),
        color: '#6366f1',
        avg_ticket: campaignSales.length > 0 ? Math.round(campaignRevenue / campaignSales.length) : 0,
        sub_items: [
          { name: 'Google Ads', revenue: campaignSales.filter(s => s.channel.includes('Google')).reduce((sum, s) => sum + s.amount, 0), count: campaignSales.filter(s => s.channel.includes('Google')).length },
          { name: 'Meta Ads (Insta/Face)', revenue: campaignSales.filter(s => s.channel.includes('Meta')).reduce((sum, s) => sum + s.amount, 0), count: campaignSales.filter(s => s.channel.includes('Meta')).length }
        ]
      },
      {
        id: 'upsells',
        name: 'Recompras / Upsells (Produto B / Consultorias)',
        category: 'Recompras / Upsell' as const,
        revenue: chainedRevenue,
        count: chainedSales.length,
        percentage_of_total: Number(((chainedRevenue / totalRevenue) * 100).toFixed(1)),
        color: '#8b5cf6',
        avg_ticket: chainedSales.length > 0 ? Math.round(chainedRevenue / chainedSales.length) : 0
      },
      {
        id: 'organico',
        name: 'Tráfego Orgânico & Redes Sociais',
        category: 'Orgânico & SEO' as const,
        revenue: organicRevenue,
        count: organicSales.length,
        percentage_of_total: Number(((organicRevenue / totalRevenue) * 100).toFixed(1)),
        color: '#10b981',
        avg_ticket: organicSales.length > 0 ? Math.round(organicRevenue / organicSales.length) : 0
      },
      {
        id: 'direto',
        name: 'Vendas Diretas & WhatsApp',
        category: 'Vendas Diretas / WhatsApp' as const,
        revenue: directChannelRevenue,
        count: directChannelSales.length,
        percentage_of_total: Number(((directChannelRevenue / totalRevenue) * 100).toFixed(1)),
        color: '#f59e0b',
        avg_ticket: directChannelSales.length > 0 ? Math.round(directChannelRevenue / directChannelSales.length) : 0
      }
    ];

    const ltvUplift = directRevenue > 0 ? Number(((chainedRevenue / directRevenue) * 100).toFixed(1)) : 0;

    return {
      total_revenue: totalRevenue,
      direct_revenue: directRevenue,
      indirect_chained_revenue: chainedRevenue,
      campaign_revenue: campaignRevenue,
      tree_data,
      ltv_uplift_percentage: ltvUplift
    };
  }

  // 4. Arrival Levels Metrics (Nível 1 a Nível 5)
  public getArrivalLevelsMetrics(startDate?: string, endDate?: string, companyId?: string): ArrivalLevelsResponse {
    const filteredLeads = this.filterByCompanyAndDate(this.leads, companyId, startDate, endDate, 'created_at');
    const filteredSales = this.filterByCompanyAndDate(this.sales, companyId, startDate, endDate, 'sale_date');

    const totalContacts = filteredLeads.length || filteredSales.length;
    const totalRevenue = filteredSales.reduce((acc, s) => acc + s.amount, 0);

    const levelCounts: Record<ArrivalLevel, { count: number; revenue: number }> = {
      nivel_1_lead: { count: 0, revenue: 0 },
      nivel_2_negociacao: { count: 0, revenue: 0 },
      nivel_3_produto_a: { count: 0, revenue: 0 },
      nivel_4_upsell: { count: 0, revenue: 0 },
      nivel_5_fidelizado: { count: 0, revenue: 0 }
    };

    filteredLeads.forEach(lead => {
      const lvl = (lead.arrival_level as ArrivalLevel) || 'nivel_1_lead';
      if (levelCounts[lvl]) {
        levelCounts[lvl].count += 1;
      } else {
        levelCounts.nivel_1_lead.count += 1;
      }
    });

    filteredSales.forEach(sale => {
      const lvl = (sale.arrival_level as ArrivalLevel) || 'nivel_3_produto_a';
      if (levelCounts[lvl]) {
        levelCounts[lvl].revenue += sale.amount;
      } else {
        levelCounts.nivel_3_produto_a.revenue += sale.amount;
      }
    });

    const levelKeys: ArrivalLevel[] = ['nivel_1_lead', 'nivel_2_negociacao', 'nivel_3_produto_a', 'nivel_4_upsell', 'nivel_5_fidelizado'];

    const levels: ArrivalLevelMetricItem[] = levelKeys.map(key => {
      const info = ARRIVAL_LEVELS[key];
      const data = levelCounts[key];
      const pct = totalContacts > 0 ? Number(((data.count / totalContacts) * 100).toFixed(1)) : 0;

      return {
        level: key,
        number: info.number,
        label: info.label,
        shortLabel: info.shortLabel,
        description: info.description,
        count: data.count,
        total_revenue: data.revenue,
        percentage_of_total: pct,
        color: info.color,
        badgeBg: info.badgeBg,
        badgeBorder: info.badgeBorder,
        badgeText: info.badgeText
      };
    });

    const convertedToMain = levelCounts.nivel_3_produto_a.count + levelCounts.nivel_4_upsell.count + levelCounts.nivel_5_fidelizado.count;
    const conversionToMainRate = totalContacts > 0 ? Number(((convertedToMain / totalContacts) * 100).toFixed(1)) : 0;
    const conversionToUpsellRate = convertedToMain > 0 ? Number(((levelCounts.nivel_4_upsell.count / convertedToMain) * 100).toFixed(1)) : 0;
    const conversionToPromoterRate = convertedToMain > 0 ? Number(((levelCounts.nivel_5_fidelizado.count / convertedToMain) * 100).toFixed(1)) : 0;

    return {
      total_contacts: totalContacts,
      total_revenue: totalRevenue,
      levels,
      conversion_to_main_product_rate: conversionToMainRate,
      conversion_to_upsell_rate: conversionToUpsellRate,
      conversion_to_promoter_rate: conversionToPromoterRate
    };
  }

  // 5. Campaigns Summary
  public getCampaignsSummary(startDate?: string, endDate?: string, companyId?: string): CampaignSummaryItem[] {
    const filteredSales = this.filterByCompanyAndDate(this.sales, companyId, startDate, endDate, 'sale_date');
    const filteredLeads = this.filterByCompanyAndDate(this.leads, companyId, startDate, endDate, 'created_at');

    const campaignsMap = new Map<string, {
      campaign_name: string;
      channel: string;
      origin_type: OriginType;
      total_revenue: number;
      total_sales: number;
      leads_count: number;
      products_sold: Record<string, { count: number; revenue: number }>;
    }>();

    filteredLeads.forEach(lead => {
      const campName = lead.campaign_name || lead.channel || 'Canal Geral';
      if (!campaignsMap.has(campName)) {
        campaignsMap.set(campName, {
          campaign_name: campName,
          channel: lead.channel || 'Geral',
          origin_type: lead.origin_type || 'campanha',
          total_revenue: 0,
          total_sales: 0,
          leads_count: 0,
          products_sold: {}
        });
      }
      campaignsMap.get(campName)!.leads_count += 1;
    });

    filteredSales.forEach(sale => {
      const campName = sale.campaign_name || sale.channel || 'Canal Geral';
      if (!campaignsMap.has(campName)) {
        campaignsMap.set(campName, {
          campaign_name: campName,
          channel: sale.channel || 'Geral',
          origin_type: sale.origin_type || 'campanha',
          total_revenue: 0,
          total_sales: 0,
          leads_count: 0,
          products_sold: {}
        });
      }
      const item = campaignsMap.get(campName)!;
      item.total_revenue += sale.amount;
      item.total_sales += 1;

      if (!item.products_sold[sale.product_name]) {
        item.products_sold[sale.product_name] = { count: 0, revenue: 0 };
      }
      item.products_sold[sale.product_name].count += 1;
      item.products_sold[sale.product_name].revenue += sale.amount;
    });

    return Array.from(campaignsMap.values())
      .map(item => {
        const avgTicket = item.total_sales > 0 ? Number((item.total_revenue / item.total_sales).toFixed(2)) : 0;
        return {
          campaign_name: item.campaign_name,
          channel: item.channel,
          origin_type: item.origin_type,
          total_revenue: item.total_revenue,
          total_sales: item.total_sales,
          leads_count: item.leads_count,
          avg_ticket: avgTicket,
          products_sold: Object.entries(item.products_sold).map(([name, stat]) => ({
            product_name: name,
            count: stat.count,
            revenue: stat.revenue
          }))
        };
      })
      .sort((a, b) => b.total_revenue - a.total_revenue);
  }

  // 6. Customer Journey
  public getCustomerJourney(customerId: string): CustomerWithJourney | null {
    const customer = this.leads.find(l => l.id === customerId);
    if (!customer) return null;

    const customerSales = this.sales.filter(s => s.customer_id === customerId);

    const events: JourneyEvent[] = [];

    events.push({
      id: `ev-lead-${customer.id}`,
      date: customer.created_at,
      type: 'LEAD_CREATED',
      title: `Entrada via ${customer.channel}`,
      description: `Lead registrado com origem ${customer.channel} ${customer.campaign_name ? `(Campanha: ${customer.campaign_name})` : ''}.`,
      metadata: {
        campaign_name: customer.campaign_name,
        channel: customer.channel
      }
    });

    customerSales.forEach(sale => {
      if (!sale.parent_sale_id) {
        events.push({
          id: `ev-sale-${sale.id}`,
          date: sale.sale_date,
          type: 'PRIMARY_SALE',
          title: `Venda: ${sale.product_name}`,
          description: `Venda no valor de R$ ${sale.amount.toLocaleString('pt-BR')} via ${sale.channel}${sale.seller_name ? ` (Atendido por ${sale.seller_name})` : ''}.`,
          amount: sale.amount,
          metadata: {
            product_type: sale.product_type,
            parent_sale_id: null,
            channel: sale.channel,
            campaign_name: sale.campaign_name
          }
        });
      } else {
        events.push({
          id: `ev-sale-${sale.id}`,
          date: sale.sale_date,
          type: 'CHAINED_SALE',
          title: `Upsell / Recompra: ${sale.product_name}`,
          description: `Recompra no valor de R$ ${sale.amount.toLocaleString('pt-BR')}.`,
          amount: sale.amount,
          metadata: {
            product_type: sale.product_type,
            parent_sale_id: sale.parent_sale_id
          }
        });
      }
    });

    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const directSpend = customerSales.filter(s => !s.parent_sale_id).reduce((sum, s) => sum + s.amount, 0);
    const chainedSpend = customerSales.filter(s => s.parent_sale_id).reduce((sum, s) => sum + s.amount, 0);

    return {
      ...customer,
      sales: customerSales,
      journey_events: events,
      total_direct_spend: directSpend,
      total_chained_spend: chainedSpend,
      total_customer_value: directSpend + chainedSpend
    };
  }
}

export const db = new AttributionDatabase();
