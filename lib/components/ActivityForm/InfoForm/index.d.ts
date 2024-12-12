import * as React from 'react';
interface IInfoForm {
    canEdit: boolean;
    isModel: boolean;
    isDetail?: boolean;
    isModelReference: boolean;
    isDraft: boolean;
    isProgramResponsible: boolean;
    isProgramDirector: boolean;
    isAcademicDirector: boolean;
    tagsOptions: any[];
    spaceOptions: any[];
    errors: any;
    values: any;
    currentUser: any;
    activityType: string;
    handleChange: any;
    setFieldValue: any;
    activity: any;
    detailApproved: boolean;
    setActivity?: (item: any) => void;
    loadingApproval: any;
    handleAproval: (nameField: any, dateField: any) => void;
    handleEditApproval: (nameField: any, dateField: any) => void;
}
declare const InfoForm: React.FC<IInfoForm>;
export default InfoForm;
//# sourceMappingURL=index.d.ts.map