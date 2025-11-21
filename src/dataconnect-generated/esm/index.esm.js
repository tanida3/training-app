import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'training-app',
  location: 'asia-east1'
};

export const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';

export function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
}

export const getExercisesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetExercises');
}
getExercisesRef.operationName = 'GetExercises';

export function getExercises(dc) {
  return executeQuery(getExercisesRef(dc));
}

export const createGoalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateGoal', inputVars);
}
createGoalRef.operationName = 'CreateGoal';

export function createGoal(dcOrVars, vars) {
  return executeMutation(createGoalRef(dcOrVars, vars));
}

export const updateWorkoutSessionNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWorkoutSessionNotes', inputVars);
}
updateWorkoutSessionNotesRef.operationName = 'UpdateWorkoutSessionNotes';

export function updateWorkoutSessionNotes(dcOrVars, vars) {
  return executeMutation(updateWorkoutSessionNotesRef(dcOrVars, vars));
}

