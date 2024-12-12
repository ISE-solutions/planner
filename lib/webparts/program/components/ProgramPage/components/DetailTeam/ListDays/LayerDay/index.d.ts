import * as React from 'react';
interface LayerDayProps {
    schedule: any;
    teamChoosed: any;
    programChoosed: any;
    teamId: string;
    programId: string;
    refetchActivity: any;
    handleDetailActivity: (act?: any) => void;
    handleSchedule: (event: any, item: any) => void;
    handleOptionActivity: (event: any, item: any) => void;
}
declare const LayerDay: React.FC<LayerDayProps>;
export default LayerDay;
//# sourceMappingURL=index.d.ts.map