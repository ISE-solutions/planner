import { IFilterProps } from './utils';
export declare const fetchAllPerson: (filter: IFilterProps) => any;
export declare const getPeople: (filter: IFilterProps) => Promise<any>;
export declare const getPerson: (email: any, emailType: any) => Promise<any>;
export declare const addOrUpdatePerson: (person: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const desactivePerson: (person: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const updatePerson: (id: any, toSave: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const deletePerson: (person: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const activePerson: (person: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const bulkUpdatePerson: (toUpdate: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
//# sourceMappingURL=actions.d.ts.map