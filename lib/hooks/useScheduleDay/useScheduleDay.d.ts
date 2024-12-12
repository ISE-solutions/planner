import { IExceptionOption } from '../types';
import { EGroups, TYPE_ACTIVITY } from '~/config/enums';
interface IUseActivity {
    schedule: any[];
    count: number;
    loading: boolean;
    nextLink: string;
    addUpdateSchedule: (schedule: any, teamId: string, programId: string, options?: IExceptionOption, hasRefetch?: boolean) => void;
    desactiveSchedule: (id: string, activities: any[], options?: IExceptionOption) => void;
    updateEnvolvedPerson: (id: any, scheduleId: any, toSave: any, options?: IExceptionOption) => Promise<any>;
    updateSchedule: (id: any, toSave: any, options?: IExceptionOption) => Promise<any>;
    getScheduleByTeamId: (teamId: string) => Promise<any>;
    getSchedule: (filter: IFilterProps) => Promise<any>;
    refetch: any;
    error: any;
}
interface IFilterProps {
    searchQuery?: string;
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
interface IOptions {
    manual?: boolean;
}
declare const useScheduleDay: (filter: IFilterProps, options?: IOptions) => IUseActivity[];
export default useScheduleDay;
//# sourceMappingURL=useScheduleDay.d.ts.map