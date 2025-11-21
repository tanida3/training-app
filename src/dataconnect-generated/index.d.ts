import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateGoalData {
  goal_insert: Goal_Key;
}

export interface CreateGoalVariables {
  exerciseId: UUIDString;
  userId: UUIDString;
  createdAt: TimestampString;
  dueDate: DateString;
  targetType: string;
  targetValue: number;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  username: string;
  email: string;
  createdAt: TimestampString;
}

export interface ExerciseEntry_Key {
  id: UUIDString;
  __typename?: 'ExerciseEntry_Key';
}

export interface Exercise_Key {
  id: UUIDString;
  __typename?: 'Exercise_Key';
}

export interface GetExercisesData {
  exercises: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    isCustom: boolean;
  } & Exercise_Key)[];
}

export interface Goal_Key {
  id: UUIDString;
  __typename?: 'Goal_Key';
}

export interface UpdateWorkoutSessionNotesData {
  workoutSession_update?: WorkoutSession_Key | null;
}

export interface UpdateWorkoutSessionNotesVariables {
  id: UUIDString;
  notes?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface WorkoutSession_Key {
  id: UUIDString;
  __typename?: 'WorkoutSession_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface GetExercisesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetExercisesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetExercisesData, undefined>;
  operationName: string;
}
export const getExercisesRef: GetExercisesRef;

export function getExercises(): QueryPromise<GetExercisesData, undefined>;
export function getExercises(dc: DataConnect): QueryPromise<GetExercisesData, undefined>;

interface CreateGoalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGoalVariables): MutationRef<CreateGoalData, CreateGoalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateGoalVariables): MutationRef<CreateGoalData, CreateGoalVariables>;
  operationName: string;
}
export const createGoalRef: CreateGoalRef;

export function createGoal(vars: CreateGoalVariables): MutationPromise<CreateGoalData, CreateGoalVariables>;
export function createGoal(dc: DataConnect, vars: CreateGoalVariables): MutationPromise<CreateGoalData, CreateGoalVariables>;

interface UpdateWorkoutSessionNotesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWorkoutSessionNotesVariables): MutationRef<UpdateWorkoutSessionNotesData, UpdateWorkoutSessionNotesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateWorkoutSessionNotesVariables): MutationRef<UpdateWorkoutSessionNotesData, UpdateWorkoutSessionNotesVariables>;
  operationName: string;
}
export const updateWorkoutSessionNotesRef: UpdateWorkoutSessionNotesRef;

export function updateWorkoutSessionNotes(vars: UpdateWorkoutSessionNotesVariables): MutationPromise<UpdateWorkoutSessionNotesData, UpdateWorkoutSessionNotesVariables>;
export function updateWorkoutSessionNotes(dc: DataConnect, vars: UpdateWorkoutSessionNotesVariables): MutationPromise<UpdateWorkoutSessionNotesData, UpdateWorkoutSessionNotesVariables>;

