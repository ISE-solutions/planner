import * as React from 'react';
import { NotificationActionProps } from '~/providers/NotificationProvider/NotificationProvider';
interface IModalBulkEditProps {
    open: boolean;
    tags: any[];
    notification: NotificationActionProps;
    handleClose: () => void;
}
declare const ModalBulkEdit: React.FC<IModalBulkEditProps>;
export default ModalBulkEdit;
//# sourceMappingURL=index.d.ts.map