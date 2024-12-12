import { AnyAction, applyMiddleware, createStore } from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';
import reducers from './modules/rootReducer';

export const store = createStore(reducers, applyMiddleware(thunk));

export type AppState = ReturnType<typeof reducers>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  AnyAction
>;
