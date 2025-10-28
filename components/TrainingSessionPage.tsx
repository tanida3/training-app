import React, { useState } from 'react';

// 型定義
interface TrainingSet {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  memo?: string;
}

interface TrainingExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  bodyPart: string;
  sets: TrainingSet[];
}

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  isCustom: boolean;
}

// デフォルトの種目リスト
const defaultExercises: Exercise[] = [
  { id: 'ex-1', name: 'ベンチプレス', bodyPart: '胸', isCustom: false },
  { id: 'ex-2', name: 'インクラインベンチプレス', bodyPart: '胸', isCustom: false },
  { id: 'ex-3', name: 'ダンベルフライ', bodyPart: '胸', isCustom: false },
  { id: 'ex-4', name: 'デッドリフト', bodyPart: '背中', isCustom: false },
  { id: 'ex-5', name: 'ラットプルダウン', bodyPart: '背中', isCustom: false },
  { id: 'ex-6', name: 'ベントオーバーロウ', bodyPart: '背中', isCustom: false },
  { id: 'ex-7', name: 'スクワット', bodyPart: '脚', isCustom: false },
  { id: 'ex-8', name: 'レッグプレス', bodyPart: '脚', isCustom: false },
  { id: 'ex-9', name: 'レッグカール', bodyPart: '脚', isCustom: false },
  { id: 'ex-10', name: 'ショルダープレス', bodyPart: '肩', isCustom: false },
  { id: 'ex-11', name: 'サイドレイズ', bodyPart: '肩', isCustom: false },
  { id: 'ex-12', name: 'リアデルト', bodyPart: '肩', isCustom: false },
  { id: 'ex-13', name: 'バーベルカール', bodyPart: '腕', isCustom: false },
  { id: 'ex-14', name: 'トライセプスエクステンション', bodyPart: '腕', isCustom: false },
];

interface TrainingSessionProps {
  onClose?: () => void;
}

