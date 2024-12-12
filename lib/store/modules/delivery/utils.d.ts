import { STATUS_TASK, TYPE_RESOURCE } from '~/config/enums';
export interface IFilterProps {
    searchQuery?: string;
    teamId?: string;
    programId?: string;
    sequence?: number;
    status?: STATUS_TASK[];
    order?: 'desc' | 'asc';
    orderBy?: string;
    rowsPerPage?: number;
    top?: number;
    typeResource?: TYPE_RESOURCE.FINITO | TYPE_RESOURCE.INFINITO;
}
export declare const buildQuery: (filtro: IFilterProps) => string;
export declare const buildItem: (item: any) => {
    [x: string]: any;
    statuscode: any;
};
//# sourceMappingURL=utils.d.ts.map