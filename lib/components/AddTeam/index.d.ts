import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
interface IAddTeam {
    isModel?: boolean;
    isDraft?: boolean;
    isProgramResponsible?: boolean;
    isProgramDirector?: boolean;
    isFinance?: boolean;
    context: WebPartContext;
    open: boolean;
    team: any;
    program?: any;
    refetch?: any;
    teams?: any[];
    company?: string;
    programId?: string;
    teamLength: number;
    setTeam?: (item: any) => void;
    handleClose: () => void;
}
declare const AddTeam: React.FC<IAddTeam>;
export default AddTeam;
//# sourceMappingURL=index.d.ts.map