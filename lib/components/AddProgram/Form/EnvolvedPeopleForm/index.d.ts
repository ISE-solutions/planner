import * as React from 'react';
interface IEnvolvedPeopleForm {
    isModel: boolean;
    isDetail: boolean;
    isDraft: boolean;
    errors: any;
    values: any;
    dictTag: any;
    tags: any[];
    persons: any[];
    setValues: any;
    setFieldValue: any;
    currentUser: any;
    programId: string;
    setProgram: (item: any) => void;
}
declare const EnvolvedPeopleForm: React.FC<IEnvolvedPeopleForm>;
export default EnvolvedPeopleForm;
//# sourceMappingURL=index.d.ts.map