import * as React from 'react';
interface CalendarDrawerProps {
    open: boolean;
    schedule: any;
    onClose: () => void;
    onEventHoverIn: (args: any) => void;
    onEventHoverOut: () => void;
    onItemChange: (args: any, inst: any) => void;
    onEventClick: (args: any) => void;
}
declare const CalendarDrawer: React.FC<CalendarDrawerProps>;
export default CalendarDrawer;
//# sourceMappingURL=index.d.ts.map