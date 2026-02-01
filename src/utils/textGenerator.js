/**
 * 지역 현황 분석 텍스트 생성
 * @param {Object} data - { cagr: number, elderlyRatio: number, regionName: string }
 * @returns {string} 복사용 분석 텍스트
 */
export const generateCopy = (data) => {
    const { cagr, elderlyRatio, regionName } = data;

    if (!regionName) {
        return '지역을 선택해주세요.';
    }

    let urgencyText = "";

    if (cagr <= -2) {
        // 급격한 인구 감소
        urgencyText = `지난 5년간 인구가 ${Math.abs(cagr)}% 급감하여 지역 소멸 위기가 현실화되고 있으며, 활력 제고를 위한 사회적 개입이 매우 시급합니다.`;
    } else if (cagr <= 0) {
        // 완만한 인구 감소
        urgencyText = `지난 5년간 인구가 ${Math.abs(cagr)}% 감소하여 지역 활력 저하가 우려되며, 이에 따른 사회복지 개입의 필요성이 높습니다.`;
    } else if (cagr < 1) {
        // 정체
        urgencyText = `지난 5년간 인구 변동이 거의 없어(+${cagr}%) 정체된 도시 활력을 불어넣을 새로운 복지 모멘텀이 필요합니다.`;
    } else {
        // 인구 증가 (CAGR >= 1%) - 기존 로직에서 누락된 케이스
        urgencyText = `지난 5년간 인구가 ${cagr}% 증가하여 성장세를 보이고 있으나, 급격한 인구 유입에 따른 복지 인프라 확충이 필요합니다.`;
    }

    // 고령화 분석
    let elderlyText = "";
    if (elderlyRatio >= 20) {
        elderlyText = "또한, 초고령 사회(20% 이상) 진입으로 인한 노인 돌봄 공백 최소화가 최우선 과제입니다.";
    } else if (elderlyRatio >= 14) {
        elderlyText = "또한, 고령 사회(14% 이상)로서 노인 복지 서비스 수요 증가에 대비한 선제적 대응이 요구됩니다.";
    }

    // 최종 문장 조합
    const conclusion = "이에 본 사업을 통해 지역 맞춤형 복지 서비스를 제공하고자 합니다.";

    return `[${regionName} 현황 분석] ${urgencyText}${elderlyText ? ' ' + elderlyText : ''} ${conclusion}`.trim();
};
