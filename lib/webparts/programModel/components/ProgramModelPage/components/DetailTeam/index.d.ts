import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
interface IDetailTeam {
    teamChoosed: any;
    programChoosed: any;
    listMode: boolean;
    canEdit: boolean;
    refetchSchedule: any;
    refetchTeam: any;
    scheduleChoosed: any;
    schedules: any[];
    context: WebPartContext;
    width?: number;
    handleModeView: () => void;
}
declare const DetailTeam: React.FC<IDetailTeam>;
export default DetailTeam;
//# sourceMappingURL=index.d.ts.map