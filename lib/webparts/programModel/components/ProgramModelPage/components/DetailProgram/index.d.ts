import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
interface IDetailProgram {
    programChoosed: any;
    canEdit: boolean;
    teamChoosed: any;
    loading: boolean;
    refetch: any;
    teams: any[];
    setSearch: any;
    context: WebPartContext;
    setTeamChoosed: React.Dispatch<any>;
}
declare const DetailProgram: React.FC<IDetailProgram>;
export default DetailProgram;
//# sourceMappingURL=index.d.ts.map