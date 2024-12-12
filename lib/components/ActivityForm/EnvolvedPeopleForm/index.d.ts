import * as React from 'react';
interface IEnvolvedPeopleForm {
    canEdit: boolean;
    isDetail: boolean;
    isModel: boolean;
    errors: any;
    values: any;
    activity: any;
    setValues: any;
    setFieldValue: any;
    currentUser: any;
    detailApproved: boolean;
    setActivity: (item: any) => void;
}
declare const EnvolvedPeopleForm: React.FC<IEnvolvedPeopleForm>;
export default EnvolvedPeopleForm;
//# sourceMappingURL=index.d.ts.map