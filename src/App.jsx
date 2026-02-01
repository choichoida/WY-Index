import { useState, useCallback } from 'react';
import { RegionSelector } from './components/RegionSelector';
import { Chart } from './components/Chart';
import { CopyButton } from './components/CopyButton';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/Dashboard';
import { Home, Search, BarChart2, FileText } from 'lucide-react';
import { generateCopy } from './utils/textGenerator';
import {
  fetchPopulationTrend,
  fetchElderlyRatio,
  calculateCAGR,
} from './api/kosisApi';
import './App.css';

function App() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 지역 선택 시 분석 데이터 로드
  const handleRegionSelect = useCallback(async (region) => {
    setSelectedRegion(region);
    setLoading(true);
    setError(null);

    try {
      // 인구 추이 및 고령화율 병렬 조회
      const [populationByYear, elderlyRatio] = await Promise.all([
        fetchPopulationTrend(region.code),
        fetchElderlyRatio(region.code),
      ]);

      // CAGR 계산
      const cagr = calculateCAGR(populationByYear);

      // 차트 데이터 변환
      const chartDataFormatted = Object.entries(populationByYear)
        .map(([year, population]) => ({
          year,
          population,
        }))
        .sort((a, b) => a.year.localeCompare(b.year));

      setChartData(chartDataFormatted);
      setAnalysisData({
        regionName: region.name,
        cagr,
        elderlyRatio,
      });
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 생성된 복사용 텍스트
  const copyText = analysisData ? generateCopy(analysisData) : '';

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col">
      <Header />

      <div className="flex flex-1 pt-[64px]">
        <Sidebar />

        <main className="flex-1 ml-[250px] p-8 bg-slate-50 min-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto">

            <p className="flex items-center gap-2 text-xs text-slate-400 mb-4 justify-end">
              <Home size={12} />
              <span>홈</span>
              <span className="text-slate-300">/</span>
              <span>통계정보</span>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-slate-600">기초생활보장</span>
            </p>

            <Dashboard>
              {/* Original Analysis Content Wrapped */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Region Selector */}
                <div className="lg:col-span-4">
                  <RegionSelector onRegionSelect={handleRegionSelect} />
                </div>

                {/* Right: Results or Placeholder */}
                <div className="lg:col-span-8">
                  {!selectedRegion ? (
                    <div className="h-full bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-400 p-12 text-center min-h-[400px]">
                      <Search size={48} className="mb-4 text-slate-300" />
                      <p className="text-lg font-medium text-slate-600 mb-2">분석할 지역을 선택해주세요</p>
                      <p className="text-sm">좌측 메뉴에서 시/도, 시/군/구를 선택하면<br />자동으로 분석 결과가 표시됩니다.</p>
                    </div>
                  ) : loading ? (
                    <div className="h-full bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[400px]">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-primary mx-auto mb-4"></div>
                      <p className="text-slate-600 font-medium animate-pulse">데이터 분석 중...</p>
                    </div>
                  ) : error ? (
                    <div className="h-full bg-white rounded-2xl border border-red-200 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                      <div className="text-red-500 text-4xl mb-3">⚠️</div>
                      <p className="text-red-600">{error}</p>
                    </div>
                  ) : analysisData && (
                    <div className="space-y-6 animate-fade-in-up">
                      {/* Result Cards */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">5년 연평균 인구증감률</span>
                          <div className={`text-4xl font-bold font-number mb-2 ${analysisData.cagr < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {analysisData.cagr > 0 ? '+' : ''}{analysisData.cagr}%
                          </div>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${analysisData.cagr < 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {analysisData.cagr < 0 ? '감소 추세 📉' : '성장 추세 📈'}
                          </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">고령화율</span>
                          <div className={`text-4xl font-bold font-number mb-2 ${analysisData.elderlyRatio >= 20 ? 'text-amber-500' : 'text-slate-700'}`}>
                            {analysisData.elderlyRatio}%
                          </div>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${analysisData.elderlyRatio >= 20 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                            {analysisData.elderlyRatio >= 20 ? '초고령사회 진입 ⚠️' : '일반 수준'}
                          </div>
                        </div>
                      </div>

                      {/* Chart & Report */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <BarChart2 size={18} className="text-slate-400" />
                            인구 변화 추이
                          </h3>
                        </div>
                        <div className="h-[250px] w-full">
                          <Chart data={chartData} />
                        </div>
                      </div>

                      <div className="bg-slate-900 rounded-2xl shadow-lg p-6 text-white flex flex-col">
                        <h3 className="text-sm font-bold mb-4 flex items-center text-slate-100 gap-2">
                          <FileText size={16} />
                          분석 리포트 생성 결과
                        </h3>
                        <div className="bg-slate-800/50 rounded-xl p-4 text-slate-300 text-sm leading-relaxed flex-grow overflow-y-auto max-h-[200px] font-medium border border-slate-700/50 mb-4">
                          {copyText}
                        </div>
                        <CopyButton text={copyText} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Dashboard>
          </div>
          <footer className="mt-12 text-center text-xs text-slate-400 pb-8">
            <p>Copyright © 2025 Eight Project. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
