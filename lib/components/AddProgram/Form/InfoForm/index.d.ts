import * as React from 'react';
interface IInfoForm {
    isDetail: boolean;
    isModel: boolean;
    isDraft: boolean;
    isProgramResponsible: boolean;
    tags: any[];
    program: any;
    errors: any;
    values: any;
    handleChange: any;
    setFieldValue: any;
    loadingApproval: any;
    handleAproval: (nameField: any, dateField: any) => void;
    handleEditApproval: (nameField: any, dateField: any) => void;
}
declare const InfoForm: React.FC<IInfoForm>;
export default InfoForm;
//# sourceMappingURL=index.d.ts.map