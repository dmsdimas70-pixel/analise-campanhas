import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SimpleOverviewDashboard } from './components/SimpleOverviewDashboard';
import { TrafficReportsView } from './components/TrafficReportsView';
import { InstagramGrowthView } from './components/InstagramGrowthView';
import { ReportGeneratorModal } from './components/ReportGeneratorModal';
import { CompanyManageModal } from './components/CompanyManageModal';
import { ArrivalLevelTrackerChart } from './components/ArrivalLevelTrackerChart';
import { CampaignsPerformanceChart } from './components/CampaignsPerformanceChart';
import { DoubleFunnelSankeyChart } from './components/DoubleFunnelSankeyChart';
import { TimeSeriesTimelineChart } from './components/TimeSeriesTimelineChart';
import { AttributionTreemapChart } from './components/AttributionTreemapChart';
import { CustomerJourneyDetail } from './components/CustomerJourneyDetail';
import { SalesTableAndReferrals } from './components/SalesTableAndReferrals';
import { AIPredictionDrawer } from './components/AIPredictionDrawer';
import { SqlAndArchitectureModal } from './components/SqlAndArchitectureModal';
import { AddLeadSaleModal } from './components/AddLeadSaleModal';
import { DailyStoreTrafficView } from './components/DailyStoreTrafficView';
import { DesktopAndGithubModal } from './components/DesktopAndGithubModal';
import { 
  FunnelMetricsResponse, 
  TimelineMetricsResponse, 
  AttributionTreeResponse,
  ArrivalLevelsResponse,
  ArrivalLevel,
  Company
} from './types';
import { 
  BarChart3, 
  UserCheck, 
  Sparkles, 
  Database, 
  Smartphone, 
  Layers, 
  ArrowUpRight, 
  TrendingUp, 
  Share2, 
  Zap, 
  CheckCircle2,
  Plus,
  Target,
  FileText,
  Instagram,
  Building2,
  Users,
  Store,
  Monitor
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'store_traffic' | 'instagram' | 'sales' | 'journey' | 'ai' | 'docs'>('dashboard');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  // Multi-Company State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('empresa-1');
  const [isManageCompanyModalOpen, setIsManageCompanyModalOpen] = useState(false);
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);

  // Date filters
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2027-12-31');
  const [productFilter, setProductFilter] = useState('all');
  const [groupBy, setGroupBy] = useState<'month' | 'week'>('month');

  // Interactive Level & Campaign Filter
  const [selectedLevel, setSelectedLevel] = useState<ArrivalLevel | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalSalesCount, setTotalSalesCount] = useState(0);

  // Metrics Data
  const [arrivalData, setArrivalData] = useState<ArrivalLevelsResponse | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelMetricsResponse | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineMetricsResponse | null>(null);
  const [attributionData, setAttributionData] = useState<AttributionTreeResponse | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchAllMetrics();
  }, [startDate, endDate, productFilter, groupBy, selectedCompanyId]);

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/companies');
      if (res.ok) {
        const data: Company[] = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
        if (data && data.length > 0 && !selectedCompanyId) {
          setSelectedCompanyId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const fetchAllMetrics = async () => {
    setIsLoading(true);
    try {
      const companyPart = selectedCompanyId ? `&company_id=${selectedCompanyId}` : '';
      const companyOnly = selectedCompanyId ? `company_id=${selectedCompanyId}` : '';
      const queryParams = `startDate=${startDate}&endDate=${endDate}&product=${productFilter}${companyPart}`;
      
      const [arrivalRes, funnelRes, timelineRes, attributionRes, salesRes] = await Promise.all([
        fetch(`/api/metrics/arrival-levels?${queryParams}`),
        fetch(`/api/metrics/conversion-funnel?${queryParams}`),
        fetch(`/api/metrics/timeline?group_by=${groupBy}&${queryParams}`),
        fetch(`/api/metrics/attribution-tree?${queryParams}`),
        fetch(`/api/sales?${companyOnly}`)
      ]);

      const [arrivalJson, funnelJson, timelineJson, attributionJson, salesJson] = await Promise.all([
        arrivalRes.json(),
        funnelRes.json(),
        timelineRes.json(),
        attributionRes.json(),
        salesRes.json()
      ]);

      setArrivalData(arrivalJson);
      setFunnelData(funnelJson);
      setTimelineData(timelineJson);
      setAttributionData(attributionJson);
      setTotalSalesCount(Array.isArray(salesJson) ? salesJson.length : 0);
    } catch (err) {
      console.error('Error fetching metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetData = async (mode: 'empty' | 'seed') => {
    setIsLoading(true);
    try {
      await fetch('/api/reset-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      });
      await fetchCompanies();
      await fetchAllMetrics();
    } catch (err) {
      console.error('Error resetting data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Advanced Technical Charts (accessible via toggle in SimpleOverviewDashboard)
  const renderAdvancedCharts = () => (
    <div className="space-y-6">
      {/* Gráfico 1: Níveis de Chegada (Nível 1 ao Nível 5) */}
      <ArrivalLevelTrackerChart
        arrivalData={arrivalData}
        selectedLevel={selectedLevel}
        onSelectLevel={(lvl) => {
          setSelectedLevel(lvl);
          if (lvl) {
            setActiveTab('sales');
          }
        }}
      />

      {/* Gráfico 2: Desempenho & Origem por Campanha */}
      <CampaignsPerformanceChart
        startDate={startDate}
        endDate={endDate}
        selectedCompanyId={selectedCompanyId}
        selectedCampaign={selectedCampaign}
        onSelectCampaign={(camp) => {
          setSelectedCampaign(camp);
          if (camp) {
            setActiveTab('sales');
          }
        }}
      />

      {/* Gráfico 3: Double Funnel & Sankey */}
      <DoubleFunnelSankeyChart
        metrics={funnelData}
        selectedStage={selectedStage}
        onSelectStage={stage => {
          setSelectedStage(stage);
        }}
      />

      {/* Grid: Linha do Tempo & Treemap de Origem */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeSeriesTimelineChart
          timelineData={timelineData}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
        />
        <AttributionTreemapChart
          attributionData={attributionData}
        />
      </div>
    </div>
  );

  // Main Dashboard Content - Simplified & Clear for everyday users
  const renderDashboard = () => (
    <SimpleOverviewDashboard
      funnelMetrics={funnelData}
      arrivalData={arrivalData}
      timelineData={timelineData}
      attributionData={attributionData}
      selectedCompanyId={selectedCompanyId}
      onOpenAddModal={() => setIsAddModalOpen(true)}
      onOpenReportModal={() => setIsReportModalOpen(true)}
      onGoToStoreTraffic={() => setActiveTab('store_traffic')}
      onGoToSales={() => setActiveTab('sales')}
      onGoToInstagram={() => setActiveTab('instagram')}
      renderAdvancedCharts={renderAdvancedCharts}
    />
  );

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#e2e8f0] flex flex-col font-sans selection:bg-[#6366f1] selection:text-white">
      {/* Navigation and Filter Header with Multi-Company Selector */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        productFilter={productFilter}
        setProductFilter={setProductFilter}
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        onSelectCompany={(cId) => setSelectedCompanyId(cId)}
        onOpenManageCompanies={() => setIsManageCompanyModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenDesktopModal={() => setIsDesktopModalOpen(true)}
        onRefresh={fetchAllMetrics}
        onResetData={handleResetData}
        isLoading={isLoading}
        totalSalesCount={totalSalesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-2.5 sm:p-5 max-w-7xl w-full mx-auto">
        {deviceMode === 'mobile' ? (
          /* Mobile Simulator Frame */
          <div className="flex justify-center py-3">
            <div className="w-full max-w-[420px] bg-[#1a1d23] rounded-[40px] p-2.5 border-2 border-[#2d3139] shadow-xl relative">
              <div className="w-28 h-4 bg-[#0f1115] rounded-b-xl mx-auto mb-2 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-[#2d3139] rounded-full"></div>
                <div className="w-8 h-1 bg-[#2d3139] rounded-full"></div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#94a3b8] px-4 mb-2 font-mono">
                <span>09:41</span>
                <span className="flex items-center space-x-1">
                  <span>5G</span>
                  <span className="font-bold text-[#e2e8f0]">100%</span>
                </span>
              </div>

              <div className="bg-[#0f1115] rounded-[28px] p-2.5 overflow-y-auto max-h-[750px] custom-scrollbar border border-[#2d3139] space-y-4">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'store_traffic' && (
                  <DailyStoreTrafficView 
                    selectedCompanyId={selectedCompanyId} 
                    onOpenAddModal={() => setIsAddModalOpen(true)} 
                  />
                )}
                {activeTab === 'reports' && (
                  <TrafficReportsView 
                    onOpenAddModal={() => setIsAddModalOpen(true)} 
                    selectedCompanyId={selectedCompanyId}
                  />
                )}
                {activeTab === 'instagram' && (
                  <InstagramGrowthView 
                    onOpenAddModal={() => setIsAddModalOpen(true)} 
                    selectedCompanyId={selectedCompanyId}
                  />
                )}
                {activeTab === 'sales' && (
                  <SalesTableAndReferrals
                    onOpenAddModal={() => setIsAddModalOpen(true)}
                    onRefreshMetrics={fetchAllMetrics}
                    selectedCompanyId={selectedCompanyId}
                    selectedLevelFilter={selectedLevel}
                    selectedCampaignFilter={selectedCampaign}
                    onOpenManageTeam={() => setIsManageCompanyModalOpen(true)}
                  />
                )}
                {activeTab === 'journey' && <CustomerJourneyDetail />}
                {activeTab === 'ai' && <AIPredictionDrawer />}
                {activeTab === 'docs' && <SqlAndArchitectureModal />}
              </div>

              <div className="w-24 h-1 bg-[#475569] rounded-full mx-auto mt-2.5"></div>
            </div>
          </div>
        ) : (
          /* Desktop BI Dashboard View */
          <div className="space-y-5">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'store_traffic' && (
              <DailyStoreTrafficView 
                selectedCompanyId={selectedCompanyId} 
                onOpenAddModal={() => setIsAddModalOpen(true)} 
              />
            )}
            {activeTab === 'reports' && (
              <TrafficReportsView 
                onOpenAddModal={() => setIsAddModalOpen(true)} 
                selectedCompanyId={selectedCompanyId}
              />
            )}
            {activeTab === 'instagram' && (
              <InstagramGrowthView 
                onOpenAddModal={() => setIsAddModalOpen(true)} 
                selectedCompanyId={selectedCompanyId}
              />
            )}
            {activeTab === 'sales' && (
              <SalesTableAndReferrals
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onRefreshMetrics={fetchAllMetrics}
                selectedCompanyId={selectedCompanyId}
                selectedLevelFilter={selectedLevel}
                selectedCampaignFilter={selectedCampaign}
                onOpenManageTeam={() => setIsManageCompanyModalOpen(true)}
              />
            )}
            {activeTab === 'journey' && <CustomerJourneyDetail />}
            {activeTab === 'ai' && <AIPredictionDrawer />}
            {activeTab === 'docs' && <SqlAndArchitectureModal />}
          </div>
        )}
      </main>

      {/* Add Lead / Sale Modal */}
      <AddLeadSaleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchAllMetrics}
        selectedCompanyId={selectedCompanyId}
      />

      {/* Report Generator Modal */}
      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        selectedCompanyId={selectedCompanyId}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />

      {/* Manage Companies & Sellers Modal */}
      <CompanyManageModal
        isOpen={isManageCompanyModalOpen}
        onClose={() => setIsManageCompanyModalOpen(false)}
        selectedCompanyId={selectedCompanyId}
        onSelectCompany={(cId) => setSelectedCompanyId(cId)}
        onCompaniesChanged={() => {
          fetchCompanies();
          fetchAllMetrics();
        }}
      />

      {/* Desktop & GitHub Setup & Local Backup Modal */}
      <DesktopAndGithubModal
        isOpen={isDesktopModalOpen}
        onClose={() => setIsDesktopModalOpen(false)}
        onRefreshMetrics={fetchAllMetrics}
      />
    </div>
  );
}
