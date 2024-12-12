import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
interface IListDays {
    canEdit: boolean;
    schedules: any[];
    scheduleChoosed: any;
    teamChoosed: any;
    context: WebPartContext;
    refetch: any;
    handleSchedule: (schedule: any) => any;
}
declare const ListDays: React.FC<IListDays>;
export default ListDays;
//# sourceMappingURL=index.d.ts.map