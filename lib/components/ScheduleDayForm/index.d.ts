import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
interface IScheduleDayForm {
    visible: boolean;
    isDraft?: boolean;
    titleRequired?: boolean;
    program?: any;
    team?: any;
    isGroup?: boolean;
    isProgramResponsible?: boolean;
    isProgramDirector?: boolean;
    isHeadOfService?: boolean;
    isModel?: boolean;
    isScheduleModel?: boolean;
    context: WebPartContext;
    teamId?: string;
    programId?: string;
    schedule?: any;
    handleClose: (isRefetch?: boolean) => void;
    setSchedule?: (item: any) => void;
}
declare const ScheduleDayForm: React.FC<IScheduleDayForm>;
export default ScheduleDayForm;
//# sourceMappingURL=index.d.ts.map