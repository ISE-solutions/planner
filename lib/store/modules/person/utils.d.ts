import { Moment } from 'moment';
export interface IFilterProps {
    searchQuery?: string;
    deleted?: boolean;
    startDeleted?: Moment;
    endDeleted?: Moment;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    order?: 'desc' | 'asc';
    orderBy?: string;
    rowsPerPage?: number;
    top?: number;
}
export declare const buildQuery: (filtro: IFilterProps) => string;
//# sourceMappingURL=utils.d.ts.map