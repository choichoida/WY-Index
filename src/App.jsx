import { useState, useCallback } from 'react';
import { RegionSelector } from './components/RegionSelector';
import { Chart } from './components/Chart';
import { CopyButton } from './components/CopyButton';
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xl">W</div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">WY-Index</h1>
          </div>
          <p className="hidden sm:block text-sm text-slate-500 font-medium">
            지역 현황 분석 리포트 생성기
          </p>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* 히어로 섹션 */}
        <div className="text-center py-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            어떤 지역을 분석할까요?
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            원하는 지역을 선택하면 인구 현황과 고령화율을 분석하여<br className="hidden sm:block" />
            사업계획서에 바로 사용할 수 있는 텍스트를 생성해 드립니다.
          </p>
        </div>

        {/* 지역 선택 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1">
          <RegionSelector onRegionSelect={handleRegionSelect} />
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-primary-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium animate-pulse">데이터를 분석하고 리포트를 생성 중입니다...</p>
          </div>
        )}

        {/* 에러 표시 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-500 text-4xl mb-3">⚠️</div>
            <h3 className="text-red-800 font-semibold text-lg mb-1">오류가 발생했습니다</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* 분석 결과 */}
        {!loading && analysisData && (
          <div className="space-y-6 animate-fade-in-up">

            {/* 상단 요약 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">5년 연평균 인구증감률 (CAGR)</span>
                <div className={`text-4xl font-bold mb-2 ${analysisData.cagr < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {analysisData.cagr > 0 ? '+' : ''}{analysisData.cagr}%
                </div>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${analysisData.cagr < 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                  {analysisData.cagr < 0 ? '감소 추세 📉' : '성장 추세 📈'}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">고령화율 (65세 이상 비율)</span>
                <div className={`text-4xl font-bold mb-2 ${analysisData.elderlyRatio >= 20 ? 'text-amber-500' : 'text-slate-700'}`}>
                  {analysisData.elderlyRatio}%
                </div>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${analysisData.elderlyRatio >= 20 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                  {analysisData.elderlyRatio >= 20 ? '초고령사회 진입 ⚠️' : '일반 수준'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 차트 영역 */}
              {chartData.length > 0 && (
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                    <span className="w-1.5 h-6 bg-primary-600 rounded-full mr-3"></span>
                    인구 변화 추이
                  </h3>
                  <div className="h-[300px] w-full">
                    <Chart data={chartData} />
                  </div>
                </div>
              )}

              {/* 텍스트 생성 영역 */}
              <div className="lg:col-span-1 bg-slate-900 rounded-2xl shadow-lg p-6 text-white flex flex-col">
                <h3 className="text-lg font-bold mb-4 flex items-center text-slate-100">
                  <span className="mr-2">📝</span>
                  분석 리포트 요약
                </h3>
                <div className="bg-slate-800/50 rounded-xl p-4 text-slate-300 text-sm leading-relaxed flex-grow overflow-y-auto max-h-[400px] font-medium border border-slate-700/50">
                  {copyText}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <CopyButton text={copyText} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="border-t border-slate-200 mt-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© 2024 WY-Index. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            Data provided by <span className="font-bold text-slate-700">KOSIS</span> (통계청)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
