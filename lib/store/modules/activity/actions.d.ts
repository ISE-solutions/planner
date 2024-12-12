import { IFilterProps } from './utils';
export declare const fetchAllActivities: (filter: IFilterProps) => any;
export declare const fetchAdvancedActivities: (filter: string) => any;
export declare const getActivities: (filter: IFilterProps) => any;
export declare const getActivity: (id: any) => Promise<any>;
export declare const getActivityByIds: (ids: string[]) => Promise<any>;
export declare const getActivityPermitions: (id: any) => Promise<any>;
export declare const getActivityByScheduleId: (scheduleId: string, onlyActive?: boolean) => Promise<any>;
export declare const getActivityByTeamId: (teamId: string) => Promise<any>;
export declare const getActivityByProgramId: (programId: string) => Promise<any>;
export declare const getActivityByName: (name: any, type: any) => Promise<unknown>;
export declare const getAcademicRequestsByActivityId: (activityId: string) => Promise<any[]>;
export declare const getAcademicRequestsByTeamId: (teamId: string) => Promise<any[]>;
export declare const addOrUpdateActivity: (activity: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const updateActivityAll: (activity: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const batchUpdateActivityAll: (activities: any, activityRef: any, { programId, teamId, scheduleId }: {
    programId: any;
    teamId: any;
    scheduleId: any;
}, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const updateActivity: (id: any, toSave: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => Promise<unknown>;
export declare const batchUpdateActivity: (activities: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => Promise<unknown>;
export declare const updateEnvolvedPerson: (id: any, activityId: any, toSave: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => Promise<any>;
export declare const deleteActivity: (item: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const changeActivityDate: (activity: any, previousSchedule: any, newSchedule: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const addOrUpdateClassroom: (activity: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}, returnNewValue?: boolean) => Promise<unknown>;
export declare const addOrUpdateDocuments: (activity: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}, returnNewValue?: boolean) => Promise<unknown>;
export declare const addOrUpdatePerson: (activity: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}, returnNewValue?: boolean) => Promise<unknown>;
export declare const addOrUpdateObservation: (activity: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => Promise<unknown>;
export declare const addOrUpdateFantasyName: (activity: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}, returnNewValue?: boolean) => Promise<unknown>;
export declare const desactiveActivity: (activity: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const activeActivity: (activity: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => void;
export declare const bulkUpdateActivity: (toUpdate: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => Promise<void>;
//# sourceMappingURL=actions.d.ts.map