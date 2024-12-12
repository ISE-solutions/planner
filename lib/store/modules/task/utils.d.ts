import { STATUS_TASK, TYPE_RESOURCE } from '~/config/enums';
export interface IFilterProps {
    searchQuery?: string;
    teamId?: string;
    programId?: string;
    instituteId?: string[];
    companyId?: string[];
    typeProgramId?: string[];
    programTemperatureId?: string[];
    teamYearConclusion?: string;
    teamSigla?: string;
    teamName?: string;
    teamTemperatureId?: string[];
    delivery?: string;
    responsible?: string[];
    start?: string;
    end?: string;
    endForecastConclusion?: string;
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