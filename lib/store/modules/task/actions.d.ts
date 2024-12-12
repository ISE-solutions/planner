import { IFilterProps } from './utils';
export declare const fetchAllTasks: (filter: IFilterProps) => any;
export declare const filterTask: (filter: IFilterProps) => Promise<any[]>;
export declare const getTaskById: (id: any) => Promise<unknown>;
export declare const addOrUpdateTask: (task: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
//# sourceMappingURL=actions.d.ts.map