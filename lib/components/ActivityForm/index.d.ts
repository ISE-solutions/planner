import * as React from 'react';
interface IActivityForm {
    activity: any;
    undoNextActivities?: any[];
    team?: any;
    program?: any;
    headerInfo?: React.ReactNode;
    maxHeight?: string;
    isDraft?: boolean;
    noPadding?: boolean;
    forceUpdate?: boolean;
    isModel?: boolean;
    isModelReference?: boolean;
    isDrawer?: boolean;
    isProgramResponsible?: boolean;
    academicDirector?: any;
    refetch?: any;
    handleClose?: () => void;
    onSave: (activity: any, onSuccess?: () => void) => void;
    throwToApprove?: (activity: any) => void;
    setActivity?: (activity: any) => void;
}
declare const ActivityForm: React.FC<IActivityForm>;
export default ActivityForm;
//# sourceMappingURL=index.d.ts.map