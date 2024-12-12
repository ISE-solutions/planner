import { IFilterProps } from './utils';
export declare const fetchAllFiniteInfiniteResources: (filter: IFilterProps) => any;
export declare const getFiniteInfiniteResources: (filter: IFilterProps) => Promise<any>;
export declare const addOrUpdateFiniteInfiniteResource: (finiteResource: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => Promise<unknown>;
export declare const desactiveFiniteInfiniteResource: (finiteResource: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => void;
export declare const activeFiniteInfiniteResource: (finiteResource: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => void;
export declare const updateResource: (id: any, toSave: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const bulkUpdateFiniteInfiniteResource: (toUpdate: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => Promise<void>;
export declare const deleteResource: (item: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
//# sourceMappingURL=actions.d.ts.map