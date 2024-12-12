import * as React from 'react';
interface ISchedulesProps {
    schedules: any[];
    isModel: boolean;
    isLoadModel: boolean;
    isDetail: boolean;
    isSaved: boolean;
    removeDaySchedule: (scheduleId: string) => void;
    getActivityByTeamId: (teamId: string) => Promise<any>;
    handleSchedule: (sche: any) => void;
    refetch: any;
}
declare const Schedules: React.FC<ISchedulesProps>;
export default Schedules;
//# sourceMappingURL=index.d.ts.map