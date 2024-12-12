import * as moment from 'moment';
export interface IFilterProps {
    pessoaId: string;
    searchQuery?: string;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    order?: 'desc' | 'asc';
    orderBy?: string;
    rowsPerPage?: number;
    startDate?: moment.Moment;
    endDate?: moment.Moment;
    dayDate?: moment.Moment;
    people?: any[];
    spaces?: any[];
}
export declare const buildQuery: (filtro: IFilterProps) => string;
export declare const buildItem: (item: any) => {
    [x: string]: any;
};
export declare const truncateString: (string: any, maxLength: any) => any;
//# sourceMappingURL=utils.d.ts.map