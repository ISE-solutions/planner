import { IExceptionOption } from '../types';
import { EActivityTypeApplication, TYPE_ACTIVITY } from '~/config/enums';
interface IUseActivity {
    activities: any[];
    count: number;
    loading: boolean;
    postLoading: boolean;
    loadingSave: boolean;
    nextLink: string;
    addOrUpdateActivity: (activity: any, options?: IExceptionOption) => Promise<unknown>;
    updateActivityAll: (activity: any, options?: IExceptionOption) => Promise<unknown>;
    bulkUpdateActivity: (toUpdate: any, options?: IExceptionOption) => void;
    desactiveActivity: (toUpdate: any, options?: IExceptionOption) => void;
    addOrUpdateClassroom: (toUpdate: any, options?: IExceptionOption) => Promise<unknown>;
    addOrUpdateDocuments: (toUpdate: any, options?: IExceptionOption) => Promise<unknown>;
    addOrUpdatePerson: (toUpdate: any, options?: IExceptionOption) => Promise<unknown>;
    addOrUpdateObservation: (toUpdate: any, options?: IExceptionOption) => Promise<unknown>;
    activeActivity: (toUpdate: any, options?: IExceptionOption) => void;
    bulkAddUpdateActivity: (activities: any[], activitiesToDelete: any[], teamId: string, typeApplication: EActivityTypeApplication.APLICACAO | EActivityTypeApplication.MODELO, options?: IExceptionOption) => void;
    addOrUpdateFantasyName: (toUpdate: any, options?: IExceptionOption) => void;
    updateActivity: (id: any, toSave: any, options?: IExceptionOption) => Promise<any>;
    updateEnvolvedPerson: (id: any, activityId: any, toSave: any, { onSuccess, onError, }: {
        onSuccess: any;
        onError: any;
    }) => Promise<any>;
    getActivity: (id: any) => Promise<any>;
    changeActivityDate: (activity: any, previousSchedule: any, newSchedule: any, options?: IExceptionOption) => Promise<any>;
    getActivityByTeamId: (teamId: string) => Promise<any>;
    getActivityByScheduleId: (scheduleId: string) => Promise<any>;
    refetch: any;
    error: any;
}
interface IFilterProps {
    searchQuery?: string;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    order?: 'desc' | 'asc';
    typeApplication?: EActivityTypeApplication.PLANEJAMENTO | EActivityTypeApplication.AGRUPAMENTO | EActivityTypeApplication.MODELO | EActivityTypeApplication.MODELO_REFERENCIA | EActivityTypeApplication.APLICACAO;
    typeActivity?: TYPE_ACTIVITY.ACADEMICA | TYPE_ACTIVITY.NON_ACADEMICA | TYPE_ACTIVITY.INTERNAL;
    type?: string;
    teamId?: string;
    orderBy?: string;
    rowsPerPage?: number;
}
interface IOptions {
    manual?: boolean;
}
declare const useActivity: (filter: IFilterProps, options?: IOptions) => IUseActivity[];
export default useActivity;
//# sourceMappingURL=useActivity.d.ts.map