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
        w-full p-3 min-h-[44px] text-base
        border border-gray-300 rounded-lg
        bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed
    `.trim();

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">지역 선택</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-2 underline"
                    >
                        닫기
                    </button>
                </div>
            )}

            <div className="space-y-4">
                {/* Step 1: 시도 선택 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        시/도
                    </label>
                    <select
                        className={selectClassName}
                        value={selectedSido?.code || ''}
                        onChange={(e) => {
                            const sido = sidoList.find(s => s.code === e.target.value);
                            setSelectedSido(sido || null);
                        }}
                        disabled={loading.sido}
                    >
                        <option value="">
                            {loading.sido ? '불러오는 중...' : '시/도 선택'}
                        </option>
                        {sidoList.map((sido) => (
                            <option key={sido.code} value={sido.code}>
                                {sido.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Step 2: 시군구 선택 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        시/군/구
                    </label>
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
                            {loading.sigungu ? '불러오는 중...' : '시/군/구 선택'}
                        </option>
                        {sigunguList.map((sigungu) => (
                            <option key={sigungu.code} value={sigungu.code}>
                                {sigungu.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Step 3: 읍면동 선택 (데이터가 있는 경우만 표시) */}
                {emdList.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            읍/면/동
                        </label>
                        <select
                            className={selectClassName}
                            value={selectedEmd?.code || ''}
                            onChange={(e) => {
                                const emd = emdList.find(s => s.code === e.target.value);
                                setSelectedEmd(emd || null);
                            }}
                            disabled={loading.emd}
                        >
                            <option value="">
                                {loading.emd ? '불러오는 중...' : '읍/면/동 선택'}
                            </option>
                            {emdList.map((emd) => (
                                <option key={emd.code} value={emd.code}>
                                    {emd.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};
