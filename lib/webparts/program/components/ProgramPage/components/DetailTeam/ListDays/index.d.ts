import * as React from 'react';
interface IListDays {
    schedules: any[];
    refetchActivity: any;
    dictTag: any;
    teamChoosed: any;
    programChoosed: any;
    activities: any[];
    handleToSaveActivityModel: (activity: any) => void;
    handleActivityDetail: (activity: any) => void;
    handleOptionSchedule: (event: any, item: any) => void;
    handleDelete: (activityId: string) => void;
}
declare const ListDays: React.FC<IListDays>;
export default ListDays;
//# sourceMappingURL=index.d.ts.map