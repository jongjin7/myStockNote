import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  ArrowLeft, Save, X, Image as ImageIcon, 
  Trash2, AlertCircle, Info, CheckCircle2,
  FileText, TrendingUp, ShieldAlert, Zap, Plus
} from 'lucide-react';
import type { StockMemo, Attachment } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function MemoEditor() {
  const { id: stockId, memoId } = useParams<{ id?: string; memoId?: string }>();
  const navigate = useNavigate();
  const { data, actions } = useApp();
  const { stocks, memos, attachments } = data;

  const editingMemo = memoId ? memos.find(m => m.id === memoId) : null;
  const currentStockId = editingMemo?.stockId || stockId;
  const stock = stocks.find(s => s.id === currentStockId);
  const memoAttachments = memoId ? attachments.filter(a => a.memoId === memoId) : [];

  // Form States
  const [type, setType] = useState<'PURCHASE' | 'SELL' | 'GENERAL'>(editingMemo?.type || 'GENERAL');
  const [buyReason, setBuyReason] = useState(editingMemo?.buyReason || '');
  const [expectedScenario, setExpectedScenario] = useState(editingMemo?.expectedScenario || '');
  const [risks, setRisks] = useState(editingMemo?.risks || '');
  const [currentThought, setCurrentThought] = useState(editingMemo?.currentThought || '');
  const [sellReview, setSellReview] = useState(editingMemo?.sellReview || '');
  
  // Attachments State
  const [newAttachments, setNewAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!stock && !editingMemo) {
      navigate('/');
    }
  }, [stock, editingMemo, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const attachment: Attachment = {
          id: uuidv4(),
          memoId: editingMemo?.id || 'temp', // Fixed up later
          type: 'IMAGE',
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          data: reader.result as string,
          createdAt: Date.now(),
        };
        setNewAttachments(prev => [...prev, attachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id: string, isExisting: boolean) => {
    if (isExisting) {
      if (window.confirm('기존 첨부파일을 삭제하시겠습니까?')) {
        actions.deleteAttachment(id);
      }
    } else {
      setNewAttachments(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStockId) return;

    const newMemoId = editingMemo?.id || uuidv4();
    const memoData: StockMemo = {
      id: newMemoId,
      stockId: currentStockId,
      type,
      buyReason: buyReason.trim() || null,
      expectedScenario: expectedScenario.trim() || null,
      risks: risks.trim() || null,
      currentThought: currentThought.trim() || null,
      sellReview: sellReview.trim() || null,
      createdAt: editingMemo?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    actions.saveMemo(memoData);

    // Save new attachments with real memoId
    newAttachments.forEach(att => {
      actions.saveAttachment({
        ...att,
        memoId: newMemoId
      });
    });

    navigate(`/stocks/${currentStockId}`);
  };

  if (!stock && !editingMemo) return null;

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {editingMemo ? '투자 노트 수정' : '새 투자 노트 작성'}
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              {stock?.name} <span className="mx-2 text-slate-800">|</span> {stock?.symbol || 'No Code'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95"
        >
          <Save size={20} />
          <span>노트 저장</span>
        </button>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Memo Type Selector */}
        <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl inline-flex gap-1">
          {[
            { id: 'PURCHASE', label: '매수 기록', icon: Zap, color: 'text-blue-500' },
            { id: 'SELL', label: '매도 회고', icon: ShieldAlert, color: 'text-red-500' },
            { id: 'GENERAL', label: '일반 메모', icon: FileText, color: 'text-slate-400' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setType(item.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all font-bold text-sm ${
                type === item.id 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <item.icon size={16} className={type === item.id ? item.color : 'text-slate-600'} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Structured Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-400 flex items-center ml-1">
                <CheckCircle2 size={16} className="mr-2 text-blue-500" />
                매수 이유 (왜 샀는가?)
              </label>
              <textarea 
                value={buyReason}
                onChange={(e) => setBuyReason(e.target.value)}
                placeholder="예: 반도체 사이클 회복 기대, 실적 턴어라운드 전망..."
                className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all resize-none min-h-[120px] placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-400 flex items-center ml-1">
                <TrendingUp size={16} className="mr-2 text-emerald-500" />
                기대 시나리오 (목표/기대)
              </label>
              <textarea 
                value={expectedScenario}
                onChange={(e) => setExpectedScenario(e.target.value)}
                placeholder="예: 상반기 내 목표가 8만원 도달, 신제품 출시 흥행..."
                className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all resize-none min-h-[120px] placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-400 flex items-center ml-1">
                <AlertCircle size={16} className="mr-2 text-red-500" />
                리스크 요인 (주의사항)
              </label>
              <textarea 
                value={risks}
                onChange={(e) => setRisks(e.target.value)}
                placeholder="예: 금리 인상 지속 시 밸류에이션 부담, 경쟁사 시장 점유율 확대..."
                className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white focus:ring-2 focus:ring-red-600 focus:outline-none transition-all resize-none min-h-[120px] placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-400 flex items-center ml-1">
                <Info size={16} className="mr-2 text-blue-400" />
                현재 나의 생각
              </label>
              <textarea 
                value={currentThought}
                onChange={(e) => setCurrentThought(e.target.value)}
                placeholder="장 시작 전 현재의 심정이나 추가적인 업데이트 내용..."
                className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all resize-none min-h-[120px] placeholder:text-slate-700"
              />
            </div>
          </div>

          {type === 'SELL' && (
            <div className="col-span-1 md:col-span-2 space-y-3 animate-in fade-in slide-in-from-top-2">
              <label className="text-sm font-bold text-slate-400 flex items-center ml-1">
                <ShieldAlert size={16} className="mr-2 text-red-400" />
                매도 회고 (복기)
              </label>
              <textarea 
                value={sellReview}
                onChange={(e) => setSellReview(e.target.value)}
                placeholder="매도 결정의 이유, 원래 시나리오와의 차이점 등..."
                className="w-full bg-slate-900 border border-red-900/30 rounded-3xl p-5 text-white focus:ring-2 focus:ring-red-600 focus:outline-none transition-all resize-none min-h-[150px] placeholder:text-slate-700"
              />
            </div>
          )}
        </div>

        {/* Attachments Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-bold text-slate-400 flex items-center">
              <ImageIcon size={16} className="mr-2 text-blue-500" />
              참부 자료 아카이빙 (최대 5개)
            </label>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>자료 추가</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Existing Attachments */}
            {memoAttachments.map((att) => (
              <div key={att.id} className="relative aspect-square group">
                <img 
                  src={att.data} 
                  alt={att.fileName} 
                  className="w-full h-full object-cover rounded-2xl border border-slate-800"
                />
                <button 
                  type="button"
                  onClick={() => removeAttachment(att.id, true)}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {/* New Attachments */}
            {newAttachments.map((att) => (
              <div key={att.id} className="relative aspect-square group">
                <img 
                  src={att.data} 
                  className="w-full h-full object-cover rounded-2xl border border-blue-500/30"
                />
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-blue-600 text-[8px] font-bold text-white rounded uppercase">
                  New
                </div>
                <button 
                  type="button"
                  onClick={() => removeAttachment(att.id, false)}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {/* Upload Trigger */}
            {(memoAttachments.length + newAttachments.length) < 5 && (
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square bg-slate-900 border-2 border-dashed border-slate-800 hover:border-blue-600/50 hover:bg-slate-800/50 rounded-2xl flex flex-col items-center justify-center text-slate-600 hover:text-blue-500 transition-all group"
              >
                <Plus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold">이미지 드롭</span>
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-600 px-1 italic">
            * LocalStorage 용량 제한으로 인해 고화질 이미지는 자동으로 최적화하여 저장하는 것을 권장합니다.
          </p>
        </div>

        <div className="pt-10 flex items-center justify-center space-x-4">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="px-10 py-4 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl font-bold transition-all"
          >
            취소하고 돌아가기
          </button>
          <button 
            type="submit"
            className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-extrabold transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
          >
            기록 완료
          </button>
        </div>
      </form>
    </div>
  );
}
