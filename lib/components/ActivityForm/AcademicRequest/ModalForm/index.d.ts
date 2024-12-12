import * as React from 'react';
interface IModalForm {
    detailApproved: boolean;
    canEdit: boolean;
    open: boolean;
    setFieldValue: any;
    academicRequest: any;
    onClose: () => void;
    onSave: (item: any) => void;
}
declare const ModalForm: React.FC<IModalForm>;
export default ModalForm;
//# sourceMappingURL=index.d.ts.map