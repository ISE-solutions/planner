import { IBlockUpdated } from '~/config/constants';
export declare const executeEventOutlook: (blockUpdated: IBlockUpdated, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const executeEventDeleteOutlook: (blockUpdated: IBlockUpdated, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const addOrUpdateEventsByResources: (blockUpdated: IBlockUpdated) => Promise<unknown>;
export declare const deleteEventsByResources: (resources: any, { references, dictPeople, dictSpace }: {
    references: any;
    dictPeople: any;
    dictSpace: any;
}, blockUpdated: IBlockUpdated) => Promise<unknown>;
//# sourceMappingURL=actions.d.ts.map