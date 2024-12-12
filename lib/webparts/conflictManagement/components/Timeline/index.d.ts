import * as React from 'react';
import * as moment from 'moment';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
interface IFilterProps {
    startDate: moment.Moment;
    endDate: moment.Moment;
    [propertyName: string]: any;
}
interface ITimelineProps {
    resources: any[];
    groups: any[];
    refetch: any;
    loading: boolean;
    typeResource: string;
    filter: IFilterProps;
    handleActivity: (activityId: any) => void;
    setFieldValue: any;
    handleFilter: any;
}
declare const Timeline: React.FC<ITimelineProps>;
export default Timeline;
//# sourceMappingURL=index.d.ts.map