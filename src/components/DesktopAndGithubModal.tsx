import React, { useState } from 'react';
import { 
  Download, 
  Github, 
  Monitor, 
  HardDrive, 
  Copy, 
  Check, 
  ExternalLink, 
  FolderDown, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  Terminal, 
  Layers, 
  Save, 
  FileCode,
  ShieldCheck,
  AlertCircle,
  Play,
  Package,
  Box,
  X
} from 'lucide-react';

interface DesktopAndGithubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshMetrics?: () => void;
}

export const DesktopAndGithubModal: React.FC<DesktopAndGithubModalProps> = ({
  isOpen,
  onClose,
  onRefreshMetrics
}) => {
  const [activeTab, setActiveTab] = useState<'desktop_exe' | 'github_publish' | 'local_save' | 'python_offline'>('python_offline');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState('https://github.com/SEU_USUARIO/attribution-crm.git');
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Status da gravação direta em disco permanente
  const [dbDiskStatus, setDbDiskStatus] = useState<{
    status: string;
    filePath: string;
    lastSaved: string;
    existsOnDisk: boolean;
    fileSizeBytes?: number;
    counts?: {
      companies: number;
      sellers: number;
      leads: number;
      sales: number;
      dailyTraffic: number;
      indications: number;
    };
  } | null>(null);
  const [isSavingDisk, setIsSavingDisk] = useState(false);
  const [diskSaveMsg, setDiskSaveMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      fetch('/api/database/status')
        .then(r => r.json())
        .then(data => setDbDiskStatus(data))
        .catch(() => {});
    }
  }, [isOpen]);

  const handleSaveToDiskNow = async () => {
    setIsSavingDisk(true);
    setDiskSaveMsg(null);
    try {
      const res = await fetch('/api/database/save-now', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setDiskSaveMsg(data.message || 'Dados gravados com sucesso no arquivo local!');
        setDbDiskStatus(prev => prev ? ({ ...prev, lastSaved: data.lastSaved, existsOnDisk: true }) : null);
      } else {
        setDiskSaveMsg('Erro ao gravar no disco.');
      }
    } catch {
      setDiskSaveMsg('Erro de comunicação com o servidor local.');
    } finally {
      setIsSavingDisk(false);
    }
  };

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // 1. Export Complete Backup to Local PC File
  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/backup/export');
      if (res.ok) {
        const data = await res.json();
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const dateStr = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `backup-sistema-origem-lojas-${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Erro ao exportar backup:', err);
      alert('Erro ao exportar dados do sistema.');
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Import Backup from Local PC File
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const res = await fetch('/api/backup/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });

      if (res.ok) {
        const result = await res.json();
        setImportStatus(`Sucesso! ${result.message} (${result.counts.companies} empresas, ${result.counts.sellers} vendedores, ${result.counts.sales} vendas).`);
        if (onRefreshMetrics) {
          onRefreshMetrics();
        }
      } else {
        const errData = await res.json();
        setImportStatus(`Erro: ${errData.error || 'Arquivo inválido'}`);
      }
    } catch (err: any) {
      setImportStatus(`Erro ao ler arquivo: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  // 3. Download Windows .BAT launcher script
  const handleDownloadBat = () => {
    const batContent = `@echo off
title Attribution CRM & Diário de Lojas - Servidor Local
echo ========================================================
echo   INICIANDO ATTRIBUTION CRM NO SEU COMPUTADOR
echo ========================================================
echo.
echo 1. Verificando dependencias...
call npm install
echo.
echo 2. Iniciando servidor do sistema na porta 3000...
start http://localhost:3000
npm run dev
pause
`;
    const blob = new Blob([batContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iniciar-sistema.bat`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 4. Download Complete Python Offline App ZIP (Gradio / ML)
  const handleDownloadOfflineZip = async () => {
    setIsDownloadingZip(true);
    try {
      const res = await fetch('/api/offline-app/download-zip');
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meu_app_offline.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert('Erro ao gerar arquivo ZIP.');
      }
    } catch (err) {
      console.error('Erro ao baixar zip:', err);
      alert('Erro de conexão ao baixar o pacote.');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // 5. Download Direct iniciar_programa.exe (Windows Executable 2 Cliques)
  const handleDownloadIniciarExe = () => {
    const a = document.createElement('a');
    a.href = '/api/offline-app/download-iniciar-exe';
    a.download = 'iniciar_programa.exe';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadOfflineExe = () => {
    const a = document.createElement('a');
    a.href = '/api/offline-app/download-exe';
    a.download = 'app.exe';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 6. Download Iniciar_CRM.exe (Windows Executable for CRM)
  const handleDownloadCrmExe = () => {
    const a = document.createElement('a');
    a.href = '/api/desktop/download-crm-exe';
    a.download = 'Iniciar_CRM.exe';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const gitCommands = `# 1. Inicializar o repositório git na pasta do projeto
git init

# 2. Adicionar todos os arquivos do sistema
git add .

# 3. Criar o primeiro commit de publicação
git commit -m "Publicação Attribution CRM & Diário de Fluxo de Loja"

# 4. Definir a branch principal como main
git branch -M main

# 5. Conectar com o seu repositório no GitHub
git remote add origin ${repoUrl}

# 6. Enviar para o GitHub
git push -u origin main`;

  const electronBuildCommands = `# 1. Instalar o Electron e o empacotador de executáveis Windows (.EXE)
npm install --save-dev electron electron-builder

# 2. Gerar a compilação do sistema
npm run build

# 3. Gerar o arquivo instalador .EXE standalone para Windows
npx electron-builder --win portable`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#1a1d23] w-full max-w-3xl rounded-2xl border border-[#2d3139] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#0f1115] p-5 border-b border-[#2d3139] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white">
                  Instalar no Computador (.EXE) & Publicar no GitHub
                </h3>
                <span className="bg-indigo-950/60 text-indigo-400 text-[10px] font-black px-2 py-0.5 rounded-md border border-indigo-500/30">
                  Desktop & Backup PC
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                Execute como aplicativo no seu computador, salve dados localmente e publique no GitHub
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white p-1 rounded-lg hover:bg-[#2d3139] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#14171d] px-5 pt-3 border-b border-[#2d3139] flex space-x-2">
          <button
            onClick={() => setActiveTab('desktop_exe')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'desktop_exe'
                ? 'text-white border-indigo-500 bg-[#1a1d23] rounded-t-xl'
                : 'text-[#94a3b8] border-transparent hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4 text-indigo-400" />
            <span>1. Instalar no PC (.EXE / Desktop)</span>
          </button>

          <button
            onClick={() => setActiveTab('github_publish')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'github_publish'
                ? 'text-white border-[#38bdf8] bg-[#1a1d23] rounded-t-xl'
                : 'text-[#94a3b8] border-transparent hover:text-white'
            }`}
          >
            <Github className="w-4 h-4 text-[#38bdf8]" />
            <span>2. Publicar no GitHub</span>
          </button>

          <button
            onClick={() => setActiveTab('local_save')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'local_save'
                ? 'text-white border-emerald-500 bg-[#1a1d23] rounded-t-xl'
                : 'text-[#94a3b8] border-transparent hover:text-white'
            }`}
          >
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>3. Salvar Tudo no PC (Backup & Restore)</span>
          </button>

          <button
            onClick={() => setActiveTab('python_offline')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'python_offline'
                ? 'text-white border-amber-500 bg-[#1a1d23] rounded-t-xl'
                : 'text-[#94a3b8] border-transparent hover:text-white'
            }`}
          >
            <Box className="w-4 h-4 text-amber-400" />
            <span>4. App Python Offline (Colab &rarr; PC)</span>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
              ZIP
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          {/* ========================================================= */}
          {/* TAB 1: INSTALAR NO PC (.EXE / DESKTOP) */}
          {/* ========================================================= */}
          {activeTab === 'desktop_exe' && (
            <div className="space-y-5">
              
              {/* Opção A: Instalação Instantânea Desktop PWA */}
              <div className="bg-[#0f1115] p-5 rounded-2xl border border-indigo-500/30 relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-indigo-950/80 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded border border-indigo-500/30">
                        OPÇÃO MAIS RÁPIDA (RECOMENDADA)
                      </span>
                      <h4 className="text-sm font-black text-white">
                        Instalar como Aplicativo Nativo no Windows / Mac
                      </h4>
                    </div>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                      Instala o sistema diretamente no computador com ícone na Área de Trabalho e na Barra de Tarefas. Abre em janela autônoma sem barra de navegação, com suporte offline e salvamento local.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2d3139] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#cbd5e1]">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ícone na Área de Trabalho</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Janela autônoma própria</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Salva tudo no computador</span>
                  </div>
                </div>

                <div className="mt-4 bg-[#1a1d23] p-3 rounded-xl border border-[#2d3139] text-xs text-[#94a3b8] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Para instalar agora: No Chrome ou Edge, clique no ícone de computador/instalação no canto direito da barra de endereços (ao lado da estrela de favoritos) ou em <strong>Menu &gt; Instalar este app</strong>.</span>
                  </div>
                </div>
              </div>

              {/* Opção B: Gerar Executável .EXE (Electron) */}
              <div className="bg-[#0f1115] p-5 rounded-2xl border border-[#2d3139] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#1e1b4b] text-[#818cf8] text-[10px] font-bold px-2 py-0.5 rounded border border-[#6366f1]/30">
                        EXECUTÁVEL WINDOWS STANDALONE (.EXE)
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-white mt-1">
                      Como Gerar o Arquivo .EXE para o Computador
                    </h4>
                    <p className="text-xs text-[#94a3b8]">
                      O projeto já conta com a configuração para empacotar em um executável <code className="text-indigo-300">.exe</code> portátil ou instalador que roda diretamente no Windows.
                    </p>
                  </div>

                  <button
                    onClick={() => copyToClipboard(electronBuildCommands, 'electron')}
                    className="flex items-center space-x-1.5 bg-[#1a1d23] hover:bg-[#2d3139] text-white text-xs px-3 py-1.5 rounded-lg border border-[#2d3139] transition-colors cursor-pointer"
                  >
                    {copiedSection === 'electron' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Comandos</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-[#090b0e] p-3 rounded-xl border border-[#2d3139] font-mono text-[11px] text-emerald-400 overflow-x-auto">
                  <pre>{electronBuildCommands}</pre>
                </div>
                <p className="text-[11px] text-[#64748b]">
                  O arquivo gerado será salvo na pasta <code className="text-[#94a3b8]">dist_electron/Attribution-CRM-Setup.exe</code>, pronto para distribuir e instalar em qualquer PC.
                </p>
              </div>

              {/* Opção C: Executável Nativo Windows (Iniciar_CRM.exe) */}
              <div className="bg-[#0f1115] p-5 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded border border-indigo-500/30">
                      WINDOWS NATIVO (.EXE)
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white flex items-center space-x-2 mt-1">
                    <Play className="w-4 h-4 text-indigo-400" />
                    <span>Executável Windows Pronto (Iniciar_CRM.exe)</span>
                  </h4>
                  <p className="text-xs text-[#94a3b8] mt-1">
                    Baixe o arquivo executável <code className="text-indigo-300">Iniciar_CRM.exe</code> compilado em 64-bit. Dê 2 cliques para iniciar o servidor local e abrir no navegador direto.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <button
                    onClick={handleDownloadCrmExe}
                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Iniciar_CRM.exe</span>
                  </button>

                  <button
                    onClick={handleDownloadBat}
                    className="flex items-center space-x-2 bg-[#1a1d23] hover:bg-[#2d3139] text-[#cbd5e1] text-xs font-bold px-3 py-2 rounded-xl transition-all border border-[#2d3139] cursor-pointer"
                    title="Baixar alternativo .bat"
                  >
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                    <span>.BAT Alternativo</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PUBLICAR NO GITHUB */}
          {/* ========================================================= */}
          {activeTab === 'github_publish' && (
            <div className="space-y-5">
              <div className="bg-[#0f1115] p-5 rounded-2xl border border-[#2d3139] space-y-4">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center space-x-2">
                    <Github className="w-4 h-4 text-[#38bdf8]" />
                    <span>Publicação no Repositório do GitHub</span>
                  </h4>
                  <p className="text-xs text-[#94a3b8] mt-1">
                    Insira o link do seu repositório no GitHub para gerar os comandos prontos para publicar com 1 clique:
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#e2e8f0] mb-1">
                    URL do Repositório GitHub:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={e => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/SEU_USUARIO/attribution-crm.git"
                      className="flex-1 bg-[#1a1d23] text-white text-xs px-3 py-2 rounded-xl border border-[#2d3139] focus:border-[#38bdf8] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-white">Comandos para Rodar no Terminal:</span>
                  <button
                    onClick={() => copyToClipboard(gitCommands, 'git')}
                    className="flex items-center space-x-1.5 bg-[#1a1d23] hover:bg-[#2d3139] text-[#38bdf8] text-xs px-3 py-1.5 rounded-lg border border-[#2d3139] transition-colors cursor-pointer"
                  >
                    {copiedSection === 'git' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Comandos Copiados!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Todos os Comandos</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-[#090b0e] p-4 rounded-xl border border-[#2d3139] font-mono text-[11px] text-[#38bdf8] overflow-x-auto">
                  <pre>{gitCommands}</pre>
                </div>

                <div className="bg-[#1a1d23] p-3 rounded-xl border border-[#2d3139] space-y-1.5 text-xs text-[#94a3b8]">
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Como Disponibilizar o .EXE no GitHub para Download:</span>
                  </div>
                  <p>
                    1. No seu repositório no GitHub, clique na aba lateral direita <strong>"Releases"</strong> &gt; <strong>"Create a new release"</strong>.
                  </p>
                  <p>
                    2. Anexe o arquivo <code className="text-white">Attribution-CRM-Setup.exe</code> nos arquivos de download da Release.
                  </p>
                  <p>
                    3. Pronto! Qualquer pessoa da sua equipe comercial ou filiais poderá clicar e baixar o arquivo .exe para instalar no computador!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SALVAR TUDO NO PC (BACKUP & RESTORE) */}
          {/* ========================================================= */}
          {activeTab === 'local_save' && (
            <div className="space-y-5">
              
              {/* Status de Sincronização Local com Gravação Direta em Disco */}
              <div className="bg-emerald-950/30 p-5 rounded-2xl border border-emerald-500/40 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-sm font-black text-emerald-300 flex items-center space-x-2">
                        <span>Gravação Automática em Disco Permanente Ativa</span>
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/40">
                          data/crm_database.json
                        </span>
                      </div>
                      <div className="text-xs text-[#cbd5e1] mt-0.5">
                        Qualquer alteração (loja, vendedor, venda, diário de fluxo da vendedora chefe) é gravada imediatamente em arquivo físico no disco. <strong>Se o programa fechar, nada é perdido!</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveToDiskNow}
                    disabled={isSavingDisk}
                    className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-50"
                    title="Forçar gravação imediata de todos os dados no arquivo data/crm_database.json"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingDisk ? 'Gravando...' : 'Gravar no Disco Agora'}</span>
                  </button>
                </div>

                {/* Métricas e Detalhes do Arquivo */}
                <div className="bg-[#0f1115] p-3 rounded-xl border border-emerald-500/20 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#94a3b8] block">Status no Disco:</span>
                    <span className="font-bold text-emerald-400 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                      <span>{dbDiskStatus?.existsOnDisk ? 'Arquivo Presente' : 'Sincronizado'}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[#94a3b8] block">Última Gravação:</span>
                    <span className="font-mono text-white">
                      {dbDiskStatus?.lastSaved ? new Date(dbDiskStatus.lastSaved).toLocaleTimeString('pt-BR') : 'Tempo Real'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#94a3b8] block">Tamanho:</span>
                    <span className="font-mono text-white">
                      {dbDiskStatus?.fileSizeBytes ? `${(dbDiskStatus.fileSizeBytes / 1024).toFixed(1)} KB` : 'Ativo'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#94a3b8] block">Registros Salvos:</span>
                    <span className="font-mono text-emerald-300">
                      {dbDiskStatus?.counts ? `${dbDiskStatus.counts.sales} vendas / ${dbDiskStatus.counts.sellers} vend.` : '100% Salvo'}
                    </span>
                  </div>
                </div>

                {diskSaveMsg && (
                  <div className="bg-emerald-900/40 text-emerald-200 border border-emerald-500/40 p-2.5 rounded-xl text-xs font-bold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{diskSaveMsg}</span>
                  </div>
                )}
              </div>

              {/* Ação 1: Baixar e Salvar no Computador */}
              <div className="bg-[#0f1115] p-5 rounded-2xl border border-[#2d3139] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white flex items-center space-x-2">
                    <Save className="w-4 h-4 text-emerald-400" />
                    <span>1. Baixar Cópia Extra de Segurança (.JSON)</span>
                  </h4>
                  <p className="text-xs text-[#94a3b8] max-w-md">
                    Gera um arquivo completo de segurança em formato <code className="text-emerald-400 font-mono">.JSON</code> salvo na sua pasta Downloads para levar a outro computador.
                  </p>
                </div>

                <button
                  onClick={handleExportBackup}
                  disabled={isExporting}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Exportando...' : 'Salvar no Computador (.JSON)'}</span>
                </button>
              </div>

              {/* Ação 2: Restaurar / Carregar do Computador */}
              <div className="bg-[#0f1115] p-5 rounded-2xl border border-[#2d3139] space-y-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    <span>2. Restaurar Dados Salvos Anteriormente do Computador</span>
                  </h4>
                  <p className="text-xs text-[#94a3b8]">
                    Selecione um arquivo de backup <code className="text-indigo-300 font-mono">.JSON</code> salvo no seu computador para restaurar tudo instantaneamente.
                  </p>
                </div>

                <div className="pt-2">
                  <label className="flex items-center justify-center p-6 border-2 border-dashed border-[#2d3139] hover:border-indigo-500 rounded-xl cursor-pointer transition-colors bg-[#1a1d23]/50">
                    <div className="text-center space-y-2">
                      <FolderDown className="w-8 h-8 text-indigo-400 mx-auto" />
                      <div className="text-xs font-bold text-white">
                        Clique aqui para selecionar o arquivo de backup do seu PC
                      </div>
                      <div className="text-[11px] text-[#94a3b8]">
                        Formatos aceitos: .json
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>

                {importStatus && (
                  <div className={`p-3 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                    importStatus.startsWith('Sucesso')
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                  }`}>
                    {importStatus.startsWith('Sucesso') ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{importStatus}</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: PACOTE PYTHON OFFLINE (COLAB -> PC) */}
          {/* ========================================================= */}
          {activeTab === 'python_offline' && (
            <div className="space-y-6">
              
              {/* Destaque Principal com Download Direto do Executável Portátil */}
              <div className="bg-gradient-to-br from-amber-950/40 via-[#1a1d23] to-[#0f1115] p-6 rounded-2xl border border-amber-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-500/40">
                        EXECUTÁVEL PORTÁTIL .EXE (2 CLIQUES)
                      </span>
                      <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/40">
                        AUTO-SAVE PERMANENTE
                      </span>
                    </div>
                    <h4 className="text-base font-black text-white">
                      Aplicativo Portátil Offline com Salvamento Permanente
                    </h4>
                    <p className="text-xs text-[#cbd5e1] max-w-xl leading-relaxed">
                      Basta dar <strong>2 cliques</strong> no arquivo executável para abrir o programa. Todas as edições feitas na planilha interativa de clientes e predições são salvas automaticamente em <code className="text-amber-300">data/clientes.csv</code>. Se o programa fechar, <strong>nada se perde</strong>!
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    <button
                      onClick={handleDownloadIniciarExe}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer"
                      title="Baixar executável portátil iniciar_programa.exe (apenas 2 cliques para abrir no Windows)"
                    >
                      <Play className="w-4 h-4 fill-black" />
                      <span>Baixar iniciar_programa.exe</span>
                    </button>

                    <button
                      onClick={handleDownloadOfflineZip}
                      disabled={isDownloadingZip}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer"
                      title="Baixar pacote completo em ZIP contendo o executável, planilha data/clientes.csv e app.py"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isDownloadingZip ? 'Gerando ZIP...' : 'Baixar Pacote .ZIP Completo'}</span>
                    </button>
                  </div>
                </div>

                {/* 3 Passos Rápidos */}
                <div className="pt-3 border-t border-[#2d3139] grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#0f1115] p-3 rounded-xl border border-[#2d3139] space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                      <span className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">1</span>
                      <span>Baixar o Pacote .ZIP</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8]">
                      Baixe o <code className="text-amber-300">meu_app_offline.zip</code> e extraia em qualquer pasta (Área de Trabalho ou Documentos).
                    </p>
                  </div>

                  <div className="bg-[#0f1115] p-3 rounded-xl border border-[#2d3139] space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">2</span>
                      <span>2 Cliques no .EXE</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8]">
                      Dê dois cliques no <code className="text-emerald-300">iniciar_programa.exe</code>. O programa abre automaticamente no navegador!
                    </p>
                  </div>

                  <div className="bg-[#0f1115] p-3 rounded-xl border border-[#2d3139] space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-400">
                      <span className="w-4 h-4 rounded-full bg-sky-500/20 flex items-center justify-center text-[10px]">3</span>
                      <span>Edição com Auto-Save</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8]">
                      Edite a planilha diretamente na tela. Tudo é salvo em tempo real. Pode fechar o app quando quiser sem perder nada!
                    </p>
                  </div>
                </div>
              </div>

              {/* Destaque do Recurso de Salvamento de Arquivos */}
              <div className="bg-[#0f1115] p-5 rounded-2xl border border-[#2d3139] space-y-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-black text-white">
                    Como Funciona o Salvamento Permanente de Arquivos
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#14171d] p-3 rounded-xl border border-[#2d3139] space-y-1.5">
                    <div className="font-bold text-emerald-400 flex items-center space-x-1.5">
                      <Save className="w-3.5 h-3.5" />
                      <span>Aba de Edição Direta de Planilha</span>
                    </div>
                    <p className="text-[11px] text-[#cbd5e1]">
                      Dentro do app há uma aba <strong>"Editar e Cadastrar Clientes"</strong> com uma tabela interativa. Ao clicar em <strong>"Salvar Alterações na Planilha"</strong>, o arquivo <code className="text-amber-300 font-mono">data/clientes.csv</code> é regravado na hora.
                    </p>
                  </div>

                  <div className="bg-[#14171d] p-3 rounded-xl border border-[#2d3139] space-y-1.5">
                    <div className="font-bold text-sky-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Se o Programa Fechar, Nada Se Perde</span>
                    </div>
                    <p className="text-[11px] text-[#cbd5e1]">
                      Tanto a planilha quanto o banco em JSON <code className="text-sky-300 font-mono">data/banco_offline.json</code> guardam os novos clientes e as previsões geradas. Ao reabrir o programa, todos os dados continuam lá intactos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Estrutura de Pastas Gerada */}
              <div className="bg-[#0f1115] p-5 rounded-2xl border border-[#2d3139] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Arquivos Criados e Incluídos no Pacote</span>
                  </h4>
                  <span className="text-[11px] text-[#94a3b8]">Pasta: <code className="text-amber-300">/meu_app_offline/</code></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#14171d] p-3 rounded-xl border border-[#2d3139] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-400">app.py</span>
                      <span className="text-[10px] bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded">Principal</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8]">
                      Interface Gradio, modelo Random Forest local, caminhos relativos e fallback mockado offline.
                    </p>
                  </div>

                  <div className="bg-[#14171d] p-3 rounded-xl border border-[#2d3139] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-emerald-400">run.bat</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded">Windows</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8]">
                      Script de inicialização com 2 cliques: instala requirements.txt e executa app.py.
                    </p>
                  </div>

                  <div className="bg-[#14171d] p-3 rounded-xl border border-[#2d3139] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sky-400">requirements.txt</span>
                      <span className="text-[10px] bg-sky-500/10 text-sky-300 px-1.5 py-0.5 rounded">Dependências</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8]">
                      Gradio, Pandas, Scikit-Learn, NumPy, python-dotenv e joblib com versões fixadas.
                    </p>
                  </div>

                  <div className="bg-[#14171d] p-3 rounded-xl border border-[#2d3139] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-purple-400">README.md</span>
                      <span className="text-[10px] bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded">Manual</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8]">
                      Instruções detalhadas para usuários comuns, incluindo como marcar o Python no PATH.
                    </p>
                  </div>

                  <div className="bg-[#14171d] p-3 rounded-xl border border-[#2d3139] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-indigo-400">data/</span>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded">Entrada</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8]">
                      Pasta exclusiva para colocar seus arquivos CSV, modelos (.pkl/.h5) e bases de dados.
                    </p>
                  </div>

                  <div className="bg-[#14171d] p-3 rounded-xl border border-[#2d3139] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-rose-400">outputs/</span>
                      <span className="text-[10px] bg-rose-500/10 text-rose-300 px-1.5 py-0.5 rounded">Saída</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8]">
                      Pasta onde o app grava automaticamente os históricos e relatórios gerados.
                    </p>
                  </div>
                </div>
              </div>

              {/* Guia de Publicação no GitHub */}
              <div className="bg-[#0f1115] p-5 rounded-2xl border border-[#2d3139] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white flex items-center space-x-2">
                    <Github className="w-4 h-4 text-[#38bdf8]" />
                    <span>Como Subir para o GitHub e Disponibilizar o ZIP</span>
                  </h4>
                  <button
                    onClick={() => copyToClipboard(
                      `git init\ngit add .\ngit commit -m "feat: app python 100% offline"\ngit branch -M main\ngit remote add origin ${repoUrl}\ngit push -u origin main`,
                      'git_offline'
                    )}
                    className="flex items-center space-x-1.5 bg-[#1a1d23] hover:bg-[#2d3139] text-[#38bdf8] text-xs px-3 py-1.5 rounded-lg border border-[#2d3139] transition-colors cursor-pointer"
                  >
                    {copiedSection === 'git_offline' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Comandos Git</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-[#090b0e] p-3 rounded-xl border border-[#2d3139] font-mono text-[11px] text-[#38bdf8] overflow-x-auto">
                  <pre>{`cd meu_app_offline
git init
git add .
git commit -m "feat: app python 100% offline"
git branch -M main
git remote add origin ${repoUrl}
git push -u origin main`}</pre>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-[#0f1115] p-4 border-t border-[#2d3139] flex items-center justify-between">
          <span className="text-xs text-[#64748b]">
            Compatível com Windows 10/11, macOS e Linux
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1a1d23] hover:bg-[#2d3139] text-[#e2e8f0] text-xs font-bold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
