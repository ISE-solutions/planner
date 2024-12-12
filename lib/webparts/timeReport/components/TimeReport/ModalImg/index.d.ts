import * as React from 'react';
interface IModalImgProps {
    open: boolean;
    onClose: () => void;
    generatePDF: (data: any) => void;
    language: {
        value: string;
        label: string;
    };
    setLanguage: React.Dispatch<React.SetStateAction<{
        value: string;
        label: string;
    }>>;
}
declare const ModalImg: React.FC<IModalImgProps>;
export default ModalImg;
//# sourceMappingURL=index.d.ts.map