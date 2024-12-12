import { Moment } from 'moment';
export interface IFilterProps {
    searchQuery?: string;
    deleted?: boolean;
    startDeleted?: Moment;
    endDeleted?: Moment;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    order?: 'desc' | 'asc';
    type?: string;
    orderBy?: string;
    rowsPerPage?: number;
    top?: number;
}
export declare const buildQuery: (filtro: IFilterProps) => string;
export declare const buildItem: (space: any) => {
    [x: string]: any;
};
export declare const buildItemPeople: (item: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
export declare const buildItemFantasyName: (item: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
export declare const buildItemCapacity: (item: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
//# sourceMappingURL=utils.d.ts.map