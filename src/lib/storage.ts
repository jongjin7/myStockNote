import type { AppData } from '../types';

const STORAGE_KEY = 'stock_note_data_v1';

export const initialData: AppData = {
  accounts: [],
  stocks: [],
  memos: [],
  attachments: [],
};

export const storage = {
  /**
   * 로컬 스토리지에서 데이터를 로드합니다.
   * (이제 직접 UI에서 사용하지 않고 MSW 핸들러에서만 서버 저장소 역할을 위해 사용합니다)
   */
  load: (): AppData => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return initialData;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load data from localStorage', e);
      return initialData;
    }
  },

  /**
   * 로컬 스토리지에 데이터를 저장합니다.
   */
  save: (data: AppData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data to localStorage', e);
      // Handle quota exceeded error
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        alert('저장 공간이 부족합니다. 오래된 첨부파일을 삭제하거나 데이터를 백업해 주세요.');
      }
    }
  },

  /**
   * 모든 데이터를 초기화합니다.
   */
  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
