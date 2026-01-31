import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LogIn, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google 로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050510] relative overflow-hidden px-4 font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
      
      <div className="max-w-xl w-full relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl mb-6 shadow-2xl">
            <Zap className="text-blue-400 fill-blue-400" size={32} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            Stock<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Note</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-md mx-auto leading-relaxed">
            당신의 투자 판단을 기록하고 복기하여 <br /> 
            더 나은 미래를 설계하세요.
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 md:p-14 rounded-[40px] shadow-[0_24px_80px_rgba(0,0,0,0.5)] animate-scale-in">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">시작하기</h2>
            <p className="text-slate-500 text-sm">구글 계정으로 1초 만에 안전하게 로그인하세요</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm text-center font-medium animate-shake">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-16 bg-white hover:bg-slate-50 text-[#1a1a1a] font-bold text-lg rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mb-8"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google 계정으로 시작하기
              </>
            )}
          </button>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <ShieldCheck size={20} />
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Safe Data</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Globe size={20} />
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Anywhere</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <LogIn size={20} />
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">One Click</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-slate-500 text-sm font-medium animate-fade-in delay-500">
          이 서비스를 사용함으로써 귀하는 <span className="underline cursor-pointer hover:text-white transition-colors">이용약관</span> 및 <span className="underline cursor-pointer hover:text-white transition-colors">개인정보처리방침</span>에 동의하게 됩니다.
        </div>
      </div>
    </div>
  );
}
