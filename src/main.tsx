import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'
import { SettingsProvider } from './contexts/SettingsContext'
import './index.css'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

// 개발 환경에서 선택적으로 MSW 시작
async function enableMocking() {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true') {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
    console.log('%c🚀 MSW Mock Server 활성화됨 (Supabase API가 챌린지됩니다)', 'color: #ff00ff; font-weight: bold; font-size: 14px;');
    
    // 목 데이터 유틸리티 로드
    await import('./lib/devUtils');
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

enableMocking().then(() => {
 createRoot(rootElement).render(
 <StrictMode>
  <QueryClientProvider client={queryClient}>
   <AuthProvider>
    <SettingsProvider>
     <AppProvider>
      <App />
     </AppProvider>
    </SettingsProvider>
   </AuthProvider>
  </QueryClientProvider>
 </StrictMode>,
 );
});
