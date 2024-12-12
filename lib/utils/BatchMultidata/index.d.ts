import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { RefetchOptions } from 'axios-hooks';
export default class BatchMultidata {
    constructor(axios: (config?: AxiosRequestConfig<any>, options?: RefetchOptions) => AxiosPromise<any>);
    batchId: string;
    changeset: string;
    requests: RequestMultiData[];
    axios: (config?: AxiosRequestConfig<any>, options?: RefetchOptions) => AxiosPromise<any>;
    patch(tableName: string, itemId: string, item: any): number;
    post(tableName: string, item: any): number;
    delete(tableName: string, itemId: any): void;
    putReference(reference: number, tableRelation: string, relationId: string, relationName: string): void;
    bulkPostRelationship(tableName: string, tableParent: string, parentId: string, relationName: string, items: any[]): void;
    postRelationship(tableName: string, tableParent: string, parentId: string, relationName: string, item: any): number;
    bulkPostRelationshipReference(tableName: string, reference: number, relationName: string, items: any[]): void;
    postRelationshipReference(tableName: string, reference: number, relationName: string, item: any): number;
    bulkPostReferenceRelatioship(tableName: string, tableParent: string, itemId: number, relationName: string, itemIds: string[]): void;
    bulkPostReference(tableName: string, itemIds: string[], reference: number, relationName: string): void;
    bulkDeleteReference(tableName: string, itemIds: string[], parentId: number, relationName: string): void;
    bulkDeleteReferenceParent(tableName: string, itemIds: string[], parentId: string, relationName: string): void;
    deleteReferenceParent(tableName: string, itemId: string, parentId: string, relationName: string): void;
    deleteReference(tableName: string, itemId: string, referenceId: number, relationName: string): void;
    addReference(tableName: string, reference: number, itemId: string, relationName: string): void;
    postReference(tableName: string, itemId: string, reference: number, relationName: string): number;
    add(method: string, isReference: boolean, uri: string, data: any): void;
    addFile(tableName: string, fieldName: string, tableReference: string, fieldReference: string, idReference: string, file: any): Promise<unknown>;
    toString(): string;
    private payloadToString;
    private makeId;
    execute(): Promise<unknown>;
    executeChuncked(): Promise<unknown>;
}
declare class RequestMultiData {
    changeset: string;
    contentId: number;
    method: string;
    uri: string;
    isReference: boolean;
    data: any;
    contentType?: string;
    constructor(changeset: string, contentId: number, method: string, uri: string, isReference: boolean, data: any, contentType?: string);
    toString(): string;
}
export {};
//# sourceMappingURL=index.d.ts.map