import * as React from 'react';
import { NotificationActionProps } from '~/providers/NotificationProvider/NotificationProvider';
interface IModalBulkEditProps {
    open: boolean;
    persons: any[];
    tags: any[];
    notification: NotificationActionProps;
    handleClose: () => void;
}
declare const ModalBulkEdit: React.FC<IModalBulkEditProps>;
export default ModalBulkEdit;
//# sourceMappingURL=index.d.ts.map