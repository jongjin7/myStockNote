import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { supabaseApi } from '../lib/supabase-api';
import { 
 ArrowLeft, Save, X, Image as ImageIcon, 
 AlertCircle, Info, CheckCircle2,
 FileText, TrendingUp, ShieldAlert, Zap, Plus
} from 'lucide-react';
import type { StockMemo, Attachment } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { 
 Card,
 Button, Textarea 
} from '../components/ui';
import { cn, formatFileSize, resizeImage } from '../lib/utils';

interface NewAttachment extends Attachment {
  file?: File;
  previewUrl?: string;
}

export default function MemoEditor() {
 const { id: stockId, memoId } = useParams<{ id?: string; memoId?: string }>();
 const navigate = useNavigate();
 const { data, actions } = useApp();
 const { user } = useAuth();
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
 const [newAttachments, setNewAttachments] = useState<NewAttachment[]>([]);
 const [isSaving, setIsSaving] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
 if (!stock && !editingMemo) {
  navigate('/');
 }
 }, [stock, editingMemo, navigate]);

 const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || !user) return;

  const fileList = Array.from(files);
  
  for (const file of fileList) {
   if (file.size > 20 * 1024 * 1024) {
    alert('파일 크기가 너무 큽니다. (최대 20MB)');
    continue;
   }

   try {
    // 이미지 파일인 경우 리사이징 처리
    const resizedFile = file.type.startsWith('image/') 
      ? await resizeImage(file, 1200, 0.8)
      : file;

    const previewUrl = URL.createObjectURL(resizedFile);
    const attachment: NewAttachment = {
     id: uuidv4(),
     memoId: editingMemo?.id || 'temp',
     type: 'IMAGE',
     fileName: resizedFile.name,
     fileSize: resizedFile.size,
     mimeType: resizedFile.type,
     data: '', 
     createdAt: Date.now(),
     file: resizedFile,
     previewUrl,
    };
    setNewAttachments(prev => [...prev, attachment]);
   } catch (err) {
    console.error('Image resizing failed:', err);
   }
  }
 };

 const removeAttachment = async (id: string, isExisting: boolean) => {
  if (isExisting) {
   if (window.confirm('기존 첨부파일을 삭제하시겠습니까?')) {
    await actions.deleteAttachment(id);
   }
  } else {
   setNewAttachments(prev => {
    const filtered = prev.filter(a => a.id !== id);
    // Cleanup preview URL
    const removed = prev.find(a => a.id === id);
    if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
    return filtered;
   });
  }
 };

 const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!currentStockId || !user) return;

  setIsSaving(true);
  try {
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

    await actions.saveMemo(memoData);

    // Upload new files and save meta
    for (const att of newAttachments) {
      if (att.file) {
        const publicUrl = await supabaseApi.uploadImage(user.id, att.file);
        await actions.saveAttachment({
          ...att,
          memoId: newMemoId,
          data: publicUrl // Save public URL to DB
        });
      }
    }

    navigate(`/stocks/${currentStockId}`);
  } catch (err: any) {
    console.error('Failed to save memo:', err);
    alert('기록 저장 중 오류가 발생했습니다: ' + err.message);
  } finally {
    setIsSaving(false);
  }
 };


 if (!stock && !editingMemo) return null;

 return (
 <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
  <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
  <div className="flex items-center gap-6">
    <Button 
    variant="secondary" 
    size="sm" 
    onClick={() => navigate(-1)}
    className="w-10 h-10 p-0 rounded-xl"
    >
    <ArrowLeft size={20} />
    </Button>
   <div>
   <h1 className="text-3xl font-bold text-white tracking-tight">
    {editingMemo ? '투자 노트 수정' : '새 투자 노트 작성'}
   </h1>
   <div className="flex items-center gap-2 mt-1">
    <span className="text-sm font-bold text-primary-500">{stock?.name}</span>
    <span className="text-gray-700 font-bold">|</span>
    <span className="text-xs text-gray-500 uppercase tracking-widest">{stock?.symbol || 'NO CODE'}</span>
   </div>
   </div>
  </div>
  <div className="flex items-center gap-3">
   <Button variant="secondary" onClick={() => navigate(-1)}>
   취소
   </Button>
     <Button onClick={handleSave} className="px-8" disabled={isSaving}>
     <Save size={18} className={cn("mr-2", isSaving && "animate-spin")} />
     <span>{isSaving ? '기록 저장 중...' : '기록 완료'}</span>
     </Button>
   </div>
  </header>

  <form onSubmit={handleSave} className="space-y-10">
  {/* Memo Type Selector */}
  <section className="space-y-4">
   <label className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">노트 성격</label>
   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
   {[
    { id: 'PURCHASE', label: '매수 기록', icon: Zap, color: 'text-success', bg: 'hover:bg-success/5 border-success/20' },
    { id: 'SELL', label: '매도 회고', icon: ShieldAlert, color: 'text-danger', bg: 'hover:bg-danger/5 border-danger/20' },
    { id: 'GENERAL', label: '일반 메모', icon: FileText, color: 'text-info', bg: 'hover:bg-info/5 border-info/20' }
   ].map((item) => (
    <Card 
    key={item.id}
    interactive 
    onClick={() => setType(item.id as any)}
    className={cn(
     "p-6 flex items-center gap-4 transition-all border-2",
     type === item.id 
     ? "bg-gray-900 border-primary-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
     : "bg-gray-900/30 border-gray-800 " + item.bg
    )}
    >
    <div className={cn(
     "p-3 rounded-xl",
     type === item.id ? "bg-primary-500 text-white" : item.color + " bg-gray-900"
    )}>
     <item.icon size={24} />
    </div>
    <div>
     <h3 className={cn("font-bold", type === item.id ? "text-white" : "text-gray-400")}>
     {item.label}
     </h3>
     <p className="text-sm text-gray-600 font-medium uppercase tracking-widest mt-0.5">
     {item.id} RECORD
     </p>
    </div>
    {type === item.id && (
     <div className="ml-auto w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
    )}
    </Card>
   ))}
   </div>
  </section>

  {/* Dynamic Fields based on Memo Type */}
  <div className="space-y-8">
   {type === 'PURCHASE' && (
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
    <div className="space-y-8">
    <Card className="p-8 border-gray-800 bg-gray-900/40 backdrop-blur-sm">
     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center mb-6">
     <CheckCircle2 size={16} className="mr-2 text-success" />
     매수 판단 근거 (Why Buy?) <span className="ml-2 text-danger text-sm font-black">필수</span>
     </label>
     <Textarea 
     value={buyReason}
     onChange={(e) => setBuyReason(e.target.value)}
     placeholder="기업의 핵심 경쟁력, 시장 상황 등 매수 결정을 내린 결정적인 이유를 기록하세요."
     className="bg-gray-950 border-gray-800 min-h-[160px] text-gray-200"
     required
     />
    </Card>

    <Card className="p-8 border-gray-800 bg-gray-900/40 backdrop-blur-sm">
     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center mb-6">
     <TrendingUp size={16} className="mr-2 text-primary-400" />
     기대 시나리오 (Target)
     </label>
     <Textarea 
     value={expectedScenario}
     onChange={(e) => setExpectedScenario(e.target.value)}
     placeholder="목표 주가, 신제품 출시, 실적 발표 등 주가 상승을 견인할 트리거를 기록하세요."
     className="bg-gray-950 border-gray-800 min-h-[160px] text-gray-200"
     />
    </Card>
    </div>

    <div className="space-y-8">
    <Card className="p-8 border-gray-800 bg-gray-900/40 backdrop-blur-sm">
     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center mb-6">
     <AlertCircle size={16} className="mr-2 text-danger" />
     핵심 리스크 (Risk)
     </label>
     <Textarea 
     value={risks}
     onChange={(e) => setRisks(e.target.value)}
     placeholder="판단이 틀릴 수 있는 지점, 거시 경제 상황, 경쟁 심화 등 경계해야 할 요소를 기록하세요."
     className="bg-gray-950 border-gray-800 min-h-[160px] text-gray-200"
     />
    </Card>

    <Card className="p-8 border-gray-800 bg-gray-900/40 backdrop-blur-sm">
     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center mb-6">
     <Info size={16} className="mr-2 text-info" />
     추가적인 생각
     </label>
     <Textarea 
     value={currentThought}
     onChange={(e) => setCurrentThought(e.target.value)}
     placeholder="매수 결정과 관련된 기타 생각들을 자유롭게 남겨보세요."
     className="bg-gray-950 border-gray-800 min-h-[160px] text-gray-200"
     />
    </Card>
    </div>
   </div>
   )}

   {type === 'GENERAL' && (
   <div className="space-y-8 animate-fade-in">
    <Card className="p-8 border-gray-800 bg-gray-900/40 backdrop-blur-sm">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center mb-6">
     <FileText size={18} className="mr-2 text-info" />
     {stock?.status === 'WATCHLIST' ? '리서치 내용 및 관심 포인트' : '현재의 기록 또는 리서치 내용'}
    </label>
    <Textarea 
     value={currentThought}
     onChange={(e) => setCurrentThought(e.target.value)}
     placeholder={stock?.status === 'WATCHLIST' 
     ? "이 종목을 관심 있게 보는 이유, 현재까지 파악된 정보, 리서치 결과를 상세히 기록하세요."
     : "현재 시점에서의 기업 분석, 시장 변화, 또는 단순한 기록을 남겨보세요."
     }
     className="bg-gray-950 border-gray-800 min-h-[320px] text-gray-200 text-lg leading-relaxed"
     required
    />
    </Card>
   </div>
   )}

   {type === 'SELL' && (
   <div className="space-y-8 animate-fade-in">
    <Card className="p-8 border-danger/20 bg-danger/5">
    <label className="text-xs font-bold text-danger uppercase tracking-widest flex items-center mb-6">
     <ShieldAlert size={18} className="mr-2" />
     매매 복기 및 세부 평가 (Sell Review) <span className="ml-2 text-danger text-sm font-black underline">매도 시 복기 필수</span>
    </label>
    <Textarea 
     value={sellReview}
     onChange={(e) => setSellReview(e.target.value)}
     placeholder="매도 시점에서의 판단은 리서치 단계에서 기대했던 것과 어떻게 달랐나요? 성공과 실패의 원인을 복기해 보세요."
     className="bg-gray-950 border-danger/10 min-h-[320px] text-gray-200 text-lg leading-relaxed"
     required
    />
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <Card className="p-8 border-gray-800 bg-gray-900/40 backdrop-blur-sm">
     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center mb-6">
     <ArrowLeft size={16} className="mr-2 text-primary-500" />
     당시 매수 이유 재확인
     </label>
     <div className="p-4 bg-black/20 rounded-xl text-sm text-gray-500 italic">
     {buyReason || '기록된 매수 이유가 없습니다.'}
     </div>
    </Card>
    <Card className="p-8 border-gray-800 bg-gray-900/40 backdrop-blur-sm">
     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center mb-6">
     <Info size={16} className="mr-2 text-info" />
     기타 매도 관련 메모
     </label>
     <Textarea 
     value={currentThought}
     onChange={(e) => setCurrentThought(e.target.value)}
     placeholder="매도 후 남기는 추가적인 메모입니다."
     className="bg-gray-950 border-gray-800 min-h-[120px] text-gray-200"
     />
    </Card>
    </div>
   </div>
   )}
  </div>

  {/* Attachments Section */}
  <section className="space-y-6">
   <div className="flex items-center justify-between px-2">
   <label className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center">
    <ImageIcon size={18} className="mr-2 text-primary-500" />
    리서치 자료 아카이빙 (최대 5개)
   </label>
   <div className="text-sm font-bold text-gray-600 uppercase tracking-widest">
    {(memoAttachments.length + newAttachments.length)} / 5 FILES
   </div>
   </div>

   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
   {/* Existing Attachments */}
   {memoAttachments.map((att) => (
    <div key={att.id} className="relative aspect-square group animate-fade-in">
    <img 
     src={att.data} 
     alt={att.fileName} 
     className="w-full h-full object-cover rounded-2xl border border-gray-800 group-hover:border-primary-500 transition-all shadow-lg"
    />
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center p-2 text-center">
     <span className="text-[8px] text-white font-bold truncate w-full mb-1">{att.fileName}</span>
     <span className="text-[8px] text-white/60 ">{formatFileSize(att.fileSize)}</span>
    </div>
    <Button 
     type="button"
     variant="danger"
     size="sm"
     onClick={() => removeAttachment(att.id, true)}
     className="absolute -top-2 -right-2 w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 shadow-xl"
    >
     <X size={14} />
    </Button>
    </div>
   ))}

   {/* New Attachments */}
   {newAttachments.map((att) => (
    <div key={att.id} className="relative aspect-square group animate-scale-in">
    <img 
     src={att.previewUrl} 
     className="w-full h-full object-cover rounded-2xl border border-primary-500 shadow-xl"
    />
    <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary-500 text-[8px] font-black text-white rounded uppercase tracking-widest shadow-lg">
     NEW | 신규
    </div>
    <Button 
     type="button"
     variant="danger"
     size="sm"
     onClick={() => removeAttachment(att.id, false)}
     className="absolute -top-2 -right-2 w-8 h-8 p-0 rounded-full shadow-xl"
     disabled={isSaving}
    >
     <X size={14} />
    </Button>
    </div>
   ))}

   {/* Upload Trigger */}
   {(memoAttachments.length + newAttachments.length) < 5 && (
    <Button 
    type="button"
    variant="secondary"
    onClick={() => fileInputRef.current?.click()}
    className="aspect-square w-full h-full border-2 border-dashed border-gray-800 hover:border-primary-500 hover:bg-primary-500/5 rounded-2xl flex flex-col items-center justify-center text-gray-700 hover:text-primary-500 shadow-none bg-transparent"
    >
    <Plus size={32} className="mb-3 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
    <span className="text-sm font-bold uppercase tracking-widest">이미지 업로드</span>
    </Button>
   )}
   <input 
    type="file" 
    ref={fileInputRef}
    onChange={handleImageUpload}
    accept="image/*"
    multiple
    className="hidden"
   />
   </div>
   <div className="flex items-start gap-2 px-2">
   <Info size={12} className="text-gray-600 mt-0.5" />
   <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
    이미지는 최대 10MB까지 업로드 가능하며, 클라우드에 안전하게 저장됩니다.
   </p>
   </div>
  </section>

  {/* Form Actions (Mobile Visible only or duplicated for UX) */}
  <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
   <Button 
   variant="secondary" 
   size="lg"
   type="button"
   onClick={() => navigate(-1)}
   className="w-full sm:w-auto px-12 h-14"
   >
   취소하고 돌아가기
   </Button>
     <Button 
     size="lg"
     type="submit"
     className="w-full sm:w-auto px-16 h-14 font-black text-lg"
     disabled={isSaving}
     >
     <Save size={18} className={cn("mr-2", isSaving && "animate-spin")} />
     <span>{isSaving ? '저장 중...' : '기록 완료'}</span>
     </Button>
   </div>
  </form>
 </div>
 );
}
