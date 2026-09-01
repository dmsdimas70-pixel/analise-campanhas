import React, { useState, useEffect } from 'react';
import { CustomerWithJourney, JourneyEvent } from '../types';
import { 
  UserCheck, 
  Search, 
  Clock, 
  CheckCircle, 
  Share2, 
  ArrowRight, 
  DollarSign, 
  Sparkles, 
  ChevronRight, 
  UserPlus, 
  ShieldCheck,
  Building,
  Phone,
  Mail
} from 'lucide-react';

interface CustomerJourneyDetailProps {
  initialCustomerId?: string;
}

export const CustomerJourneyDetail: React.FC<CustomerJourneyDetailProps> = ({
  initialCustomerId
}) => {
  const [customers, setCustomers] = useState<CustomerWithJourney[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(initialCustomerId || '');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithJourney | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch customers list
  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/customers?limit=60${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`);
      const data = await res.json();
      setCustomers(data.customers || []);
      
      // Auto select first customer or initial
      if (data.customers && data.customers.length > 0) {
        const toSelect = initialCustomerId 
          ? data.customers.find((c: any) => c.id === initialCustomerId) || data.customers[0]
          : data.customers[0];
        setSelectedCustomerId(toSelect.id);
        setSelectedCustomer(toSelect);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCustomer = async (id: string) => {
    setSelectedCustomerId(id);
    try {
      const res = await fetch(`/api/customers/${id}/journey`);
      const data = await res.json();
      setSelectedCustomer(data);
    } catch (err) {
      console.error('Error fetching customer journey:', err);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  const getEventIcon = (type: JourneyEvent['type']) => {
    switch (type) {
      case 'LEAD_CREATED':
        return <UserPlus className="w-3.5 h-3.5 text-[#818cf8]" />;
      case 'PRIMARY_SALE':
        return <CheckCircle className="w-3.5 h-3.5 text-[#34d399]" />;
      case 'CHAINED_SALE':
        return <Sparkles className="w-3.5 h-3.5 text-[#c084fc]" />;
      case 'INDICATION_MADE':
        return <Share2 className="w-3.5 h-3.5 text-[#f472b6]" />;
      case 'INDICATION_CONVERTED':
        return <DollarSign className="w-3.5 h-3.5 text-[#fbbf24]" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-[#94a3b8]" />;
    }
  };

  const getEventBadgeColor = (type: JourneyEvent['type']) => {
    switch (type) {
      case 'LEAD_CREATED':
        return 'bg-[#1e1b4b] text-[#818cf8] border-[#6366f1]/40';
      case 'PRIMARY_SALE':
        return 'bg-[#064e3b] text-[#34d399] border-[#10b981]/40';
      case 'CHAINED_SALE':
        return 'bg-[#581c87] text-[#c084fc] border-[#a855f7]/40';
      case 'INDICATION_MADE':
        return 'bg-[#831843] text-[#f472b6] border-[#ec4899]/40';
      case 'INDICATION_CONVERTED':
        return 'bg-[#78350f] text-[#fbbf24] border-[#f59e0b]/40';
    }
  };

  return (
    <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl p-3.5 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#2d3139] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 bg-[#6366f1]/20 text-[#818cf8] rounded border border-[#6366f1]/30">
              <UserCheck className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Gráfico D: Jornada Individual do Cliente &amp; Atribuição Linear
            </h2>
          </div>
          <p className="text-[11px] text-[#94a3b8] mt-0.5">
            Linha do tempo auditável de cada cliente: <strong>Entrada &rarr; Compra Produto A &rarr; Upsell Produto B (link parent_sale_id) &rarr; Indicações Feitas</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Customer Selector & Search (Col 1-4) */}
        <div className="lg:col-span-4 bg-[#0f1115] p-3 rounded-lg border border-[#2d3139] flex flex-col h-[520px]">
          {/* Search Box */}
          <div className="relative mb-2.5">
            <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar cliente por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1d23] text-[#e2e8f0] pl-8 pr-2.5 py-1.5 rounded border border-[#2d3139] text-xs focus:outline-none focus:border-[#6366f1]"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex space-x-1 mb-2.5 text-[10px] overflow-x-auto pb-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-0.5 rounded font-semibold transition-colors whitespace-nowrap ${
                statusFilter === 'all' ? 'bg-[#2d3139] text-white border border-[#3f444e]' : 'bg-[#1a1d23] text-[#94a3b8] hover:text-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('customer_ab')}
              className={`px-2 py-0.5 rounded font-semibold transition-colors whitespace-nowrap ${
                statusFilter === 'customer_ab' ? 'bg-[#581c87] text-[#e9d5ff] border border-[#a855f7]' : 'bg-[#1a1d23] text-[#94a3b8] hover:text-slate-200'
              }`}
            >
              Prod A + B
            </button>
            <button
              onClick={() => setStatusFilter('customer_a')}
              className={`px-2 py-0.5 rounded font-semibold transition-colors whitespace-nowrap ${
                statusFilter === 'customer_a' ? 'bg-[#064e3b] text-[#a7f3d0] border border-[#10b981]' : 'bg-[#1a1d23] text-[#94a3b8] hover:text-slate-200'
              }`}
            >
              Apenas A
            </button>
            <button
              onClick={() => setStatusFilter('lead')}
              className={`px-2 py-0.5 rounded font-semibold transition-colors whitespace-nowrap ${
                statusFilter === 'lead' ? 'bg-[#1e1b4b] text-[#c7d2fe] border border-[#6366f1]' : 'bg-[#1a1d23] text-[#94a3b8] hover:text-slate-200'
              }`}
            >
              Leads
            </button>
          </div>

          {/* Customer List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {isLoading ? (
              <div className="p-3 text-center text-xs text-[#94a3b8]">Carregando lista...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-3 text-center text-xs text-[#94a3b8]">Nenhum cliente encontrado.</div>
            ) : (
              filteredCustomers.map(customer => {
                const isSelected = customer.id === selectedCustomerId;
                return (
                  <div
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer.id)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-[#242831] border-[#6366f1] ring-1 ring-[#6366f1]'
                        : 'bg-[#1a1d23] border-[#2d3139] hover:border-[#3f444e]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-white mb-0.5">
                      <span className="truncate text-[11px]">{customer.name}</span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-[#0f1115] text-[#94a3b8] border border-[#2d3139]">
                        {customer.channel}
                      </span>
                    </div>

                    <div className="text-[#94a3b8] text-[10px] truncate mb-1.5">{customer.email}</div>

                    <div className="flex items-center justify-between text-[9px] border-t border-[#2d3139] pt-1">
                      <span className="text-[#94a3b8]">
                        LTV: <strong className="text-[#34d399]">R$ {customer.total_customer_value?.toLocaleString('pt-BR') || 0}</strong>
                      </span>
                      {customer.status === 'customer_ab' && (
                        <span className="text-[#c084fc] font-bold bg-[#581c87] px-1 rounded">
                          Upsell B
                        </span>
                      )}
                      {customer.indications_made && customer.indications_made.length > 0 && (
                        <span className="text-[#f472b6] font-bold bg-[#831843] px-1 rounded">
                          {customer.indications_made.length} ind.
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Journey Timeline & Metrics (Col 5-12) */}
        <div className="lg:col-span-8 bg-[#0f1115] p-3.5 sm:p-4 rounded-lg border border-[#2d3139] flex flex-col h-[520px] overflow-y-auto custom-scrollbar">
          {selectedCustomer ? (
            <div>
              {/* Customer Profile Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1a1d23] p-3 rounded-lg border border-[#2d3139] mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">{selectedCustomer.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#6366f1]/20 text-[#818cf8] font-semibold border border-[#6366f1]/30">
                      {selectedCustomer.channel}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#94a3b8] mt-0.5">
                    <span className="flex items-center space-x-1">
                      <Mail className="w-3 h-3 text-[#94a3b8]" />
                      <span>{selectedCustomer.email}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-[#94a3b8]" />
                      <span>{selectedCustomer.phone}</span>
                    </span>
                  </div>
                </div>

                {/* Customer Value Metrics */}
                <div className="flex items-center space-x-3 bg-[#0f1115] px-3 py-1.5 rounded border border-[#2d3139] text-xs">
                  <div>
                    <span className="text-[9px] text-[#94a3b8] uppercase font-bold">Compra Direta</span>
                    <div className="font-bold text-[#34d399] text-xs">
                      R$ {selectedCustomer.total_direct_spend.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="border-l border-[#2d3139] pl-3">
                    <span className="text-[9px] text-[#94a3b8] uppercase font-bold">Upsell B</span>
                    <div className="font-bold text-[#c084fc] text-xs">
                      R$ {selectedCustomer.total_chained_spend.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="border-l border-[#2d3139] pl-3">
                    <span className="text-[9px] text-[#94a3b8] uppercase font-bold">LTV Total</span>
                    <div className="font-extrabold text-white text-xs">
                      R$ {selectedCustomer.total_customer_value.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="mb-4">
                <h4 className="text-[11px] font-bold text-[#cbd5e1] uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                  <Clock className="w-3 h-3 text-[#6366f1]" />
                  <span>Linha do Tempo Cronológica de Eventos</span>
                </h4>

                <div className="relative pl-5 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2d3139]">
                  {selectedCustomer.journey_events.map((event, idx) => (
                    <div key={event.id || idx} className="relative group">
                      {/* Timeline Node Icon */}
                      <div className="absolute -left-5 top-0.5 w-4 h-4 rounded-full bg-[#0f1115] border border-[#2d3139] flex items-center justify-center shadow">
                        {getEventIcon(event.type)}
                      </div>

                      {/* Event Card */}
                      <div className="bg-[#1a1d23] p-2.5 rounded-lg border border-[#2d3139] hover:border-[#3f444e] transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getEventBadgeColor(event.type)}`}>
                            {event.title}
                          </span>
                          <span className="text-[10px] text-[#94a3b8] font-mono">
                            {formatDate(event.date)}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#cbd5e1] mt-0.5">
                          {event.description}
                        </p>

                        {/* Metadata Tag (ex: parent_sale_id link) */}
                        {event.metadata?.parent_sale_id && (
                          <div className="mt-1.5 text-[10px] bg-[#581c87]/50 text-[#e9d5ff] px-2 py-0.5 rounded border border-[#6b21a8] flex items-center space-x-1.5 font-mono">
                            <Sparkles className="w-3 h-3 text-[#c084fc]" />
                            <span>Venda Atribuída à Venda-Mãe: #{event.metadata.parent_sale_id}</span>
                          </div>
                        )}

                        {event.metadata?.referred_customer_name && (
                          <div className="mt-1.5 text-[10px] bg-[#831843]/50 text-[#fbcfe8] px-2 py-0.5 rounded border border-[#9d174d] flex items-center space-x-1.5 font-mono">
                            <Share2 className="w-3 h-3 text-[#f472b6]" />
                            <span>Contato Indicado: {event.metadata.referred_customer_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referral Tree Visualization */}
              {selectedCustomer.indications_made && selectedCustomer.indications_made.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#2d3139]">
                  <h4 className="text-[11px] font-bold text-[#f472b6] uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                    <Share2 className="w-3 h-3" />
                    <span>Árvore de Indicações Feitas por este Cliente ({selectedCustomer.indications_made.length})</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCustomer.indications_made.map(ind => (
                      <div
                        key={ind.id}
                        className="bg-[#1a1d23] p-2.5 rounded-lg border border-[#831843]/60 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-white text-[11px]">{ind.indicado_name}</div>
                          <div className="text-[10px] text-[#94a3b8]">Indicado em {formatDate(ind.created_at)}</div>
                        </div>
                        {ind.venda_gerada ? (
                          <span className="bg-[#064e3b] text-[#a7f3d0] border border-[#10b981] text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Venda R$ {ind.sale_amount?.toLocaleString('pt-BR')}
                          </span>
                        ) : (
                          <span className="bg-[#0f1115] text-[#94a3b8] text-[9px] px-1.5 py-0.5 rounded border border-[#2d3139]">
                            Em Nutrição
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#94a3b8] text-xs">
              Selecione um cliente para visualizar sua jornada detalhada.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
