import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from './modules/rootReducer';
export const store = createStore(reducers, applyMiddleware(thunk));
//# sourceMappingURL=index.js.map