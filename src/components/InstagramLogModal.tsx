import React, { useState, useEffect } from 'react';
import { X, Instagram, Save, Calendar, TrendingUp, Eye, Link, MessageCircle, Video, Image, FileText } from 'lucide-react';
import { InstagramGrowthLog } from '../types';
import { TermExplainer } from './TermExplainer';

interface InstagramLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingLog?: InstagramGrowthLog | null;
  lastFollowersCount?: number;
  selectedCompanyId?: string;
}

export const InstagramLogModal: React.FC<InstagramLogModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingLog,
  lastFollowersCount = 0,
  selectedCompanyId
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [followersCount, setFollowersCount] = useState<number | string>(lastFollowersCount || '');
  const [newFollowers, setNewFollowers] = useState<number | string>('');
  const [unfollows, setUnfollows] = useState<number | string>('0');
  const [accountsReached, setAccountsReached] = useState<number | string>('');
  const [profileViews, setProfileViews] = useState<number | string>('');
  const [linkClicks, setLinkClicks] = useState<number | string>('');
  const [dmsReceived, setDmsReceived] = useState<number | string>('');
  const [postsCount, setPostsCount] = useState<number | string>('0');
  const [reelsCount, setReelsCount] = useState<number | string>('0');
  const [storiesCount, setStoriesCount] = useState<number | string>('0');
  const [organicLeads, setOrganicLeads] = useState<number | string>('0');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingLog) {
      setDate(editingLog.date);
      setFollowersCount(editingLog.followers_count);
      setNewFollowers(editingLog.new_followers);
      setUnfollows(editingLog.unfollows || 0);
      setAccountsReached(editingLog.accounts_reached);
      setProfileViews(editingLog.profile_views);
      setLinkClicks(editingLog.link_clicks);
      setDmsReceived(editingLog.dms_received);
      setPostsCount(editingLog.posts_count || 0);
      setReelsCount(editingLog.reels_count || 0);
      setStoriesCount(editingLog.stories_count || 0);
      setOrganicLeads(editingLog.organic_leads_generated || 0);
      setNotes(editingLog.notes || '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setFollowersCount(lastFollowersCount || '');
      setNewFollowers('');
      setUnfollows('0');
      setAccountsReached('');
      setProfileViews('');
      setLinkClicks('');
      setDmsReceived('');
      setPostsCount('0');
      setReelsCount('0');
      setStoriesCount('0');
      setOrganicLeads('0');
      setNotes('');
    }
    setError(null);
  }, [editingLog, isOpen, lastFollowersCount]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError('Por favor, informe a data da anotação.');
      return;
    }
    if (!followersCount && followersCount !== 0) {
      setError('Informe o total atual de seguidores.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        company_id: selectedCompanyId,
        date,
        followers_count: Number(followersCount) || 0,
        new_followers: Number(newFollowers) || 0,
        unfollows: Number(unfollows) || 0,
        accounts_reached: Number(accountsReached) || 0,
        profile_views: Number(profileViews) || 0,
        link_clicks: Number(linkClicks) || 0,
        dms_received: Number(dmsReceived) || 0,
        posts_count: Number(postsCount) || 0,
        reels_count: Number(reelsCount) || 0,
        stories_count: Number(storiesCount) || 0,
        organic_leads_generated: Number(organicLeads) || 0,
        notes: notes.trim() || undefined
      };

      let response;
      if (editingLog) {
        response = await fetch(`/api/instagram/logs/${editingLog.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('/api/instagram/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error('Falha ao salvar métricas do Instagram');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar os dados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calcNetGrowth = (Number(newFollowers) || 0) - (Number(unfollows) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#14171d] border border-[#2d3139] rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d3139] bg-gradient-to-r from-[#833ab4]/20 via-[#fd1d1d]/20 to-[#fcb045]/20">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] flex items-center justify-center text-white shadow-md">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {editingLog ? 'Editar Anotação do Instagram' : 'Anotar Crescimento do Instagram'}
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Controle orgânico de seguidores, alcance, visitas e leads gerados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white p-1.5 rounded-lg hover:bg-[#222630] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-lg text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Section 1: Data e Seguidores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#e1306c]" />
                Data da Anotação
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full bg-[#0f1115] border border-[#2d3139] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e1306c]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Total de Seguidores</span>
                <span className="text-[10px] text-[#38bdf8]">(Followers)</span>
              </label>
              <input
                type="number"
                value={followersCount}
                onChange={e => setFollowersCount(e.target.value)}
                placeholder="Ex: 12500"
                required
                className="w-full bg-[#0f1115] border border-[#2d3139] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e1306c]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1.5">
                  Novos (+)
                </label>
                <input
                  type="number"
                  value={newFollowers}
                  onChange={e => setNewFollowers(e.target.value)}
                  placeholder="Ex: 85"
                  className="w-full bg-[#0f1115] border border-[#2d3139] rounded-lg px-2.5 py-2 text-sm text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1.5">
                  Unfollows (-)
                </label>
                <input
                  type="number"
                  value={unfollows}
                  onChange={e => setUnfollows(e.target.value)}
                  placeholder="Ex: 12"
                  className="w-full bg-[#0f1115] border border-[#2d3139] rounded-lg px-2.5 py-2 text-sm text-rose-300 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Badge de saldo líquido */}
          {(newFollowers !== '' || unfollows !== '') && (
            <div className="flex items-center justify-between bg-[#1a1d24] px-3.5 py-2 rounded-lg border border-[#2d3139] text-xs">
              <span className="text-[#94a3b8] flex items-center gap-1.5">
                <span>Crescimento Líquido</span>
                <span className="text-[#38bdf8] text-[10px]">(Novos seguidores menos cancelamentos)</span>:
              </span>
              <span className={`font-bold ${calcNetGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {calcNetGrowth >= 0 ? `+${calcNetGrowth}` : calcNetGrowth} seguidores
              </span>
            </div>
          )}

          {/* Section 2: Alcance & Tráfego Orgânico */}
          <div className="border-t border-[#222630] pt-4">
            <h3 className="text-xs font-bold text-[#e2e8f0] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Alcance &amp; Visitas</span>
              <span className="text-[10px] lowercase font-normal text-[#94a3b8] bg-[#1e222b] px-2 py-0.5 rounded border border-[#2d3139]">
                (Visualizações orgânicas sem pagar anúncio)
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">
                  Contas Alcançadas <span className="text-[#38bdf8]">(Reach)</span>
                </label>
                <input
                  type="number"
                  value={accountsReached}
                  onChange={e => setAccountsReached(e.target.value)}
                  placeholder="Ex: 4500"
                  className="w-full bg-[#0f1115] border border-[#2d3139] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">
                  Visitas ao Perfil <span className="text-[#38bdf8]">(Profile Views)</span>
                </label>
                <input
                  type="number"
                  value={profileViews}
                  onChange={e => setProfileViews(e.target.value)}
                  placeholder="Ex: 320"
                  className="w-full bg-[#0f1115] border border-[#2d3139] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">
                  Cliques no Link Bio <span className="text-[#38bdf8]">(Link Clicks)</span>
                </label>
                <input
                  type="number"
                  value={linkClicks}
                  onChange={e => setLinkClicks(e.target.value)}
                  placeholder="Ex: 48"
                  className="w-full bg-[#0f1115] border border-[#2d3139] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#38bdf8]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Mensagens & Conversões */}
          <div className="border-t border-[#222630] pt-4">
            <h3 className="text-xs font-bold text-[#e2e8f0] uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Mensagens Privadas &amp; Leads Orgânicos</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">
                  Directs Recebidos <span className="text-[#38bdf8]">(DMs / Mensagens de clientes)</span>
                </label>
                <input
                  type="number"
                  value={dmsReceived}
                  onChange={e => setDmsReceived(e.target.value)}
                  placeholder="Ex: 15"
                  className="w-full bg-[#0f1115] border border-[#2d3139] rounded-lg px-3 py-2 text-sm text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">
                  Leads Orgânicos <span className="text-[#38bdf8]">(Contatos que pediram proposta)</span>
                </label>
                <input
                  type="number"
                  value={organicLeads}
                  onChange={e => setOrganicLeads(e.target.value)}
                  placeholder="Ex: 6"
                  className="w-full bg-[#0f1115] border border-[#2d3139] rounded-lg px-3 py-2 text-sm text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Publicações do dia */}
          <div className="border-t border-[#222630] pt-4">
            <h3 className="text-xs font-bold text-[#e2e8f0] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Video className="w-3.5 h-3.5 text-purple-400" />
              <span>Publicações Realizadas Hoje</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">
                  Reels <span className="text-[#38bdf8]">(Vídeos curtos)</span>
                </label>
                <input
                  type="number"
                  value={reelsCount}
                  onChange={e => setReelsCount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#0f1115] border border-[#2d3139] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">
                  Posts Feed <span className="text-[#38bdf8]">(Fotos / Carrossel)</span>
                </label>
                <input
                  type="number"
                  value={postsCount}
                  onChange={e => setPostsCount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#0f1115] border border-[#2d3139] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">
                  Stories <span className="text-[#38bdf8]">(Postagens 24h)</span>
                </label>
                <input
                  type="number"
                  value={storiesCount}
                  onChange={e => setStoriesCount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#0f1115] border border-[#2d3139] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Anotações & Observações */}
          <div className="border-t border-[#222630] pt-4">
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />
              Anotações de Estratégia / O que gerou o resultado:
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Postamos um Reels sobre 5 erros comuns e gerou 20 directs com pedidos de orçamento..."
              rows={2}
              className="w-full bg-[#0f1115] border border-[#2d3139] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e1306c]"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#222630]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#94a3b8] hover:text-white hover:bg-[#222630] rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#e1306c] to-[#fd1d1d] hover:from-[#c13584] hover:to-[#e1306c] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Salvando...' : editingLog ? 'Salvar Alterações' : 'Salvar Anotação'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
