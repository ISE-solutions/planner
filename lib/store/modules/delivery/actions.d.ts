import { IFilterProps } from './utils';
export declare const fetchAllTasks: (filter: IFilterProps) => any;
export declare const filterTask: (filter: IFilterProps) => Promise<any[]>;
export declare const getDeliveryById: (id: any) => Promise<unknown>;
export declare const getDeliveryByTeamId: (teamId: any) => Promise<any[]>;
export declare const addOrUpdateDelivery: (delivery: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const updateDelivery: (id: any, toSave: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
//# sourceMappingURL=actions.d.ts.map