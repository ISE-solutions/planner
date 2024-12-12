import { IFilterProps } from './utils';
export declare const fetchAllNotification: (filter: IFilterProps) => any;
export declare const addOrUpdateNotification: (notification: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const batchAddNotification: (notifications: any[], { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const readAllNotification: (ids: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => Promise<any>;
export declare const readNotification: (id: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => Promise<any>;
//# sourceMappingURL=actions.d.ts.map