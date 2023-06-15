import { takeEvery } from 'redux-saga/effects';

export function* helloSaga() {
	console.log('Hello Sagas!');
}

function* rootSaga() {
	yield takeEvery('USER_FETCH_REQUESTED', helloSaga);
}

export default rootSaga;
