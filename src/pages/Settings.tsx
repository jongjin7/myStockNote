import { Settings as SettingsIcon, Moon, Sun, DollarSign, Bell, Check, User, LogOut } from 'lucide-react';
import { PageHeader, Card, Switch, Button } from '../components/ui';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { settings, updateSettings } = useSettings();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await signOut();
      navigate('/login');
    }
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
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-20">
      <PageHeader 
        title="설정"
        subtitle="Settings"
        description="앱 환경과 계정 정보를 관리합니다."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 프로필 정보 */}
        <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm p-5 rounded-2xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-800/50">
            <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <User size={16} className="text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-white">내 프로필</h3>
          </div>

          <div className="space-y-2.5 mt-3">
            <div className="p-2.5 rounded-lg bg-gray-950/50 border border-gray-800/30">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">이메일</p>
              <p className="text-sm font-semibold text-white">{user?.email}</p>
            </div>
            {user?.user_metadata?.full_name && (
              <div className="p-2.5 rounded-lg bg-gray-950/50 border border-gray-800/30">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">이름</p>
                <p className="text-sm font-semibold text-white">{user.user_metadata.full_name}</p>
              </div>
            )}
            
            <Button 
              variant="danger" 
              size="sm"
              className="w-full mt-3"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-1.5" />
              로그아웃
            </Button>
          </div>
        </Card>

        {/* 테마 설정 */}
        <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm p-5 rounded-2xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-800/50">
            <div className="p-1.5 bg-primary-500/10 rounded-lg border border-primary-500/20">
              {settings.theme === 'dark' ? <Moon size={16} className="text-primary-400" /> : <Sun size={16} className="text-primary-400" />}
            </div>
            <h3 className="text-base font-bold text-white">테마 설정</h3>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950/50 border border-gray-800/30">
              <div>
                <p className="text-sm font-semibold text-white">다크 모드</p>
                <p className="text-[11px] text-gray-500 mt-0.5">눈의 피로를 줄이는 어두운 테마</p>
              </div>
              <Switch
                checked={settings.theme === 'dark'}
                onChange={handleThemeToggle}
              />
            </div>
          </div>
        </Card>

        {/* 표시 형식 */}
        <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm p-5 rounded-2xl opacity-30 pointer-events-none relative">
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-gray-800/80 border border-gray-700 rounded-full">
            <span className="text-[10px] font-bold text-gray-400">준비 중</span>
          </div>
          
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-800/50">
            <div className="p-1.5 bg-success/10 rounded-lg border border-success/20">
              <DollarSign size={16} className="text-success" />
            </div>
            <h3 className="text-base font-bold text-white">표시 형식</h3>
          </div>

          <div className="space-y-2 mt-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950/50 border border-gray-800/30">
              <div>
                <p className="text-sm font-semibold text-white">통화 형식</p>
                <p className="text-[11px] text-gray-500 mt-0.5">가격 표시 단위</p>
              </div>
              <select
                value={settings.currencyFormat}
                onChange={(e) => updateSettings({ currencyFormat: e.target.value as any })}
                className="bg-gray-900/80 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                disabled
              >
                <option value="KRW">₩ 원</option>
                <option value="USD">$ 달러</option>
                <option value="JPY">¥ 엔</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950/50 border border-gray-800/30">
              <div>
                <p className="text-sm font-semibold text-white">날짜 형식</p>
                <p className="text-[11px] text-gray-500 mt-0.5">날짜 표시 방식</p>
              </div>
              <select
                value={settings.dateFormat}
                onChange={(e) => updateSettings({ dateFormat: e.target.value as any })}
                className="bg-gray-900/80 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
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
        <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm p-5 rounded-2xl opacity-30 pointer-events-none relative">
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-gray-800/80 border border-gray-700 rounded-full">
            <span className="text-[10px] font-bold text-gray-400">준비 중</span>
          </div>
          
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-800/50">
            <div className="p-1.5 bg-info/10 rounded-lg border border-info/20">
              <Bell size={16} className="text-info" />
            </div>
            <h3 className="text-base font-bold text-white">알림 설정</h3>
          </div>

          <div className="space-y-2 mt-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950/50 border border-gray-800/30">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">가격 변동 알림</p>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">급격한 가격 변동 시 알림</p>
              </div>
              <Switch
                checked={settings.notifications.priceAlert}
                onChange={() => handleNotificationToggle('priceAlert')}
                disabled
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950/50 border border-gray-800/30">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">목표가 도달 알림</p>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">목표가 도달 시 알림</p>
              </div>
              <Switch
                checked={settings.notifications.targetPriceAlert}
                onChange={() => handleNotificationToggle('targetPriceAlert')}
                disabled
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950/50 border border-gray-800/30">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">메모 리마인더</p>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">정기 리뷰 알림</p>
              </div>
              <Switch
                checked={settings.notifications.memoReminder}
                onChange={() => handleNotificationToggle('memoReminder')}
                disabled
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 앱 정보 - 전체 너비 */}
      <Card className="border-gray-800/50 bg-gray-900/20 backdrop-blur-sm p-5 rounded-2xl">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-800/30">
          <div className="p-1.5 bg-gray-800/50 rounded-lg border border-gray-700/30">
            <SettingsIcon size={16} className="text-gray-500" />
          </div>
          <h3 className="text-base font-bold text-white">앱 정보</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          <div className="p-2.5 rounded-lg bg-gray-950/30">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">버전</p>
            <p className="text-sm font-semibold text-white">2.0.0 (Supabase)</p>
          </div>
          <div className="p-2.5 rounded-lg bg-gray-950/30">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">데이터 저장소</p>
            <p className="text-sm font-semibold text-white">Supabase Cloud</p>
          </div>
          <div className="p-2.5 rounded-lg bg-gray-950/30">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">마지막 업데이트</p>
            <p className="text-sm font-semibold text-white">2026-01-31</p>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-gray-800/30">
          <div className="flex items-center gap-2 text-xs text-success">
            <Check size={12} />
            <span>모든 설정이 자동으로 저장됩니다</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
