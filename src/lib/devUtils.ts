import { storage } from '../lib/storage';
import { mockScenarios } from '../lib/mockData';
import { setMockScenario, resetMockData, getCurrentMockData, clearMockData } from '../mocks/handlers';
import { api } from './api';


/**
 * 개발 환경에서 목 데이터를 로드하는 유틸리티
 */
export function loadMockDataForDevelopment() {
  console.log('🎭 목 데이터를 생성하고 있습니다...');
  resetMockData();
  window.location.reload();
}

/**
 * 특정 시나리오의 목 데이터 로드
 */
export function loadScenario(scenario: keyof typeof mockScenarios) {
  console.log(`🎬 시나리오 "${scenario}" 로드 중...`);
  setMockScenario(scenario);
  console.log('✅ 시나리오 데이터 로드 완료!');
  window.location.reload();
}

/**
 * 모든 데이터 초기화
 */
export function clearAllData() {
  if (confirm('⚠️ 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    storage.clear();
    clearMockData();
    console.log('🗑️ 모든 데이터가 삭제되었습니다.');
    window.location.reload();
  }
}


// 개발 환경에서만 window 객체에 유틸리티 함수 노출
if (import.meta.env.DEV) {
  (window as any).api = api;
  (window as any).mockUtils = {
    load: loadMockDataForDevelopment,
    loadScenario,
    clear: clearAllData,
    scenarios: Object.keys(mockScenarios),
    getCurrentData: getCurrentMockData,
  };

  
  console.log('🛠️ MSW 개발 도구가 활성화되었습니다!');
  console.log('사용 가능한 명령어:');
  console.log('  - mockUtils.load() : 기본 목 데이터 로드');
  console.log('  - mockUtils.loadScenario("bigProfit") : 큰 수익 시나리오');
  console.log('  - mockUtils.loadScenario("bigLoss") : 손실 시나리오');
  console.log('  - mockUtils.loadScenario("smallPortfolio") : 소액 투자');
  console.log('  - mockUtils.loadScenario("largePortfolio") : 대규모 포트폴리오');
  console.log('  - mockUtils.clear() : 모든 데이터 삭제');
  console.log('  - mockUtils.getCurrentData() : 현재 데이터 확인');
}
