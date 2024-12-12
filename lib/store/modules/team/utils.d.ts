import * as moment from 'moment';
import { EGroups } from '~/config/enums';
export interface IFilterProps {
    searchQuery?: string;
    deleted?: boolean;
    programDeleted?: boolean;
    startDeleted?: moment.Moment;
    endDeleted?: moment.Moment;
    programId?: string;
    filterProgram?: boolean;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    published?: 'Todos' | 'Sim' | 'Não';
    order?: 'desc' | 'asc';
    group?: EGroups;
    createdBy?: string;
    orderBy?: string;
    model?: boolean;
    rowsPerPage?: number;
    modality?: string;
    yearConclusion?: string;
    initials?: string;
}
export declare const buildQuery: (filtro: IFilterProps) => string;
export declare const buildAdvancedQuery: (filtro: any[]) => string;
export declare const buildItem: (team: any) => {
    [x: string]: any;
};
export declare const buildItemSchedule: (schedule: any) => {
    [x: string]: any;
};
export declare const buildItemActivity: (activity: any) => {
    [x: string]: any;
};
export declare const buildItemFantasyName: (item: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
export declare const buildItemParticipant: (item: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
export declare const buildItemPeopleTeam: (item: any, pos: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
export declare const buildItemPeople: (item: any) => {
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
    deleted: any;
};
export declare const buildItemPeopleAcademicRequest: (item: any) => {
    [x: string]: any;
    id: any;
    deleted: any;
};
//# sourceMappingURL=utils.d.ts.map