// types.ts

export interface TrainingSet {
  id: string;
  setNumber: number;
  weight: number; // kg
  reps: number; // 回数
  memo?: string;
}

export interface TrainingExercise {
  id: string;
  exerciseId: string; // 種目ID
  exerciseName: string;
  bodyPart: string; // 部位
  sets: TrainingSet[];
  createdAt: Date;
}

export interface TrainingSession {
  id: string;
  date: string; // YYYY-MM-DD形式
  exercises: TrainingExercise[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  isCustom: boolean; // ユーザーが追加したかどうか
}

export interface TrainingSummary {
  totalExercises: number; // 合計種目数
  totalSets: number; // 合計セット数
  totalReps: number; // 合計レップ数
  totalVolume: number; // 合計負荷量 (kg)
}