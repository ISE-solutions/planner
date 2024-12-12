import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
interface IDetailProgram {
    programChoosed: any;
    teamChoosed: any;
    programTemperature: string;
    isProgramResponsible: boolean;
    isProgramDirector: boolean;
    isFinance: boolean;
    refetchSchedule: any;
    refetchResource: any;
    refetch: any;
    context: WebPartContext;
    setTeamChoosed: React.Dispatch<any>;
}
declare const DetailProgram: React.FC<IDetailProgram>;
export default DetailProgram;
//# sourceMappingURL=index.d.ts.map