import * as React from 'react';
import { IExceptionOption } from '~/hooks/types';
interface IEnvolvedPeopleForm {
    errors: any;
    isDetail: boolean;
    isDraft: boolean;
    values: any;
    tags: any[];
    persons: any[];
    setValues: any;
    currentUser?: any;
    setFieldValue: any;
    dictTag: any;
    scheduleId: string;
    setSchedule: (item: any) => void;
    updateEnvolvedPerson: (id: any, scheduleId: any, toSave: any, options?: IExceptionOption) => Promise<any>;
}
declare const EnvolvedPeopleForm: React.FC<IEnvolvedPeopleForm>;
export default EnvolvedPeopleForm;
//# sourceMappingURL=index.d.ts.map