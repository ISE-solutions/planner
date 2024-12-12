import * as moment from 'moment';
import { EActivityTypeApplication, EGroups, TYPE_ACTIVITY } from '~/config/enums';
export interface IFilterProps {
    searchQuery?: string;
    deleted?: boolean;
    startDeleted?: moment.Moment;
    endDeleted?: moment.Moment;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    published?: 'Todos' | 'Sim' | 'Não';
    order?: 'desc' | 'asc';
    createdBy?: string;
    academicArea?: string;
    name?: string;
    group?: EGroups;
    typesApplication?: [
        EActivityTypeApplication.PLANEJAMENTO | EActivityTypeApplication.AGRUPAMENTO | EActivityTypeApplication.MODELO | EActivityTypeApplication.MODELO_REFERENCIA | EActivityTypeApplication.APLICACAO
    ];
    typeApplication?: EActivityTypeApplication.PLANEJAMENTO | EActivityTypeApplication.AGRUPAMENTO | EActivityTypeApplication.MODELO | EActivityTypeApplication.MODELO_REFERENCIA | EActivityTypeApplication.APLICACAO;
    typeActivity?: TYPE_ACTIVITY.ACADEMICA | TYPE_ACTIVITY.NON_ACADEMICA | TYPE_ACTIVITY.INTERNAL;
    type?: string;
    teamId?: string;
    programId?: string;
    schedulesId?: string[];
    startDate?: moment.Moment;
    endDate?: moment.Moment;
    orderBy?: string;
    rowsPerPage?: number;
}
export declare const buildQuery: (filtro: IFilterProps) => string;
export declare const buildAdvancedQuery: (filtro: any[]) => string;
export declare const buildItem: (activity: any) => {
    [x: string]: any;
};
export declare const buildItemFantasyName: (item: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
export declare const buildItemPeople: (item: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
export declare const buildItemPeopleAcademicRequest: (item: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
export declare const buildItemDocument: (item: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
export declare const buildItemAcademicRequest: (item: any) => {
    [x: string]: any;
    id: any;
};
//# sourceMappingURL=utils.d.ts.map