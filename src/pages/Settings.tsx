import { Settings as SettingsIcon, Moon, Sun, DollarSign, Bell, Check } from 'lucide-react';
import { PageHeader, Card, Switch } from '../components/ui';
import { useSettings } from '../contexts/SettingsContext';

export default function Settings() {
  const { settings, updateSettings } = useSettings();

  const handleThemeToggle = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const handleNotificationToggle = (key: 'priceAlert' | 'targetPriceAlert' | 'memoReminder') => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <PageHeader 
        title="설정"
        subtitle="Settings"
        description="앱 환경을 사용자 취향에 맞게 조정합니다."
      />

      <div className="space-y-4">
        {/* 테마 설정 */}
        <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm p-6 space-y-4 rounded-2xl">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-800/50">
            <div className="p-2 bg-primary-500/10 rounded-xl border border-primary-500/20">
              {settings.theme === 'dark' ? <Moon size={20} className="text-primary-400" /> : <Sun size={20} className="text-primary-400" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">테마 설정</h3>
              <p className="text-xs text-gray-500 mt-0.5">화면 표시 모드를 선택합니다</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/50 border border-gray-800/30">
            <div>
              <p className="text-sm font-bold text-white">다크 모드</p>
              <p className="text-xs text-gray-500 mt-0.5">눈의 피로를 줄이는 어두운 테마</p>
            </div>
            <Switch
              checked={settings.theme === 'dark'}
              onChange={handleThemeToggle}
            />
          </div>
        </Card>

        {/* 표시 형식 */}
        <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm p-6 space-y-4 rounded-2xl opacity-30 pointer-events-none relative">
          {/* 준비 중 배지 */}
          <div className="absolute top-4 right-4 px-2.5 py-1 bg-gray-800/80 border border-gray-700 rounded-full">
            <span className="text-xs font-bold text-gray-400">준비 중</span>
          </div>
          
          <div className="flex items-center gap-3 pb-4 border-b border-gray-800/50">
            <div className="p-2 bg-success/10 rounded-xl border border-success/20">
              <DollarSign size={20} className="text-success" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">표시 형식</h3>
              <p className="text-xs text-gray-500 mt-0.5">데이터 표시 방식을 설정합니다</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/50 border border-gray-800/30">
              <div>
                <p className="text-sm font-bold text-white">통화 형식</p>
                <p className="text-xs text-gray-500 mt-0.5">가격 표시 단위</p>
              </div>
              <select
                value={settings.currencyFormat}
                onChange={(e) => updateSettings({ currencyFormat: e.target.value as any })}
                className="bg-gray-900/80 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                disabled
              >
                <option value="KRW">₩ 원 (KRW)</option>
                <option value="USD">$ 달러 (USD)</option>
                <option value="JPY">¥ 엔 (JPY)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/50 border border-gray-800/30">
              <div>
                <p className="text-sm font-bold text-white">날짜 형식</p>
                <p className="text-xs text-gray-500 mt-0.5">날짜 표시 방식</p>
              </div>
              <select
                value={settings.dateFormat}
                onChange={(e) => updateSettings({ dateFormat: e.target.value as any })}
                className="bg-gray-900/80 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                disabled
              >
                <option value="YYYY-MM-DD">2026-01-31</option>
                <option value="MM/DD/YYYY">01/31/2026</option>
                <option value="DD.MM.YYYY">31.01.2026</option>
              </select>
            </div>
          </div>
        </Card>

        {/* 알림 설정 */}
        <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm p-6 space-y-4 rounded-2xl opacity-30 pointer-events-none relative">
          {/* 준비 중 배지 */}
          <div className="absolute top-4 right-4 px-2.5 py-1 bg-gray-800/80 border border-gray-700 rounded-full">
            <span className="text-xs font-bold text-gray-400">준비 중</span>
          </div>
          
          <div className="flex items-center gap-3 pb-4 border-b border-gray-800/50">
            <div className="p-2 bg-info/10 rounded-xl border border-info/20">
              <Bell size={20} className="text-info" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">알림 설정</h3>
              <p className="text-xs text-gray-500 mt-0.5">중요 이벤트 알림을 관리합니다</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/50 border border-gray-800/30">
              <div>
                <p className="text-sm font-bold text-white">가격 변동 알림</p>
                <p className="text-xs text-gray-500 mt-0.5">보유 종목의 급격한 가격 변동 시 알림</p>
              </div>
              <Switch
                checked={settings.notifications.priceAlert}
                onChange={() => handleNotificationToggle('priceAlert')}
                disabled
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/50 border border-gray-800/30">
              <div>
                <p className="text-sm font-bold text-white">목표가 도달 알림</p>
                <p className="text-xs text-gray-500 mt-0.5">설정한 목표가에 도달했을 때 알림</p>
              </div>
              <Switch
                checked={settings.notifications.targetPriceAlert}
                onChange={() => handleNotificationToggle('targetPriceAlert')}
                disabled
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-950/50 border border-gray-800/30">
              <div>
                <p className="text-sm font-bold text-white">메모 리마인더</p>
                <p className="text-xs text-gray-500 mt-0.5">작성한 투자 노트 정기 리뷰 알림</p>
              </div>
              <Switch
                checked={settings.notifications.memoReminder}
                onChange={() => handleNotificationToggle('memoReminder')}
                disabled
              />
            </div>
          </div>
        </Card>

        {/* 앱 정보 */}
        <Card className="border-gray-800/50 bg-gray-900/20 backdrop-blur-sm p-6 space-y-4 rounded-2xl">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-800/30">
            <div className="p-2 bg-gray-800/50 rounded-xl border border-gray-700/30">
              <SettingsIcon size={20} className="text-gray-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">앱 정보</h3>
              <p className="text-xs text-gray-500 mt-0.5">버전 및 시스템 정보</p>
            </div>
          </div>

          <div className="space-y-0.5 text-sm">
            <div className="flex justify-between py-2 px-3 rounded-lg">
              <span className="text-gray-500 font-medium">버전</span>
              <span className="text-white font-semibold">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 px-3 rounded-lg">
              <span className="text-gray-500 font-medium">데이터 저장소</span>
              <span className="text-white font-semibold">로컬 스토리지</span>
            </div>
            <div className="flex justify-between py-2 px-3 rounded-lg">
              <span className="text-gray-500 font-medium">마지막 업데이트</span>
              <span className="text-white font-semibold">2026-01-31</span>
            </div>
          </div>

          {/* 설정 저장 확인 메시지 */}
          <div className="pt-3 border-t border-gray-800/30">
            <div className="flex items-center gap-2 text-xs text-success">
              <Check size={12} />
              <span>모든 설정이 자동으로 저장됩니다</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
