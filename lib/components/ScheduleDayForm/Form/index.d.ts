import 'react-quill/dist/quill.snow.css';
import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
interface IFormProps {
    isModel?: boolean;
    isScheduleModel?: boolean;
    isDraft: boolean;
    isGroup: boolean;
    isLoadModel?: boolean;
    titleRequired?: boolean;
    isProgramResponsible: boolean;
    isProgramDirector: boolean;
    isHeadOfService: boolean;
    context: WebPartContext;
    teamId?: string;
    programId?: string;
    schedule?: any;
    program?: any;
    team?: any;
    dictTag: any;
    dictPeople: any;
    dictSpace: any;
    peopleOptions: any[];
    spaceOptions: any[];
    tagsOptions: any[];
    setScheduleModel: React.Dispatch<any>;
    getActivity: (id: any) => Promise<any>;
    setSchedule: (item: any) => void;
    handleClose: (isRefetch?: boolean) => void;
}
declare const Form: React.FC<IFormProps>;
export default Form;
//# sourceMappingURL=index.d.ts.map