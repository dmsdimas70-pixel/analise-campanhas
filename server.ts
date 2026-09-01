import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { db, PRODUCTS } from './src/data/mockDatabase';
import { SQL_DDL_SCRIPT, MATERIALIZED_VIEW_SQL, MOBILE_TECH_COMPARISON, PERFORMANCE_STRATEGY } from './src/data/technicalDocs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==========================================
  // 1. REST API ENDPOINTS
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'attribution-sales-origin-bi', timestamp: new Date().toISOString() });
  });

  // 1.0 Reset Data (Zerar para começar do zero ou carregar demo)
  app.post('/api/reset-data', (req, res) => {
    try {
      const { mode = 'empty' } = req.body;
      if (mode === 'seed') {
        db.resetToSeed();
      } else {
        db.resetToEmpty();
      }
      res.json({
        success: true,
        mode,
        message: mode === 'empty' ? 'Dados zerados com sucesso. Começando do 0!' : 'Dados de exemplo carregados!',
        counts: {
          companies: db.getCompanies().length,
          sellers: db.getSellers().length,
          leads: db.getLeads().length,
          sales: db.getSales().length,
          indications: db.getIndications().length
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao resetar dados', details: err.message });
    }
  });

  // ==========================================
  // 1.1 EMPRESAS (MULTI-COMPANY / MULTI-TENANT)
  // ==========================================
  app.get('/api/companies', (req, res) => {
    try {
      const companies = db.getCompanies();
      res.json(companies);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao listar empresas', details: err.message });
    }
  });

  app.post('/api/companies', (req, res) => {
    try {
      const { name, segment, color, logo_initials, monthly_goal } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Nome da empresa é obrigatório.' });
      }
      const company = db.addCompany({
        name,
        segment: segment || 'Geral & Serviços',
        color: color || '#6366f1',
        logo_initials,
        monthly_goal: Number(monthly_goal) || 50000
      });
      res.status(201).json(company);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao cadastrar empresa', details: err.message });
    }
  });

  app.patch('/api/companies/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updated = db.updateCompany(id, req.body);
      if (updated) {
        res.json(updated);
      } else {
        res.status(404).json({ error: 'Empresa não encontrada' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar empresa', details: err.message });
    }
  });

  app.delete('/api/companies/:id', (req, res) => {
    try {
      const { id } = req.params;
      const ok = db.deleteCompany(id);
      if (ok) {
        res.json({ success: true, message: 'Empresa removida com sucesso' });
      } else {
        res.status(404).json({ error: 'Empresa não encontrada' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao excluir empresa', details: err.message });
    }
  });

  // ==========================================
  // 1.2 VENDEDORES & EQUIPE COMERCIAL
  // ==========================================
  app.get('/api/sellers', (req, res) => {
    try {
      const { company_id } = req.query as { company_id?: string };
      const sellers = db.getSellers(company_id);
      res.json(sellers);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao listar vendedores', details: err.message });
    }
  });

  app.post('/api/sellers', (req, res) => {
    try {
      const { company_id, name, role, email, phone, avatar_color, active } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Nome do vendedor é obrigatório.' });
      }
      const seller = db.addSeller({
        company_id: company_id || 'empresa-1',
        name,
        role: role || 'Consultor Comercial',
        email,
        phone,
        avatar_color,
        active: active !== undefined ? active : true
      });
      res.status(201).json(seller);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao cadastrar vendedor', details: err.message });
    }
  });

  app.patch('/api/sellers/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updated = db.updateSeller(id, req.body);
      if (updated) {
        res.json(updated);
      } else {
        res.status(404).json({ error: 'Vendedor não encontrado' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar vendedor', details: err.message });
    }
  });

  app.delete('/api/sellers/:id', (req, res) => {
    try {
      const { id } = req.params;
      const ok = db.deleteSeller(id);
      if (ok) {
        res.json({ success: true, message: 'Vendedor removido com sucesso' });
      } else {
        res.status(404).json({ error: 'Vendedor não encontrado' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao excluir vendedor', details: err.message });
    }
  });

  // 1.2.1 RANKING DE VENDEDORES (ATENDIMENTOS VS VENDAS)
  app.get('/api/sellers/ranking', (req, res) => {
    try {
      const { company_id, startDate, endDate } = req.query as {
        company_id?: string;
        startDate?: string;
        endDate?: string;
      };
      const ranking = db.getSellersRanking(company_id, startDate, endDate);
      res.json(ranking);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao gerar ranking de vendedores', details: err.message });
    }
  });

  // ==========================================
  // 1.3 MÉTRICAS DO PAINEL (COM SUPORTE A COMPANY_ID)
  // ==========================================

  // 1.3.1 Conversion Funnel & Sankey Metrics
  app.get('/api/metrics/conversion-funnel', (req, res) => {
    try {
      const { startDate, endDate, product, company_id } = req.query as {
        startDate?: string;
        endDate?: string;
        product?: string;
        company_id?: string;
      };
      const data = db.getConversionFunnelMetrics(startDate, endDate, product, company_id);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao calcular métricas de funil', details: err.message });
    }
  });

  // 1.3.2 Timeline Metrics (Stacked Lines / Bars)
  app.get('/api/metrics/timeline', (req, res) => {
    try {
      const { group_by = 'month', startDate, endDate, company_id } = req.query as {
        group_by?: 'month' | 'week';
        startDate?: string;
        endDate?: string;
        company_id?: string;
      };
      const data = db.getTimelineMetrics(group_by, startDate, endDate, company_id);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao calcular métricas temporais', details: err.message });
    }
  });

  // 1.3.3 Attribution Tree (Origem das Vendas: Campanhas vs Indicações vs Orgânico)
  app.get('/api/metrics/attribution-tree', (req, res) => {
    try {
      const { startDate, endDate, company_id } = req.query as {
        startDate?: string;
        endDate?: string;
        company_id?: string;
      };
      const data = db.getAttributionTreeMetrics(startDate, endDate, company_id);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao calcular árvore de atribuição', details: err.message });
    }
  });

  // 1.3.4 Nível de Chegada Metrics & Distribuição
  app.get('/api/metrics/arrival-levels', (req, res) => {
    try {
      const { startDate, endDate, company_id } = req.query as {
        startDate?: string;
        endDate?: string;
        company_id?: string;
      };
      const data = db.getArrivalLevelsMetrics(startDate, endDate, company_id);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao calcular níveis de chegada', details: err.message });
    }
  });

  // 1.3.5 Desempenho por Campanha / Origem
  app.get('/api/metrics/campaigns-summary', (req, res) => {
    try {
      const { startDate, endDate, company_id } = req.query as {
        startDate?: string;
        endDate?: string;
        company_id?: string;
      };
      const data = db.getCampaignsSummary(startDate, endDate, company_id);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao calcular resumo de campanhas', details: err.message });
    }
  });

  // 1.3.6 Instagram Organic Growth & Metrics Endpoints
  app.get('/api/instagram/summary', (req, res) => {
    try {
      const { startDate, endDate, company_id } = req.query as { 
        startDate?: string; 
        endDate?: string; 
        company_id?: string;
      };
      const summary = db.getInstagramMetricsSummary(startDate, endDate, company_id);
      res.json(summary);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao calcular métricas do Instagram', details: err.message });
    }
  });

  app.get('/api/instagram/logs', (req, res) => {
    try {
      const { startDate, endDate, company_id } = req.query as { 
        startDate?: string; 
        endDate?: string; 
        company_id?: string;
      };
      const logs = db.getInstagramLogs(startDate, endDate, company_id);
      res.json(logs);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao listar anotações do Instagram', details: err.message });
    }
  });

  app.post('/api/instagram/logs', (req, res) => {
    try {
      const newLog = db.addInstagramLog(req.body);
      res.status(201).json({ success: true, log: newLog });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao registrar anotação do Instagram', details: err.message });
    }
  });

  app.patch('/api/instagram/logs/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updated = db.updateInstagramLog(id, req.body);
      if (updated) {
        res.json({ success: true, log: updated });
      } else {
        res.status(404).json({ error: 'Registro do Instagram não encontrado' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar anotação do Instagram', details: err.message });
    }
  });

  app.delete('/api/instagram/logs/:id', (req, res) => {
    try {
      const { id } = req.params;
      const ok = db.deleteInstagramLog(id);
      if (ok) {
        res.json({ success: true, message: 'Registro do Instagram excluído com sucesso' });
      } else {
        res.status(404).json({ error: 'Registro do Instagram não encontrado' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao excluir registro do Instagram', details: err.message });
    }
  });

  // ==========================================
  // 1.4 VENDAS & LEADS
  // ==========================================
  app.get('/api/sales', (req, res) => {
    try {
      const { company_id } = req.query as { company_id?: string };
      const sales = db.getSales(company_id);
      res.json(sales);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao listar vendas', details: err.message });
    }
  });

  app.patch('/api/sales/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updated = db.updateSale(id, req.body);
      if (updated) {
        res.json({ success: true, sale: updated });
      } else {
        res.status(404).json({ error: 'Venda não encontrada' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar venda', details: err.message });
    }
  });

  app.patch('/api/arrival-level', (req, res) => {
    try {
      const { id, level } = req.body;
      if (!id || !level) {
        return res.status(400).json({ error: 'ID e level são obrigatórios' });
      }
      const ok = db.updateArrivalLevel(id, level);
      if (ok) {
        res.json({ success: true, message: 'Nível de chegada atualizado com sucesso' });
      } else {
        res.status(404).json({ error: 'Registro não encontrado' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao atualizar nível de chegada', details: err.message });
    }
  });

  app.delete('/api/sales/:id', (req, res) => {
    try {
      const { id } = req.params;
      const success = db.deleteSale(id);
      if (success) {
        res.json({ success: true, message: 'Venda excluída com sucesso' });
      } else {
        res.status(404).json({ error: 'Venda não encontrada' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao excluir venda', details: err.message });
    }
  });

  app.get('/api/leads', (req, res) => {
    try {
      const { company_id } = req.query as { company_id?: string };
      const leads = db.getLeads(company_id);
      res.json(leads);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao listar leads', details: err.message });
    }
  });

  app.delete('/api/leads/:id', (req, res) => {
    try {
      const { id } = req.params;
      const success = db.deleteLead(id);
      if (success) {
        res.json({ success: true, message: 'Lead excluído com sucesso' });
      } else {
        res.status(404).json({ error: 'Lead não encontrado' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao excluir lead', details: err.message });
    }
  });

  // 1.7 Clientes e Jornada
  app.get('/api/customers', (req, res) => {
    try {
      const { search, status, company_id, limit = 50 } = req.query as {
        search?: string;
        status?: string;
        company_id?: string;
        limit?: string;
      };
      let leads = db.getLeads(company_id);

      if (status && status !== 'all') {
        leads = leads.filter(l => l.status === status);
      }

      if (search && typeof search === 'string') {
        const query = search.toLowerCase();
        leads = leads.filter(l => l.name.toLowerCase().includes(query) || l.email.toLowerCase().includes(query));
      }

      const customersWithJourneys = leads.slice(0, Number(limit)).map(l => db.getCustomerJourney(l.id)!);
      res.json({
        total: leads.length,
        customers: customersWithJourneys
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao listar clientes', details: err.message });
    }
  });

  app.get('/api/customers/:id/journey', (req, res) => {
    try {
      const { id } = req.params;
      const journey = db.getCustomerJourney(id);
      if (!journey) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      res.json(journey);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao obter jornada do cliente', details: err.message });
    }
  });

  // 1.9 Lista de Produtos
  app.get('/api/products', (req, res) => {
    res.json(PRODUCTS);
  });

  // 1.10 Quick Add Lead / Sale (Atribui Empresa, Vendedor, Campanha, Nível de Chegada)
  app.post('/api/sales/quick', (req, res) => {
    try {
      const {
        company_id,
        customer_name,
        customer_email,
        customer_phone,
        channel,
        origin_type,
        campaign_name,
        referrer_name,
        seller_id,
        seller_name,
        product_name,
        product_type,
        amount,
        sale_date,
        parent_sale_id,
        arrival_level,
        notes
      } = req.body;

      if (!customer_name) {
        return res.status(400).json({ error: 'Nome do cliente / lead é obrigatório.' });
      }

      const result = db.addQuickSale({
        company_id,
        customer_name,
        customer_email,
        customer_phone,
        channel: channel || 'Google Ads',
        origin_type: origin_type || 'campanha',
        campaign_name,
        referrer_name,
        seller_id,
        seller_name,
        product_name: product_name || 'Produto Principal (Produto A)',
        product_type: product_type || 'PRODUTO_A',
        amount: Number(amount) || 0,
        sale_date: sale_date || new Date().toISOString(),
        parent_sale_id,
        arrival_level,
        notes
      });

      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao lançar atendimento/venda', details: err.message });
    }
  });

  // 1.14 Documentation & Technical Artifacts
  app.get('/api/docs/ddl', (req, res) => {
    res.json({
      sql_ddl: SQL_DDL_SCRIPT,
      materialized_view_sql: MATERIALIZED_VIEW_SQL,
      mobile_tech_comparison: MOBILE_TECH_COMPARISON,
      performance_strategy: PERFORMANCE_STRATEGY
    });
  });

  // 1.15 Performance Stats
  app.get('/api/performance-stats', (req, res) => {
    const { company_id } = req.query as { company_id?: string };
    res.json({
      total_records: {
        companies: db.getCompanies().length,
        sellers: db.getSellers(company_id).length,
        leads: db.getLeads(company_id).length,
        sales: db.getSales(company_id).length,
        indications: db.getIndications().length
      },
      benchmarks: [
        {
          tier: 'Multi-Tenant Partition Filter',
          latency_ms: 2.1,
          description: 'Isolamento por empresa e agregações em tempo real',
          status: 'Ativo'
        },
        {
          tier: 'Query OLTP Direta',
          latency_ms: 6,
          description: 'Agregação instantânea de canais de campanha vs vendedores',
          status: 'Ativo'
        }
      ]
    });
  });

  // ==========================================
  // 2. VITE MIDDLEWARE / STATIC ASSETS
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Attribution Tracker Server running on port ${PORT}`);
  });
}

startServer();
