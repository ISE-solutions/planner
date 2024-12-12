import 'react-quill/dist/quill.snow.css';
import * as React from 'react';
interface IForm {
    isModel?: boolean;
    isDraft?: boolean;
    isLoadModel?: boolean;
    isProgramResponsible: boolean;
    isProgramDirector: boolean;
    isFinance: boolean;
    team: any;
    refetch?: any;
    programId: string;
    company: string;
    program: any;
    dictTag: any;
    teams: any[];
    tagsOptions: any[];
    peopleOptions: any[];
    dictPeople: any;
    handleClose: () => void;
    setTeam: (item: any) => void;
    getActivityByTeamId: (teamId: string) => Promise<any>;
}
declare const Form: React.FC<IForm>;
export default Form;
//# sourceMappingURL=index.d.ts.map