export default function TrainingSessionPage({ onClose }: TrainingSessionProps) {
  const [exercises, setExercises] = useState<Exercise[]>(defaultExercises);
  const [sessionExercises, setSessionExercises] = useState<TrainingExercise[]>([]);
  const [currentDate] = useState(new Date().toLocaleDateString('ja-JP'));
  
  // モーダル状態
  const [isExerciseSelectOpen, setIsExerciseSelectOpen] = useState(false);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [isSetInputOpen, setIsSetInputOpen] = useState(false);
  
  // 選択された種目
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  // 新規種目追加フォーム
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseBodyPart, setNewExerciseBodyPart] = useState('');
  
  // セット入力フォーム
  const [sets, setSets] = useState<TrainingSet[]>([
    { id: '1', setNumber: 1, weight: 0, reps: 0, memo: '' }
  ]);

  // 合計値計算
  const calculateSummary = () => {
    const totalExercises = sessionExercises.length;
    const totalSets = sessionExercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const totalReps = sessionExercises.reduce(
      (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.reps, 0),
      0
    );
    const totalVolume = sessionExercises.reduce(
      (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0),
      0
    );
    return { totalExercises, totalSets, totalReps, totalVolume };
  };

  const summary = calculateSummary();

  // 部位でグループ化
  const groupedExercises = exercises.reduce((acc, ex) => {
    if (!acc[ex.bodyPart]) acc[ex.bodyPart] = [];
    acc[ex.bodyPart].push(ex);
    return acc;
  }, {} as Record<string, Exercise[]>);

  // 種目選択
  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsExerciseSelectOpen(false);
    setIsSetInputOpen(true);
    setSets([{ id: '1', setNumber: 1, weight: 0, reps: 0, memo: '' }]);
  };

  // 新規種目追加
  const handleAddNewExercise = () => {
    if (!newExerciseName || !newExerciseBodyPart) return;
    
    const newExercise: Exercise = {
      id: `custom-${Date.now()}`,
      name: newExerciseName,
      bodyPart: newExerciseBodyPart,
      isCustom: true
    };
    
    setExercises([...exercises, newExercise]);
    setNewExerciseName('');
    setNewExerciseBodyPart('');
    setIsAddExerciseOpen(false);
    // 種目選択モーダルを再度開く
    setIsExerciseSelectOpen(true);
  };

  // セット追加
  const addSet = () => {
    const newSet: TrainingSet = {
      id: String(sets.length + 1),
      setNumber: sets.length + 1,
      weight: sets[sets.length - 1]?.weight || 0,
      reps: sets[sets.length - 1]?.reps || 0,
      memo: ''
    };
    setSets([...sets, newSet]);
  };

  // セット更新
  const updateSet = (id: string, field: keyof TrainingSet, value: any) => {
    setSets(sets.map(set => set.id === id ? { ...set, [field]: value } : set));
  };

  // セット削除
  const deleteSet = (id: string) => {
    if (sets.length === 1) return;
    setSets(sets.filter(set => set.id !== id).map((set, idx) => ({ ...set, setNumber: idx + 1 })));
  };

  // トレーニング記録を保存
  const saveTraining = () => {
    if (!selectedExercise) return;
    
    const newExercise: TrainingExercise = {
      id: `training-${Date.now()}`,
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.name,
      bodyPart: selectedExercise.bodyPart,
      sets: sets
    };
    
    setSessionExercises([...sessionExercises, newExercise]);
    setIsSetInputOpen(false);
    setSelectedExercise(null);
    setSets([{ id: '1', setNumber: 1, weight: 0, reps: 0, memo: '' }]);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* 閉じるボタン（onCloseがある場合のみ表示） */}
      {onClose && (
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-50 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100"
          aria-label="閉じる"
        >
          <span className="text-2xl">✕</span>
        </button>
      )}
      
      {/* メイン画面 */}
      <div className="max-w-4xl mx-auto p-4">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{currentDate}</h1>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">種目数</div>
              <div className="text-2xl font-bold text-blue-600">{summary.totalExercises}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">セット数</div>
              <div className="text-2xl font-bold text-green-600">{summary.totalSets}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">レップ数</div>
              <div className="text-2xl font-bold text-purple-600">{summary.totalReps}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">負荷量</div>
              <div className="text-2xl font-bold text-orange-600">{summary.totalVolume.toLocaleString()}kg</div>
            </div>
          </div>
        </div>

        {/* トレーニング記録リスト */}
        {sessionExercises.length === 0 ? (
          <button
            onClick={() => setIsExerciseSelectOpen(true)}
            className="w-full bg-white rounded-lg shadow-md p-8 hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">➕</div>
              <div className="text-lg text-gray-600">タップしてトレーニング記録を追加</div>
            </div>
          </button>
        ) : (
          <div className="space-y-4">
            {sessionExercises.map((exercise) => (
              <div key={exercise.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{exercise.exerciseName}</h3>
                    <span className="text-sm text-gray-500">{exercise.bodyPart}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {exercise.sets.map((set) => (
                    <div key={set.id} className="flex items-center gap-2 text-sm">
                      <span className="w-16 text-gray-600">セット{set.setNumber}</span>
                      <span className="font-semibold">{set.weight}kg</span>
                      <span className="text-gray-400">×</span>
                      <span className="font-semibold">{set.reps}回</span>
                      {set.memo && <span className="text-gray-500 ml-2">📝 {set.memo}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <button
              onClick={() => setIsExerciseSelectOpen(true)}
              className="w-full bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 transition-colors font-semibold"
            >
              ➕ 種目を追加
            </button>
          </div>
        )}
      </div>

      {/* 種目選択モーダル */}
      {isExerciseSelectOpen && (
        <div 
          className="fixed inset-0 bg-white z-50 flex items-end"
          onClick={() => setIsExerciseSelectOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-4xl mx-auto rounded-t-2xl shadow-2xl"
            style={{ maxHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', marginBottom: '80px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー（固定） */}
            <div className="bg-white border-b p-4" style={{ flexShrink: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">種目を選択</h2>
                <button 
                  onClick={() => setIsExerciseSelectOpen(false)} 
                  className="text-2xl w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                >
                  ✕
                </button>
              </div>
              <button
                onClick={() => {
                  setIsExerciseSelectOpen(false);
                  setIsAddExerciseOpen(true);
                }}
                className="w-full bg-green-500 text-white rounded-lg py-2 hover:bg-green-600 transition-colors"
              >
                ➕ 部位・種目を追加
              </button>
            </div>
            
            {/* スクロール可能なコンテンツ */}
            <div 
              className="p-4"
              style={{ 
                flex: 1, 
                overflowY: 'auto', 
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {Object.entries(groupedExercises).map(([bodyPart, exs]) => (
                <div key={bodyPart} className="mb-6">
                  <h3 className="text-lg font-bold text-gray-700 mb-2 sticky top-0 bg-white py-1">{bodyPart}</h3>
                  <div className="space-y-2">
                    {exs.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => handleSelectExercise(ex)}
                        className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors active:bg-gray-200"
                      >
                        {ex.name}
                        {ex.isCustom && <span className="ml-2 text-xs text-green-600">カスタム</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {/* 最後の余白 */}
              <div style={{ height: '40px' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* 新規種目追加モーダル */}
      {isAddExerciseOpen && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">新しい種目を追加</h2>
              <button onClick={() => setIsAddExerciseOpen(false)} className="text-2xl">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">種目名</label>
                <input
                  type="text"
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="例: ダンベルプレス"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">部位</label>
                <input
                  type="text"
                  value={newExerciseBodyPart}
                  onChange={(e) => setNewExerciseBodyPart(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="例: 胸"
                />
              </div>
              
              <button
                onClick={handleAddNewExercise}
                className="w-full bg-green-500 text-white rounded-lg py-3 hover:bg-green-600 transition-colors font-semibold"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* セット入力モーダル */}
      {isSetInputOpen && selectedExercise && (
        <div className="fixed inset-0 bg-white flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-4xl rounded-t-2xl shadow-2xl flex flex-col" style={{ maxHeight: 'calc(100vh - 80px)', marginBottom: '80px' }}>
            <div className="sticky top-0 bg-white border-b p-4 flex-shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{selectedExercise.name}</h2>
                  <span className="text-sm text-gray-500">{selectedExercise.bodyPart}</span>
                </div>
                <button onClick={() => setIsSetInputOpen(false)} className="text-2xl">✕</button>
              </div>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto flex-1" style={{ paddingBottom: '20px' }}>
              {sets.map((set) => (
                <div key={set.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">セット {set.setNumber}</span>
                    {sets.length > 1 && (
                      <button
                        onClick={() => deleteSet(set.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        削除
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">重さ (kg)</label>
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateSet(set.id, 'weight', Number(e.target.value))}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">回数 (回)</label>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSet(set.id, 'reps', Number(e.target.value))}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">メモ</label>
                    <input
                      type="text"
                      value={set.memo}
                      onChange={(e) => updateSet(set.id, 'memo', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="任意"
                    />
                  </div>
                </div>
              ))}
              
              <button
                onClick={addSet}
                className="w-full bg-gray-200 text-gray-700 rounded-lg py-3 hover:bg-gray-300 transition-colors font-semibold"
              >
                ➕ セットを追加
              </button>
              
              <button
                onClick={saveTraining}
                className="w-full bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 transition-colors font-semibold"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}