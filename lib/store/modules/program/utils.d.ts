import { EGroups } from '~/config/enums';
export declare enum TYPE_PROGRAM_FILTER {
    TODOS = 0,
    PROGRAMA = 1,
    RESERVA = 2
}
export interface IFilterProps {
    searchQuery?: string;
    deleted?: boolean;
    startDeleted?: moment.Moment;
    endDeleted?: moment.Moment;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    published?: 'Todos' | 'Sim' | 'Não';
    type?: TYPE_PROGRAM_FILTER;
    order?: 'desc' | 'asc';
    orderBy?: string;
    createdBy?: string;
    group?: EGroups;
    rowsPerPage?: number;
    model?: boolean;
    typeProgram?: string;
    nameProgram?: string;
    institute?: string;
    company?: string;
}
export declare const buildQuery: (filtro: IFilterProps) => string;
export declare const buildAdvancedQuery: (filtro: any[]) => string;
export declare const buildItem: (program: any) => {
    [x: string]: any;
};
export declare const buildItemFantasyName: (item: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
export declare const buildItemPeople: (item: any, pos: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
//# sourceMappingURL=utils.d.ts.map