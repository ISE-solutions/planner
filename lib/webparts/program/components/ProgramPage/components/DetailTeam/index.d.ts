import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IExceptionOption } from '~/hooks/types';
interface IDetailTeam {
    teamChoosed: any;
    programChoosed: any;
    teamTemperature: any;
    programTemperature: any;
    activityChoosed: {
        open: boolean;
        item: any;
    };
    listMode: boolean;
    isProgramResponsible: boolean;
    isProgramDirector: boolean;
    isHeadOfService: boolean;
    currentUser: any;
    refetchSchedule: any;
    refetchResource: any;
    refetchTeam: any;
    refetchProgram: any;
    schedules: any[];
    context: WebPartContext;
    width?: number;
    resources: any[];
    handleModeView: () => void;
    setActivityChoosed: React.Dispatch<React.SetStateAction<{
        open: boolean;
        item: any;
    }>>;
    updateSchedule: (id: any, toSave: any, options?: IExceptionOption) => Promise<any>;
}
declare const DetailTeam: React.FC<IDetailTeam>;
export default DetailTeam;
//# sourceMappingURL=index.d.ts.map