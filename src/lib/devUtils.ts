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
    help: () => {
      console.clear();
      console.log('%c🛠️ StockNote 개발 도구', 'color: #3b82f6; font-size: 16px; font-weight: bold; margin-bottom: 8px;');

      const logSection = (title: string, items: Record<string, string>) => {
        console.log(`\n%c${title}`, 'color: #64748b; font-weight: bold;');
        Object.entries(items).forEach(([cmd, desc]) => {
          console.log(
            `%c${cmd.padEnd(42)} %c${desc}`,
            'color: #2563eb; font-family: monospace;',
            'color: #475569;'
          );
        });
      };

      logSection('📦 기본 명령어', {
        'mockUtils.load()': '기본 샘플 데이터 로드',
        'mockUtils.clear()': '모든 데이터 완전 삭제 (빈 상태)',
        'mockUtils.getCurrentData()': '현재 메모리 데이터 확인',
        'await api.getData()': 'API로 전체 데이터 조회'
      });

      logSection('🎬 시나리오 로드', {
        'mockUtils.loadScenario("bigProfit")': '💰 50~200% 상승',
        'mockUtils.loadScenario("bigLoss")': '📉 -50~-10% 하락',
        'mockUtils.loadScenario("smallPortfolio")': '🌱 계좌 1개, 종목 3개',
        'mockUtils.loadScenario("largePortfolio")': '🏢 계좌 5개, 종목 20개'
      });

      logSection('🧪 Empty State 테스트', {
        'mockUtils.loadScenario("onlyAccounts")': '💳 종목 0개',
        'mockUtils.loadScenario("onlyWatchlist")': '👀 보유 0개',
        'mockUtils.loadScenario("noMemos")': '📝 메모 0개',
        'mockUtils.loadScenario("minimal")': '⚡ 각 1개씩'
      });

      console.log('\n%c💡 모든 시나리오는 자동으로 페이지를 새로고침합니다.', 'color: #94a3b8; font-style: italic; font-size: 11px;');
    }
  };

  // 초기 도움말 표시
  (window as any).mockUtils.help();
}


