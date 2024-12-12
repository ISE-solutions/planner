import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
interface IListModels {
    scheduleChoosed: any;
    currentUser: any;
    schedule: any[];
    loading: boolean;
    canEdit: boolean;
    filter: any;
    setFilter: React.Dispatch<any>;
    context: WebPartContext;
    refetch: any;
    handleSchedule: (schedule: any) => any;
}
declare const ListModels: React.FC<IListModels>;
export default ListModels;
//# sourceMappingURL=index.d.ts.map