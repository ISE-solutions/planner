import * as moment from 'moment';
import { EGroups, TYPE_ACTIVITY } from '~/config/enums';
export interface IFilterProps {
    searchQuery?: string;
    deleted?: boolean;
    teamDeleted?: boolean;
    startDeleted?: moment.Moment;
    endDeleted?: moment.Moment;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    order?: 'desc' | 'asc';
    typeActivity?: TYPE_ACTIVITY.ACADEMICA | TYPE_ACTIVITY.NON_ACADEMICA | TYPE_ACTIVITY.INTERNAL;
    type?: string;
    date?: string;
    teamId?: string;
    createdBy?: string;
    filterTeam?: boolean;
    groupPermition?: EGroups;
    model?: boolean;
    group?: 'Todos' | 'Sim' | 'Não';
    published?: 'Todos' | 'Sim' | 'Não';
    orderBy?: string;
    modality?: string;
    module?: string;
    rowsPerPage?: number;
}
export declare const buildQuery: (filtro: IFilterProps) => string;
export declare const buildAdvancedQuery: (filtro: any[]) => string;
export declare const buildItem: (schedule: any) => {
    [x: string]: any;
};
export declare const buildItemLocale: (item: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
export declare const buildItemPeopleAcademicRequest: (item: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
//# sourceMappingURL=utils.d.ts.map