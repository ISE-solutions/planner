import { IFilterProps } from './utils';
export declare const fetchAllTags: (filter: IFilterProps) => any;
export declare const getTags: (filter: IFilterProps) => Promise<any>;
export declare const getTagByName: (name: any) => Promise<unknown>;
export declare const addOrUpdateTag: (tag: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const updateTag: (id: any, toSave: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const desactiveTag: (tag: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const activeTag: (tag: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const deleteTag: (tag: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const bulkUpdateTag: (toUpdate: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
//# sourceMappingURL=actions.d.ts.map