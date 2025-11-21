import { CreateUserData, CreateUserVariables, GetExercisesData, CreateGoalData, CreateGoalVariables, UpdateWorkoutSessionNotesData, UpdateWorkoutSessionNotesVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useGetExercises(options?: useDataConnectQueryOptions<GetExercisesData>): UseDataConnectQueryResult<GetExercisesData, undefined>;
export function useGetExercises(dc: DataConnect, options?: useDataConnectQueryOptions<GetExercisesData>): UseDataConnectQueryResult<GetExercisesData, undefined>;

export function useCreateGoal(options?: useDataConnectMutationOptions<CreateGoalData, FirebaseError, CreateGoalVariables>): UseDataConnectMutationResult<CreateGoalData, CreateGoalVariables>;
export function useCreateGoal(dc: DataConnect, options?: useDataConnectMutationOptions<CreateGoalData, FirebaseError, CreateGoalVariables>): UseDataConnectMutationResult<CreateGoalData, CreateGoalVariables>;

export function useUpdateWorkoutSessionNotes(options?: useDataConnectMutationOptions<UpdateWorkoutSessionNotesData, FirebaseError, UpdateWorkoutSessionNotesVariables>): UseDataConnectMutationResult<UpdateWorkoutSessionNotesData, UpdateWorkoutSessionNotesVariables>;
export function useUpdateWorkoutSessionNotes(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateWorkoutSessionNotesData, FirebaseError, UpdateWorkoutSessionNotesVariables>): UseDataConnectMutationResult<UpdateWorkoutSessionNotesData, UpdateWorkoutSessionNotesVariables>;
