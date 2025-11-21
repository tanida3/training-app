const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'training-app',
  location: 'asia-east1'
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
};

const getExercisesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetExercises');
}
getExercisesRef.operationName = 'GetExercises';
exports.getExercisesRef = getExercisesRef;

exports.getExercises = function getExercises(dc) {
  return executeQuery(getExercisesRef(dc));
};

const createGoalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateGoal', inputVars);
}
createGoalRef.operationName = 'CreateGoal';
exports.createGoalRef = createGoalRef;

exports.createGoal = function createGoal(dcOrVars, vars) {
  return executeMutation(createGoalRef(dcOrVars, vars));
};

const updateWorkoutSessionNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWorkoutSessionNotes', inputVars);
}
updateWorkoutSessionNotesRef.operationName = 'UpdateWorkoutSessionNotes';
exports.updateWorkoutSessionNotesRef = updateWorkoutSessionNotesRef;

exports.updateWorkoutSessionNotes = function updateWorkoutSessionNotes(dcOrVars, vars) {
  return executeMutation(updateWorkoutSessionNotesRef(dcOrVars, vars));
};
