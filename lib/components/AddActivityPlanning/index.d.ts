import * as React from 'react';
import { TYPE_ACTIVITY } from '~/config/enums';
interface IAddActivityPlanningProps {
    open: boolean;
    activity?: any;
    refetch?: any;
    activityType: TYPE_ACTIVITY.ACADEMICA | TYPE_ACTIVITY.NON_ACADEMICA | TYPE_ACTIVITY.INTERNAL;
    handleClose: () => void;
    handleEdit: (item: any) => void;
}
declare const AddActivityPlanning: React.FC<IAddActivityPlanningProps>;
export default AddActivityPlanning;
//# sourceMappingURL=index.d.ts.map