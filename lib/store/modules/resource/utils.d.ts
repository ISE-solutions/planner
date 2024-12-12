import * as moment from 'moment';
export interface IFilterResourceProps {
    searchQuery?: string;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    order?: 'desc' | 'asc';
    deleted?: boolean;
    filterDeleted?: boolean;
    programId?: string;
    teamId?: string;
    scheduleId?: string;
    activityId?: string;
    orderBy?: string;
    rowsPerPage?: number;
    startDate?: moment.Moment;
    endDate?: moment.Moment;
    dayDate?: moment.Moment;
    people?: any[];
    spaces?: any[];
}
export declare const buildQuery: (filtro?: IFilterResourceProps) => string;
export declare const buildItem: (item: any) => {
    [x: string]: any;
};
//# sourceMappingURL=utils.d.ts.map