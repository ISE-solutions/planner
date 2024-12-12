import * as React from 'react';
import { TYPE_ACTIVITY } from '~/config/enums';
interface IInfoProps {
    formik: any;
    activityType: TYPE_ACTIVITY.ACADEMICA | TYPE_ACTIVITY.NON_ACADEMICA | TYPE_ACTIVITY.INTERNAL;
}
declare const Info: React.FC<IInfoProps>;
export default Info;
//# sourceMappingURL=index.d.ts.map