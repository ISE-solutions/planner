import * as React from 'react';
interface DeliveryFormProps {
    open: boolean;
    nextDelivery: number;
    delivery: any;
    setDelivery: React.Dispatch<any>;
    teamId: string;
    onClose: () => void;
    daysAvailable: any[];
    allDays: any[];
}
declare const DeliveryForm: React.FC<DeliveryFormProps>;
export default DeliveryForm;
//# sourceMappingURL=index.d.ts.map