import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
interface ICalendar {
    teamChoosed: any;
    canEdit: boolean;
    scheduleChoosed: any;
    refetchSchedule: any;
    refetchTeam: any;
    schedules: any;
    context: WebPartContext;
}
declare const Calendar: React.FC<ICalendar>;
export default Calendar;
//# sourceMappingURL=index.d.ts.map