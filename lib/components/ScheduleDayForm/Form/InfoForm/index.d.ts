import * as React from 'react';
interface IInfoForm {
    values: any;
    isDetail?: boolean;
    titleRequired?: boolean;
    errors: any;
    teamId: string;
    isDraft: boolean;
    isGroup: boolean;
    isModel?: boolean;
    isScheduleModel?: boolean;
    isProgramResponsible?: boolean;
    isProgramDirector: boolean;
    isHeadOfService: boolean;
    tagsOptions: any[];
    setFieldValue: any;
    schedule: any;
    setDateReference: React.Dispatch<any>;
    handleChange: {
        (e: React.ChangeEvent<any>): void;
        <T_1 = string | React.ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
    };
    loadingApproval: any;
    handleAproval: (nameField: any, dateField: any) => void;
    handleEditApproval: (nameField: any, dateField: any) => void;
}
declare const InfoForm: React.FC<IInfoForm>;
export default InfoForm;
//# sourceMappingURL=index.d.ts.map