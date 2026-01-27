import { storage } from '../lib/storage';
import { generateMockData, mockScenarios } from '../lib/mockData';
import { setMockScenario, resetMockData, getCurrentMockData } from '../mocks/handlers';

/**
 * localStorage에 MSW 목 데이터 동기화
 */
function syncMockDataToStorage() {
  const mockData = getCurrentMockData();
  storage.save(mockData);
  console.log('� 목 데이터가 localStorage에 동기화되었습니다.');
}

/**
 * 개발 환경에서 목 데이터를 로드하는 유틸리티
 */
export function loadMockDataForDevelopment() {
  console.log('🎭 목 데이터를 생성하고 있습니다...');
  
  resetMockData();
  syncMockDataToStorage();
  
  const mockData = getCurrentMockData();
  console.log('✅ 목 데이터 로드 완료!');
  console.log(`- 계좌: ${mockData.accounts.length}개`);
  console.log(`- 종목: ${mockData.stocks.length}개`);
  console.log(`- 메모: ${mockData.memos.length}개`);
  console.log(`- 첨부파일: ${mockData.attachments.length}개`);
  
  // 페이지 새로고침하여 데이터 반영
  window.location.reload();
}

/**
 * 특정 시나리오의 목 데이터 로드
 */
export function loadScenario(scenario: keyof typeof mockScenarios) {
  console.log(`🎬 시나리오 "${scenario}" 로드 중...`);
  setMockScenario(scenario);
  syncMockDataToStorage();
  console.log('✅ 시나리오 데이터 로드 완료!');
  window.location.reload();
}

/**
 * 모든 데이터 초기화
 */
export function clearAllData() {
  if (confirm('⚠️ 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    localStorage.clear();
    resetMockData();
    console.log('🗑️ 모든 데이터가 삭제되었습니다.');
    window.location.reload();
  }
}

/**
 * 현재 MSW 데이터를 localStorage에 저장
 */
export function saveMockData() {
  syncMockDataToStorage();
  console.log('✅ 현재 MSW 데이터가 저장되었습니다.');
}

// 개발 환경에서 자동으로 목 데이터 로드
if (import.meta.env.DEV) {
  const existingData = storage.load();
  if (existingData.accounts.length === 0 && existingData.stocks.length === 0) {
    console.log('🎭 데이터가 없어 자동으로 목 데이터를 생성합니다...');
    resetMockData();
    syncMockDataToStorage();
    const mockData = getCurrentMockData();
    console.log('✅ 목 데이터가 자동으로 로드되었습니다!');
    console.log(`- 계좌: ${mockData.accounts.length}개`);
    console.log(`- 종목: ${mockData.stocks.length}개`);
    console.log(`- 메모: ${mockData.memos.length}개`);
    console.log(`- 첨부파일: ${mockData.attachments.length}개`);
  }
}

// 개발 환경에서만 window 객체에 유틸리티 함수 노출
if (import.meta.env.DEV) {
  (window as any).mockUtils = {
    load: loadMockDataForDevelopment,
    loadScenario,
    clear: clearAllData,
    save: saveMockData,
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
  console.log('  - mockUtils.save() : 현재 MSW 데이터 저장');
  console.log('  - mockUtils.clear() : 모든 데이터 삭제');
  console.log('  - mockUtils.getCurrentData() : 현재 데이터 확인');
}
