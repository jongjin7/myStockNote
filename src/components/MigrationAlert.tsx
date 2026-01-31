import { useState, useEffect } from 'react';
import { migration, type MigrationResult } from '../lib/migration';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Card, Button } from './ui';
import { Database, ArrowRight, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export function MigrationAlert() {
  const { user } = useAuth();
  const { actions } = useApp();
  const [show, setShow] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);

  useEffect(() => {
    if (user && migration.hasLocalData()) {
      setShow(true);
    }
  }, [user]);

  const handleMigrate = async () => {
    if (!user) return;
    setIsMigrating(true);
    
    const res = await migration.migrateToSupabase(user.id);
    setResult(res);
    setIsMigrating(false);

    if (res.success) {
      // Refresh AppContext to show new data from Supabase
      await actions.refresh();
      // Optional: Clear local data after a delay or user confirmation
      // For safety, we keep it until they click "Dismiss"
    }
  };

  const handleDismiss = () => {
    if (result?.success) {
      migration.clearLocalData();
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="px-4 mb-8">
      <Card className="border-blue-500/30 bg-blue-500/5 backdrop-blur-xl p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Database size={120} />
        </div>

        {!result ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Database className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">로컬 데이터 발견</h3>
                <p className="text-sm text-slate-400 mt-1">
                  이전에 사용하던 로컬 데이터가 있습니다. 클라우드 계정으로 안전하게 옮기시겠습니까?
                  <br />
                  <span className="text-xs text-blue-400/80 font-medium">
                    * 이전 완료 후 모든 기기에서 동기화된 데이터를 사용할 수 있습니다.
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                onClick={() => setShow(false)}
                disabled={isMigrating}
              >
                나중에 하기
              </Button>
              <Button 
                onClick={handleMigrate}
                disabled={isMigrating}
                className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20"
              >
                {isMigrating ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    마이그레이션 중...
                  </>
                ) : (
                  <>
                    <ArrowRight size={18} className="mr-2" />
                    지금 이전하기
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : result.success ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-success/20 rounded-xl">
                <CheckCircle className="text-success" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">데이터 이전 완료!</h3>
                <p className="text-sm text-slate-400 mt-1">
                  성공적으로 데이터를 클라우드로 옮겼습니다. {result.count.accounts}개 계좌, {result.count.stocks}개 종목이 동기화되었습니다.
                </p>
              </div>
            </div>
            <Button onClick={handleDismiss} className="bg-success hover:bg-success-dark">
              확인
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-danger/20 rounded-xl">
                <AlertTriangle className="text-danger" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">이전 중 오류 발생</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {result.error}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={() => setResult(null)}>
                다시 시도
              </Button>
              <Button variant="danger" onClick={() => setShow(false)}>
                닫기
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
