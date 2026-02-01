import { useState, useEffect } from 'react';
import {
    fetchSidoList,
    fetchSigunguList,
    fetchEupmyeondongList,
} from '../api/kosisApi';

/**
 * 3단계 지역 선택 컴포넌트
 * 모바일 터치 최적화: 최소 44px 터치 타겟
 */
export const RegionSelector = ({ onRegionSelect }) => {
    // 선택 상태
    const [selectedSido, setSelectedSido] = useState(null);
    const [selectedSigungu, setSelectedSigungu] = useState(null);
    const [selectedEmd, setSelectedEmd] = useState(null);

    // 목록 데이터
    const [sidoList, setSidoList] = useState([]);
    const [sigunguList, setSigunguList] = useState([]);
    const [emdList, setEmdList] = useState([]);

    // 로딩/에러 상태
    const [loading, setLoading] = useState({ sido: false, sigungu: false, emd: false });
    const [error, setError] = useState(null);

    // Step 1: 시도 목록 로드
    useEffect(() => {
        const loadSido = async () => {
            setLoading(prev => ({ ...prev, sido: true }));
            setError(null);
            try {
                const data = await fetchSidoList();
                setSidoList(data);
            } catch (err) {
                setError('시도 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
                console.error(err);
            } finally {
                setLoading(prev => ({ ...prev, sido: false }));
            }
        };
        loadSido();
    }, []);

    // Step 2: 시도 선택 시 시군구 로드
    useEffect(() => {
        if (!selectedSido) {
            setSigunguList([]);
            return;
        }

        const loadSigungu = async () => {
            setLoading(prev => ({ ...prev, sigungu: true }));
            setSelectedSigungu(null);
            setSelectedEmd(null);
            setEmdList([]);
            try {
                const data = await fetchSigunguList(selectedSido.code);
                setSigunguList(data);
            } catch (err) {
                setError('시군구 목록을 불러오는데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(prev => ({ ...prev, sigungu: false }));
            }
        };
        loadSigungu();
    }, [selectedSido]);

    // Step 3: 시군구 선택 시 읍면동 로드
    useEffect(() => {
        if (!selectedSigungu) {
            setEmdList([]);
            return;
        }

        const loadEmd = async () => {
            setLoading(prev => ({ ...prev, emd: true }));
            setSelectedEmd(null);
            try {
                const data = await fetchEupmyeondongList(selectedSigungu.code);
                setEmdList(data);

                // 읍면동 데이터가 없으면 시군구 레벨에서 분석 진행
                if (data.length === 0 && onRegionSelect) {
                    onRegionSelect({
                        code: selectedSigungu.code,
                        name: `${selectedSido.name} ${selectedSigungu.name}`,
                    });
                }
            } catch (err) {
                setError('읍면동 목록을 불러오는데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(prev => ({ ...prev, emd: false }));
            }
        };
        loadEmd();
    }, [selectedSigungu, selectedSido, onRegionSelect]);

    // 읍면동 선택 완료
    useEffect(() => {
        if (selectedEmd && onRegionSelect) {
            onRegionSelect({
                code: selectedEmd.code,
                name: `${selectedSido.name} ${selectedSigungu.name} ${selectedEmd.name}`,
            });
        }
    }, [selectedEmd, selectedSido, selectedSigungu, onRegionSelect]);

    // 공통 셀렉트 스타일 (44px 최소 높이로 모바일 터치 최적화)
    const selectClassName = `
        w-full p-3 min-h-[52px] text-base font-medium
        border border-slate-200 rounded-xl
        bg-slate-50 text-slate-900
        focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
        hover:border-primary-300 transition-all duration-200
        disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
        appearance-none
    `.trim();

    const labelClassName = "block text-sm font-semibold text-slate-700 mb-2 ml-1";

    return (
        <div className="p-8 bg-white rounded-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-lg">📍</span>
                지역 선택
                <span className="ml-auto text-xs font-normal text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    Step by Step
                </span>
            </h2>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start">
                    <span className="mr-2">⚠️</span>
                    <span className="flex-1">{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="ml-2 text-red-400 hover:text-red-700 font-medium"
                    >
                        닫기
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1: 시도 선택 */}
                <div className="relative group">
                    <label className={labelClassName}>
                        시/도
                    </label>
                    <div className="relative">
                        <select
                            className={selectClassName}
                            value={selectedSido?.code || ''}
                            onChange={(e) => {
                                const sido = sidoList.find(s => s.code === e.target.value);
                                setSelectedSido(sido || null);
                            }}
                            disabled={loading.sido}
                        >
                            <option value="">시/도를 선택하세요</option>
                            {sidoList.map((sido) => (
                                <option key={sido.code} value={sido.code}>
                                    {sido.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            ▼
                        </div>
                    </div>
                </div>

                {/* Step 2: 시군구 선택 */}
                <div className="relative group">
                    <label className={labelClassName}>
                        시/군/구
                    </label>
                    <div className="relative">
                        <select
                            className={selectClassName}
                            value={selectedSigungu?.code || ''}
                            onChange={(e) => {
                                const sigungu = sigunguList.find(s => s.code === e.target.value);
                                setSelectedSigungu(sigungu || null);
                            }}
                            disabled={!selectedSido || loading.sigungu}
                        >
                            <option value="">
                                {loading.sigungu ? '불러오는 중...' : '시/군/구를 선택하세요'}
                            </option>
                            {sigunguList.map((sigungu) => (
                                <option key={sigungu.code} value={sigungu.code}>
                                    {sigungu.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            ▼
                        </div>
                    </div>
                </div>

                {/* Step 3: 읍면동 선택 (데이터가 있는 경우만 표시) */}
                <div className={`relative group transition-opacity duration-300 ${!selectedSigungu ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                    <label className={labelClassName}>
                        읍/면/동 <span className="text-xs font-normal text-slate-400 ml-1">(선택)</span>
                    </label>
                    <div className="relative">
                        <select
                            className={selectClassName}
                            value={selectedEmd?.code || ''}
                            onChange={(e) => {
                                const emd = emdList.find(s => s.code === e.target.value);
                                setSelectedEmd(emd || null);
                            }}
                            disabled={loading.emd || !selectedSigungu}
                        >
                            <option value="">
                                {loading.emd ? '불러오는 중...' : (emdList.length > 0 ? '읍/면/동을 선택하세요' : '읍면동 없음')}
                            </option>
                            {emdList.map((emd) => (
                                <option key={emd.code} value={emd.code}>
                                    {emd.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            ▼
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
