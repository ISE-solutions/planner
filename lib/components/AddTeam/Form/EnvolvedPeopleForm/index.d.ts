import * as React from 'react';
interface IEnvolvedPeopleForm {
    isDetail?: boolean;
    isDraft?: boolean;
    errors: any;
    values: any;
    tags: any[];
    persons: any[];
    setValues: any;
    setFieldValue: any;
    currentUser: any;
    teamId: string;
    setTeam: (item: any) => void;
}
declare const EnvolvedPeopleForm: React.FC<IEnvolvedPeopleForm>;
export default EnvolvedPeopleForm;
//# sourceMappingURL=index.d.ts.map