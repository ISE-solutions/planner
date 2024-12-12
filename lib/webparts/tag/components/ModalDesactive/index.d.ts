import * as React from 'react';
import { NotificationActionProps } from '~/providers/NotificationProvider/NotificationProvider';
interface IModalDesactiveProps {
    open: boolean;
    tag: any;
    notification: NotificationActionProps;
    handleClose: () => void;
}
declare const ModalDesactive: React.FC<IModalDesactiveProps>;
export default ModalDesactive;
//# sourceMappingURL=index.d.ts.map