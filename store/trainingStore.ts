// store/trainingStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TrainingSession, TrainingExercise, TrainingSet, Exercise } from '../types/training';
// デフォルトの種目リスト
const defaultExercises: Exercise[] = [
  // 胸
  { id: 'ex-1', name: 'ベンチプレス', bodyPart: '胸', isCustom: false },
  { id: 'ex-2', name: 'インクラインベンチプレス', bodyPart: '胸', isCustom: false },
  { id: 'ex-3', name: 'ダンベルフライ', bodyPart: '胸', isCustom: false },
  // 背中
  { id: 'ex-4', name: 'デッドリフト', bodyPart: '背中', isCustom: false },
  { id: 'ex-5', name: 'ラットプルダウン', bodyPart: '背中', isCustom: false },
  { id: 'ex-6', name: 'ベントオーバーロウ', bodyPart: '背中', isCustom: false },
  // 脚
  { id: 'ex-7', name: 'スクワット', bodyPart: '脚', isCustom: false },
  { id: 'ex-8', name: 'レッグプレス', bodyPart: '脚', isCustom: false },
  { id: 'ex-9', name: 'レッグカール', bodyPart: '脚', isCustom: false },
  // 肩
  { id: 'ex-10', name: 'ショルダープレス', bodyPart: '肩', isCustom: false },
  { id: 'ex-11', name: 'サイドレイズ', bodyPart: '肩', isCustom: false },
  { id: 'ex-12', name: 'リアデルト', bodyPart: '肩', isCustom: false },
  // 腕
  { id: 'ex-13', name: 'バーベルカール', bodyPart: '腕', isCustom: false },
  { id: 'ex-14', name: 'トライセプスエクステンション', bodyPart: '腕', isCustom: false },
];

interface TrainingState {
  sessions: TrainingSession[];
  exercises: Exercise[];
  currentSession: TrainingSession | null;
  
  // セッション管理
  createSession: (date: string) => void;
  setCurrentSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  
  // エクササイズ管理
  addExerciseToSession: (sessionId: string, exercise: TrainingExercise) => void;
  updateExerciseInSession: (sessionId: string, exerciseId: string, sets: TrainingSet[]) => void;
  deleteExerciseFromSession: (sessionId: string, exerciseId: string) => void;
  
  // 種目マスター管理
  addCustomExercise: (name: string, bodyPart: string) => Exercise;
  deleteCustomExercise: (exerciseId: string) => void;
  
  // ユーティリティ
  getSessionByDate: (date: string) => TrainingSession | undefined;
  calculateSummary: (sessionId: string) => {
    totalExercises: number;
    totalSets: number;
    totalReps: number;
    totalVolume: number;
  };
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      sessions: [],
      exercises: defaultExercises,
      currentSession: null,

      createSession: (date: string) => {
        const newSession: TrainingSession = {
          id: `session-${Date.now()}`,
          date,
          exercises: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSession: newSession,
        }));
      },

      setCurrentSession: (sessionId: string) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        if (session) {
          set({ currentSession: session });
        }
      },

      deleteSession: (sessionId: string) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
          currentSession: state.currentSession?.id === sessionId ? null : state.currentSession,
        }));
      },

      addExerciseToSession: (sessionId: string, exercise: TrainingExercise) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  exercises: [...session.exercises, exercise],
                  updatedAt: new Date(),
                }
              : session
          ),
        }));
        // currentSessionも更新
        const updatedSession = get().sessions.find((s) => s.id === sessionId);
        if (updatedSession && get().currentSession?.id === sessionId) {
          set({ currentSession: updatedSession });
        }
      },

      updateExerciseInSession: (sessionId: string, exerciseId: string, sets: TrainingSet[]) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  exercises: session.exercises.map((ex) =>
                    ex.id === exerciseId ? { ...ex, sets } : ex
                  ),
                  updatedAt: new Date(),
                }
              : session
          ),
        }));
        // currentSessionも更新
        const updatedSession = get().sessions.find((s) => s.id === sessionId);
        if (updatedSession && get().currentSession?.id === sessionId) {
          set({ currentSession: updatedSession });
        }
      },

      deleteExerciseFromSession: (sessionId: string, exerciseId: string) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  exercises: session.exercises.filter((ex) => ex.id !== exerciseId),
                  updatedAt: new Date(),
                }
              : session
          ),
        }));
        // currentSessionも更新
        const updatedSession = get().sessions.find((s) => s.id === sessionId);
        if (updatedSession && get().currentSession?.id === sessionId) {
          set({ currentSession: updatedSession });
        }
      },

      addCustomExercise: (name: string, bodyPart: string) => {
        const newExercise: Exercise = {
          id: `custom-${Date.now()}`,
          name,
          bodyPart,
          isCustom: true,
        };
        set((state) => ({
          exercises: [...state.exercises, newExercise],
        }));
        return newExercise;
      },

      deleteCustomExercise: (exerciseId: string) => {
        set((state) => ({
          exercises: state.exercises.filter((ex) => ex.id !== exerciseId),
        }));
      },

      getSessionByDate: (date: string) => {
        return get().sessions.find((s) => s.date === date);
      },

      calculateSummary: (sessionId: string) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        if (!session) {
          return { totalExercises: 0, totalSets: 0, totalReps: 0, totalVolume: 0 };
        }

        const totalExercises = session.exercises.length;
        const totalSets = session.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
        const totalReps = session.exercises.reduce(
          (sum, ex) => {
            return sum + ex.sets.reduce((s, set) => s + set.reps, 0);
          },
          0
        );
        const totalVolume = session.exercises.reduce(
          (sum, ex) => {
            return sum + ex.sets.reduce((s, set) => s + (set.weight * set.reps), 0);
          },
          0
        );

        return { totalExercises, totalSets, totalReps, totalVolume };
      },
    }),
    {
      name: 'training-storage',
    }
  )
);