import { IFilterProps } from './utils';
export declare const getSchedules: (filter: IFilterProps) => any;
export declare const getScheduleByIds: (scheduleIds: string[]) => Promise<any>;
export declare const getScheduleId: (scheduleId: any) => Promise<any>;
export declare const getScheduleByDateAndTeam: (date: string, teamId: string) => Promise<any>;
export declare const fetchAdvancedSchedules: (filter: string) => any;
export declare const addUpdateSchedule: (schedule: any, teamId: string, programId: string, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}, temperatureChanged?: boolean, isUndo?: boolean) => any;
export declare const updateSchedule: (id: any, toSave: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const deleteSchedule: (id: string, activities: any[], { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
//# sourceMappingURL=actions.d.ts.map