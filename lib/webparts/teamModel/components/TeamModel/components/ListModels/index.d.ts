import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
interface IListModels {
    teamChoosed: any;
    refetch: any;
    currentUser: any;
    loading: boolean;
    loadingSave: boolean;
    teams: any[];
    refetchSchedule: any;
    filter: any;
    setFilter: React.Dispatch<any>;
    context: WebPartContext;
    handleSchedule: (schedule: any) => any;
    setTeamChoosed: (schedule: any) => any;
}
declare const ListModels: React.FC<IListModels>;
export default ListModels;
//# sourceMappingURL=index.d.ts.map