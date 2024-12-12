import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
interface IListDays {
    schedules: any[];
    canEdit: boolean;
    context: WebPartContext;
    scheduleChoosed: any;
    teamChoosed: any;
    programChoosed: any;
    setScheduleChoosed: any;
    addUpdateSchedule: any;
    teamId?: string;
    programId?: string;
    refetchSchedule: () => void;
    refetchTeam: () => void;
}
declare const ListDays: React.FC<IListDays>;
export default ListDays;
//# sourceMappingURL=index.d.ts.map