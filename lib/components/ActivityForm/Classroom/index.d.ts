import * as React from 'react';
interface IClassroomProps {
    canEdit: boolean;
    isDetail: boolean;
    errors: any;
    values: any;
    isModel: boolean;
    isDraft: boolean;
    detailApproved: boolean;
    isProgramDirector: boolean;
    isProgramResponsible: boolean;
    handleChange: any;
    setFieldValue: any;
    activity: any;
    currentUser: any;
    loadingApproval: any;
    handleAproval: (nameField: any, dateField: any) => void;
    handleEditApproval: (nameField: any, dateField: any) => void;
}
declare const Classroom: React.FC<IClassroomProps>;
export default Classroom;
//# sourceMappingURL=index.d.ts.map