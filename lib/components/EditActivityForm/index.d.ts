import * as React from 'react';
interface IEditActivityForm {
    open: boolean;
    isModel?: boolean;
    team?: any;
    program?: any;
    isProgramResponsible?: boolean;
    isProgramDirector?: boolean;
    isDraft?: boolean;
    activity: any;
    refetch?: any;
    undoNextActivities?: any[];
    academicDirector?: any;
    onClose: () => void;
    onSave: (item: any, onSuccess?: () => void) => void;
    setActivity: (item: any) => void;
    throwToApprove?: (item: any) => void;
}
declare const EditActivityForm: React.FC<IEditActivityForm>;
export default EditActivityForm;
//# sourceMappingURL=index.d.ts.map