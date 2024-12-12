import { IFilterResourceProps } from './utils';
import { IBlockUpdated } from '~/config/constants';
export declare const fetchAllResources: (filter: IFilterResourceProps) => any;
export declare const getResources: (filtro: IFilterResourceProps) => Promise<any>;
export declare const getResourcesByActivityId: (activityId: string) => Promise<any>;
export declare const addOrUpdateByActivities: (activities: any[], { dictTag }: any, filterEvent: IFilterResourceProps, blockUpdated: IBlockUpdated) => Promise<unknown>;
export declare const deleteByActivities: (activities: any[], { references, dictSpace, dictPeople }: any, blockUpdated: IBlockUpdated) => Promise<unknown>;
export declare const addOrUpdateByActivity: (activity: any, { references, dictTag }: {
    references: any;
    dictTag: any;
}) => Promise<unknown>;
export declare const deleteByActivity: (activityId: any) => any;
export declare const deleteBySchedule: (scheduleId: any) => any;
export declare const deleteByTeam: (teamId: any) => any;
export declare const deleteByProgram: (programId: any) => any;
//# sourceMappingURL=actions.d.ts.map