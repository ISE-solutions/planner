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
}
export declare const buildQuery: (filtro: IFilterProps) => string;
export declare const buildItemFantasyName: (item: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
//# sourceMappingURL=utils.d.ts.map