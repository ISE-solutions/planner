import { Moment } from 'moment';
export interface IFilterProps {
    searchQuery?: string;
    deleted?: boolean;
    startDeleted?: Moment;
    endDeleted?: Moment;
    published?: boolean;
    me?: string;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    order?: 'desc' | 'asc';
    type?: string;
    orderBy?: string;
    rowsPerPage?: number;
}
export declare const buildQuery: (filtro: IFilterProps) => string;
export declare const buildItem: (item: any) => {
    [x: string]: any;
};
//# sourceMappingURL=utils.d.ts.map