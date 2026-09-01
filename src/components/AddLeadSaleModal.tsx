import React, { useState, useEffect } from 'react';
import { ArrivalLevel, ARRIVAL_LEVELS, OriginType, Company, Seller } from '../types';
import { 
  Plus, 
  X, 
  DollarSign, 
  Share2, 
  Sparkles, 
  Check, 
  Tag, 
  Target, 
  Users, 
  Building2, 
  UserCheck, 
  Layers, 
  Calendar,
  MessageSquare 
} from 'lucide-react';

interface AddLeadSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedCompanyId?: string;
}

export const AddLeadSaleModal: React.FC<AddLeadSaleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedCompanyId
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [companyId, setCompanyId] = useState(selectedCompanyId || 'empresa-1');
  const [sellerId, setSellerId] = useState('');
  const [customSellerName, setCustomSellerName] = useState('');

  const [originCategory, setOriginCategory] = useState<OriginType>('campanha');
  const [channel, setChannel] = useState('Meta Ads (Instagram / Facebook)');
  const [campaignName, setCampaignName] = useState('');
  const [referrerName, setReferrerName] = useState('');
  
  // Custom Product details
  const [productName, setProductName] = useState('Produto Principal');
  const [productType, setProductType] = useState<'PRODUTO_A' | 'PRODUTO_B' | 'SERVICO_X' | 'OUTRO'>('PRODUTO_A');
  const [amount, setAmount] = useState<number | string>(1500);

  // Arrival Level (Nível de Chegada)
  const [arrivalLevel, setArrivalLevel] = useState<ArrivalLevel>('nivel_3_produto_a');

  // Customer & details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCompaniesAndSellers();
      if (selectedCompanyId) {
        setCompanyId(selectedCompanyId);
      }
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setProductName('Produto Principal');
      setProductType('PRODUTO_A');
      setAmount(1500);
      setCampaignName('');
      setReferrerName('');
      setCustomSellerName('');
      setNotes('');
      setArrivalLevel('nivel_3_produto_a');
      setSaleDate(new Date().toISOString().split('T')[0]);
      setFeedbackMsg('');
    }
  }, [isOpen, selectedCompanyId]);

  useEffect(() => {
    if (companyId) {
      fetchSellersForCompany(companyId);
    }
  }, [companyId]);

  const fetchCompaniesAndSellers = async () => {
    try {
      const res = await fetch('/api/companies');
      if (res.ok) {
        const data: Company[] = await res.json();
        setCompanies(data || []);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const fetchSellersForCompany = async (cId: string) => {
    try {
      const res = await fetch(`/api/sellers?company_id=${cId}`);
      if (res.ok) {
        const data: Seller[] = await res.json();
        setSellers(data || []);
        if (data && data.length > 0) {
          setSellerId(data[0].id);
        } else {
          setSellerId('');
        }
      }
    } catch (err) {
      console.error('Error fetching sellers:', err);
    }
  };

  if (!isOpen) return null;

  const handleOriginCategoryChange = (cat: OriginType) => {
    setOriginCategory(cat);
    if (cat === 'campanha') {
      setChannel('Meta Ads');
    } else if (cat === 'indicacao') {
      setChannel('Indicacao');
      setArrivalLevel('nivel_5_promotor');
    } else if (cat === 'organico') {
      setChannel('Instagram Orgânico');
    } else {
      setChannel('WhatsApp / Direto');
    }
  };

  const productPresets = [
    'Produto Principal',
    'Mentoria Individual',
    'Consultoria VIP',
    'Curso / Treinamento',
    'Software / Assinatura',
    'Serviço Premium'
  ];

  const campaignPresets = [
    'Meta Ads - Campanha Escala',
    'Google Search - Fundo de Funil',
    'TikTok Ads - Vídeo Viral',
    'Meta Ads - Remarketing',
    'Instagram Stories Orgânico',
    'Lista VIP WhatsApp'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Por favor, informe o nome do cliente.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedSeller = sellers.find(s => s.id === sellerId);
      const sName = customSellerName.trim() || (selectedSeller ? selectedSeller.name : undefined);

      const payload = {
        company_id: companyId,
        seller_id: sellerId === 'custom' ? undefined : sellerId,
        seller_name: sName,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim() || undefined,
        customer_phone: customerPhone.trim() || undefined,
        channel: originCategory === 'indicacao' ? 'Indicacao' : channel,
        origin_type: originCategory,
        campaign_name: originCategory === 'campanha' ? (campaignName.trim() || channel) : (originCategory === 'indicacao' ? `Indicação de ${referrerName.trim()}` : channel),
        referrer_name: originCategory === 'indicacao' ? referrerName.trim() : undefined,
        product_name: productName.trim() || 'Produto Principal',
        product_type: productType,
        amount: arrivalLevel === 'nivel_1_lead' ? 0 : (Number(amount) || 0),
        sale_date: saleDate,
        arrival_level: arrivalLevel,
        parent_sale_id: arrivalLevel === 'nivel_4_upsell' ? 'upsell-manual' : null,
        notes: notes.trim() || undefined
      };

      const res = await fetch('/api/sales/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setFeedbackMsg('Atendimento e venda registrados com sucesso!');
        setTimeout(() => {
          setFeedbackMsg('');
          onSuccess();
          onClose();
        }, 700);
      }
    } catch (err) {
      console.error('Error submitting quick sale:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#1a1d23] border border-[#2d3139] rounded-xl max-w-xl w-full p-4 sm:p-5 shadow-2xl relative text-xs text-[#e2e8f0] my-4 max-h-[92vh] overflow-y-auto custom-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 text-[#94a3b8] hover:text-white p-1 rounded-md hover:bg-[#2d3139] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-3.5 pr-6">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
            <Target className="w-4 h-4 text-[#6366f1]" />
            <span>Lançar Atendimento, Venda &amp; Nível de Chegada</span>
          </h3>
          <p className="text-[#94a3b8] text-[11px] mt-0.5">
            Atribua a empresa cliente, o vendedor responsável, a campanha e o nível de chegada do lead.
          </p>
        </div>

        {feedbackMsg && (
          <div className="bg-[#10b981]/20 border border-[#10b981]/40 text-[#34d399] p-2.5 rounded-lg mb-3 flex items-center space-x-2 font-medium text-xs">
            <Check className="w-4 h-4 text-[#34d399] shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* SEÇÃO 0: EMPRESA & VENDEDOR RESPONSÁVEL */}
          <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[#cbd5e1] font-bold text-xs flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>1. Empresa &amp; Vendedor Responsável</span>
              </label>
              <span className="text-[10px] text-[#94a3b8]">Atribuição Comercial</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-[#94a3b8] font-semibold block mb-1">
                  Empresa / Cliente:
                </label>
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#38bdf8] text-xs font-semibold cursor-pointer"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.segment})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#94a3b8] font-semibold block mb-1">
                  Vendedor / Atendente:
                </label>
                <select
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                  className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#38bdf8] text-xs font-semibold cursor-pointer"
                >
                  {sellers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role || 'Vendedor'})
                    </option>
                  ))}
                  <option value="custom">+ Outro / Digitar nome</option>
                </select>
              </div>
            </div>

            {sellerId === 'custom' && (
              <div className="pt-1">
                <label className="text-[10px] text-[#94a3b8] block mb-1">Nome do Vendedor:</label>
                <input
                  type="text"
                  placeholder="Ex: Carlos Eduardo Closer"
                  value={customSellerName}
                  onChange={(e) => setCustomSellerName(e.target.value)}
                  className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#38bdf8] text-xs"
                />
              </div>
            )}
          </div>

          {/* SEÇÃO 1: PRODUTO PRINCIPAL & VALOR */}
          <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[#cbd5e1] font-bold text-xs flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-[#6366f1]" />
                <span>2. Produto &amp; Valor Fechado</span>
              </label>
              <span className="text-[10px] text-[#94a3b8]">Monetização</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="text-[10px] text-[#94a3b8] block mb-1">Nome do Produto ou Serviço:</label>
                <input
                  type="text"
                  placeholder="Ex: Tratamento Completo / Mentoria VIP"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#6366f1] text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-[#94a3b8] block mb-1">Valor Total (R$):</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-xs font-bold">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#1a1d23] text-white pl-8 pr-2.5 py-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#6366f1] text-xs font-bold text-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Quick product presets */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[10px]">
              <span className="text-[#64748b] shrink-0">Sugestões:</span>
              {productPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setProductName(preset)}
                  className={`px-2 py-0.5 rounded border transition-colors shrink-0 cursor-pointer ${
                    productName === preset 
                      ? 'bg-[#6366f1]/20 border-[#6366f1] text-[#a5b4fc]' 
                      : 'bg-[#1a1d23] border-[#2d3139] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* SEÇÃO 2: NÍVEL DE CHEGADA DO CLIENTE */}
          <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[#cbd5e1] font-bold text-xs flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-[#ec4899]" />
                <span>3. Nível de Chegada do Cliente</span>
              </label>
              <span className="text-[10px] text-[#94a3b8]">Estágio do Funil</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5">
              {(Object.keys(ARRIVAL_LEVELS) as ArrivalLevel[]).map((lvlKey) => {
                const info = ARRIVAL_LEVELS[lvlKey];
                const isSelected = arrivalLevel === lvlKey;
                return (
                  <button
                    key={lvlKey}
                    type="button"
                    onClick={() => setArrivalLevel(lvlKey)}
                    className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-indigo-500 bg-[#1a1d23] shadow-md ring-1 ring-indigo-500' 
                        : 'border-[#2d3139] bg-[#1a1d23]/40 hover:bg-[#1a1d23] opacity-80'
                    }`}
                  >
                    <div>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${info.badgeBg} ${info.badgeText} border ${info.badgeBorder}`}>
                        {info.shortLabel}
                      </span>
                      <span className="text-[11px] font-bold text-white block mt-1 leading-tight">
                        {info.label.split('(')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEÇÃO 3: ORIGEM / CANAL / CAMPANHA */}
          <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139] space-y-2.5">
            <label className="text-[#cbd5e1] font-bold text-xs flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>4. Origem &amp; Campanha do Tráfego</span>
            </label>

            {/* Origin buttons */}
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleOriginCategoryChange('campanha')}
                className={`py-1.5 px-2 rounded-lg border text-center text-xs font-semibold transition-colors cursor-pointer ${
                  originCategory === 'campanha' 
                    ? 'bg-[#6366f1] text-white border-[#6366f1]' 
                    : 'bg-[#1a1d23] text-[#94a3b8] border-[#2d3139] hover:text-white'
                }`}
              >
                Tráfego Pago (Ads)
              </button>

              <button
                type="button"
                onClick={() => handleOriginCategoryChange('indicacao')}
                className={`py-1.5 px-2 rounded-lg border text-center text-xs font-semibold transition-colors cursor-pointer ${
                  originCategory === 'indicacao' 
                    ? 'bg-[#ec4899] text-white border-[#ec4899]' 
                    : 'bg-[#1a1d23] text-[#94a3b8] border-[#2d3139] hover:text-white'
                }`}
              >
                Indicação
              </button>

              <button
                type="button"
                onClick={() => handleOriginCategoryChange('organico')}
                className={`py-1.5 px-2 rounded-lg border text-center text-xs font-semibold transition-colors cursor-pointer ${
                  originCategory === 'organico' 
                    ? 'bg-[#10b981] text-white border-[#10b981]' 
                    : 'bg-[#1a1d23] text-[#94a3b8] border-[#2d3139] hover:text-white'
                }`}
              >
                Orgânico / Insta
              </button>

              <button
                type="button"
                onClick={() => handleOriginCategoryChange('direto')}
                className={`py-1.5 px-2 rounded-lg border text-center text-xs font-semibold transition-colors cursor-pointer ${
                  originCategory === 'direto' 
                    ? 'bg-[#8b5cf6] text-white border-[#8b5cf6]' 
                    : 'bg-[#1a1d23] text-[#94a3b8] border-[#2d3139] hover:text-white'
                }`}
              >
                WhatsApp / Direto
              </button>
            </div>

            {/* Conditional fields based on Origin */}
            {originCategory === 'campanha' && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-1">Canal de Anúncio:</label>
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value)}
                      className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#6366f1] text-xs cursor-pointer"
                    >
                      <option value="Meta Ads">Meta Ads (Facebook &amp; Instagram)</option>
                      <option value="Google Ads">Google Ads (Search &amp; Youtube)</option>
                      <option value="TikTok Ads">TikTok Ads</option>
                      <option value="LinkedIn Ads">LinkedIn Ads</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-1">Nome da Campanha:</label>
                    <input
                      type="text"
                      placeholder="Ex: Meta Ads - Implante e Estética"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#6366f1] text-xs"
                    />
                  </div>
                </div>

                {/* Campaign presets */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 text-[10px]">
                  <span className="text-[#64748b] shrink-0">Modelos:</span>
                  {campaignPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCampaignName(preset)}
                      className="px-2 py-0.5 rounded bg-[#1a1d23] border border-[#2d3139] text-[#94a3b8] hover:text-white shrink-0 cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {originCategory === 'indicacao' && (
              <div className="pt-1">
                <label className="text-[10px] text-[#94a3b8] block mb-1">Nome de quem fez a Indicação:</label>
                <input
                  type="text"
                  placeholder="Ex: Mariana Silva (Cliente Antigo)"
                  value={referrerName}
                  onChange={(e) => setReferrerName(e.target.value)}
                  className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#ec4899] text-xs"
                  required
                />
              </div>
            )}
          </div>

          {/* SEÇÃO 4: DADOS DO CLIENTE & DATA */}
          <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2d3139] space-y-2.5">
            <label className="text-[#cbd5e1] font-bold text-xs flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>5. Dados do Cliente &amp; Data</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] text-[#94a3b8] block mb-1">Nome do Cliente:</label>
                <input
                  type="text"
                  placeholder="Ex: Roberto Gomes"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#6366f1] text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-[#94a3b8] block mb-1">WhatsApp / Telefone:</label>
                <input
                  type="text"
                  placeholder="+55 11 99999-8888"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#6366f1] text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#94a3b8] block mb-1">Data da Venda:</label>
                <input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#6366f1] text-xs cursor-pointer"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#94a3b8] block mb-1">Anotações / Observações:</label>
              <input
                type="text"
                placeholder="Ex: Cliente fechou pacote à vista via PIX com desconto"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#1a1d23] text-white p-2 rounded-lg border border-[#2d3139] focus:outline-none focus:border-[#6366f1] text-xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#2d3139]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#2d3139] hover:bg-[#374151] text-[#94a3b8] hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-5 py-2 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#4f46e5] hover:to-[#4338ca] text-white rounded-lg text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Gravando...' : 'Salvar Registro Completo'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
