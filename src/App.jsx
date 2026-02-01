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
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">WY-Index</h1>
          <p className="text-sm text-gray-600 mt-1">
            지역 현황 분석 및 사업계획서 근거 자료 생성
          </p>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 지역 선택 */}
        <RegionSelector onRegionSelect={handleRegionSelect} />

        {/* 로딩 상태 */}
        {loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">분석 중...</p>
          </div>
        )}

        {/* 에러 표시 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* 분석 결과 */}
        {!loading && analysisData && (
          <>
            {/* 통계 요약 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">
                {analysisData.regionName} 분석 결과
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">5년 인구변화율</p>
                  <p className={`text-2xl font-bold ${
                    analysisData.cagr < 0 ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {analysisData.cagr > 0 ? '+' : ''}{analysisData.cagr}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">고령화율</p>
                  <p className={`text-2xl font-bold ${
                    analysisData.elderlyRatio >= 20 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {analysisData.elderlyRatio}%
                  </p>
                </div>
              </div>
            </div>

            {/* 인구 추이 차트 */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-4">인구 추이</h2>
                <Chart data={chartData} />
              </div>
            )}

            {/* 생성된 텍스트 미리보기 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">분석 결과 텍스트</h2>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm leading-relaxed">
                {copyText}
              </div>
            </div>

            {/* 복사 버튼 - 하단 고정 스타일 */}
            <div className="sticky bottom-4">
              <CopyButton text={copyText} />
            </div>
          </>
        )}
      </main>

      {/* 푸터 */}
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        데이터 출처: 통계청 KOSIS
      </footer>
    </div>
  );
}

export default App;
