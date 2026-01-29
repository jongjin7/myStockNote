import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Account/Accounts';
import Holdings from './pages/Holdings';
import Watchlist from './pages/Watchlist';
import StockDetail from './pages/StockDetail';
import MemoEditor from './pages/MemoEditor';


function App() {
 return (
 <Router>
  <Routes>
  <Route path="/" element={<Layout />}>
   <Route index element={<Dashboard />} />
   <Route path="accounts" element={<Accounts />} />
   <Route path="holdings" element={<Holdings />} />
   <Route path="watchlist" element={<Watchlist />} />
   <Route path="stocks/:id" element={<StockDetail />} />
   <Route path="stocks/:id/memos/new" element={<MemoEditor />} />
   <Route path="memos/:memoId/edit" element={<MemoEditor />} />
  </Route>
  </Routes>
  

 </Router>
 );
}

export default App;

