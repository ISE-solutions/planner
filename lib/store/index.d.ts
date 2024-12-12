import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import reducers from './modules/rootReducer';
export declare const store: import("redux").Store<import("redux").EmptyObject & {
    activity: any;
    tag: any;
    app: any;
    team: any;
    program: any;
    person: any;
    resource: any;
    finiteInfiniteResource: any;
    space: any;
    task: any;
    notification: any;
    delivery: any;
    eventOutlook: any;
    environmentReference: any;
    customFilter: any;
    batchEdition: any;
    genericActions: any;
}, AnyAction> & {
    dispatch: unknown;
};
export declare type AppState = ReturnType<typeof reducers>;
export declare type AppDispatch = typeof store.dispatch;
export declare type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, AnyAction>;
//# sourceMappingURL=index.d.ts.map