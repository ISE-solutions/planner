import { IFilterProps } from './utils';
export declare const fetchAllSpace: (filter: IFilterProps) => any;
export declare const getSpaces: (filter: IFilterProps) => Promise<any>;
export declare const getSpace: (id: any) => Promise<unknown>;
export declare const getSpaceByName: (name: any) => any;
export declare const getSpaceByEmail: (email: string) => Promise<any>;
export declare const addOrUpdateSpace: (space: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const desactiveSpace: (space: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const activeSpace: (space: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const deleteSpace: (item: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const updateSpace: (id: any, toSave: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const bulkUpdateSpace: (toUpdate: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
//# sourceMappingURL=actions.d.ts.map