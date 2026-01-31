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

// 개발 환경에서 MSW 시작
async function enableMocking() {
 if (import.meta.env.DEV) {
 const { worker } = await import('./mocks/browser');
 await worker.start({
  onUnhandledRequest: 'bypass', // API 요청이 아닌 경우 무시
 });
 
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
