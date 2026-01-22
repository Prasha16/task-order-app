import { all } from 'redux-saga/effects';
import { watchTasksSaga } from './tasksSaga';
 
export function* rootSaga() {
  yield all([watchTasksSaga()]);
}