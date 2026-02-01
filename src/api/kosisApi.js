// KOSIS API interaction logic
const BASE_URL = '/api/kosis'; // Vite proxy 경유
const API_KEY = import.meta.env.VITE_KOSIS_API_KEY;
const ORG_ID = '101'; // 통계청

// 테이블 ID 상수
const TABLE_IDS = {
  POPULATION_SIGUNGU: 'DT_1B04001',    // 시군구별 주민등록인구
  POPULATION_BY_AGE: 'DT_1B04005N',    // 연령별 인구 (고령화율 계산용)
};

/**
 * KOSIS API 공통 호출 함수
 */
const fetchKosisData = async (tblId, params = {}) => {
  if (!API_KEY) {
    throw new Error('KOSIS API Key가 설정되지 않았습니다. .env 파일을 확인하세요.');
  }

  const queryParams = new URLSearchParams({
    method: 'getList',
    apiKey: API_KEY,
    format: 'json',
    jsonVD: 'Y',
    orgId: ORG_ID,
    tblId,
    ...params,
  });

  const response = await fetch(`${BASE_URL}?${queryParams}`);

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  const data = await response.json();

  // KOSIS API 에러 응답 체크
  if (data.err) {
    throw new Error(`KOSIS 오류: ${data.err}`);
  }

  return data;
};

/**
 * 시도 목록 조회
 */
export const fetchSidoList = async () => {
  const data = await fetchKosisData(TABLE_IDS.POPULATION_SIGUNGU, {
    prdSe: 'Y',           // 연간
    startPrdDe: '2024',   // 최신 연도
    endPrdDe: '2024',
  });

  // 시도 코드는 2자리 (예: 11 서울, 26 부산)
  const sidoSet = new Map();
  data.forEach(item => {
    const code = item.C1;
    if (code && code.length >= 2) {
      const sidoCode = code.substring(0, 2);
      if (!sidoSet.has(sidoCode)) {
        sidoSet.set(sidoCode, {
          code: sidoCode,
          name: item.C1_NM?.split(' ')[0] || sidoCode,
        });
      }
    }
  });

  return Array.from(sidoSet.values());
};

/**
 * 시군구 목록 조회 (시도 선택 후)
 */
export const fetchSigunguList = async (sidoCode) => {
  const data = await fetchKosisData(TABLE_IDS.POPULATION_SIGUNGU, {
    prdSe: 'Y',
    startPrdDe: '2024',
    endPrdDe: '2024',
  });

  // 해당 시도에 속한 시군구 필터링 (5자리 코드)
  const sigunguSet = new Map();
  data.forEach(item => {
    const code = item.C1;
    if (code && code.startsWith(sidoCode) && code.length === 5) {
      if (!sigunguSet.has(code)) {
        sigunguSet.set(code, {
          code,
          name: item.C1_NM || code,
        });
      }
    }
  });

  return Array.from(sigunguSet.values());
};

/**
 * 읍면동 목록 조회 (시군구 선택 후)
 * 참고: DT_1B04001은 시군구까지만 제공. 읍면동은 별도 테이블 필요할 수 있음
 */
export const fetchEupmyeondongList = async (sigunguCode) => {
  const data = await fetchKosisData(TABLE_IDS.POPULATION_SIGUNGU, {
    prdSe: 'Y',
    startPrdDe: '2024',
    endPrdDe: '2024',
  });

  // 해당 시군구에 속한 읍면동 필터링 (8자리 이상 코드)
  const emdSet = new Map();
  data.forEach(item => {
    const code = item.C1;
    if (code && code.startsWith(sigunguCode) && code.length > 5) {
      if (!emdSet.has(code)) {
        emdSet.set(code, {
          code,
          name: item.C1_NM || code,
        });
      }
    }
  });

  return Array.from(emdSet.values());
};

/**
 * 특정 지역의 5개년 인구 데이터 조회
 */
export const fetchPopulationTrend = async (regionCode) => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 5;

  const data = await fetchKosisData(TABLE_IDS.POPULATION_SIGUNGU, {
    prdSe: 'Y',
    startPrdDe: String(startYear),
    endPrdDe: String(currentYear),
  });

  // 해당 지역코드의 연도별 인구 추출
  const populationByYear = {};
  data.forEach(item => {
    if (item.C1 === regionCode) {
      const year = item.PRD_DE;
      const population = parseInt(item.DT, 10) || 0;
      populationByYear[year] = population;
    }
  });

  return populationByYear;
};

/**
 * 고령화율 계산 (65세 이상 인구 비율)
 */
export const fetchElderlyRatio = async (regionCode) => {
  const data = await fetchKosisData(TABLE_IDS.POPULATION_BY_AGE, {
    prdSe: 'Y',
    startPrdDe: '2024',
    endPrdDe: '2024',
  });

  let totalPopulation = 0;
  let elderlyPopulation = 0;

  data.forEach(item => {
    if (item.C1 === regionCode) {
      const age = parseInt(item.C2, 10); // 연령 코드
      const population = parseInt(item.DT, 10) || 0;

      totalPopulation += population;
      if (age >= 65) {
        elderlyPopulation += population;
      }
    }
  });

  return totalPopulation > 0
    ? Math.round((elderlyPopulation / totalPopulation) * 100 * 10) / 10
    : 0;
};

/**
 * CAGR (연평균 성장률) 계산
 */
export const calculateCAGR = (populationByYear) => {
  const years = Object.keys(populationByYear).sort();
  if (years.length < 2) return 0;

  const startYear = years[0];
  const endYear = years[years.length - 1];
  const startPop = populationByYear[startYear];
  const endPop = populationByYear[endYear];
  const yearsDiff = parseInt(endYear) - parseInt(startYear);

  if (startPop <= 0 || yearsDiff <= 0) return 0;

  const cagr = (Math.pow(endPop / startPop, 1 / yearsDiff) - 1) * 100;
  return Math.round(cagr * 100) / 100; // 소수점 2자리
};
