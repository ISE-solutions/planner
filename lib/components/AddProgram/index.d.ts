import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
interface IAddProgram {
    open: boolean;
    group?: string;
    context: WebPartContext;
    isModel?: boolean;
    isDraft?: boolean;
    isProgramResponsible?: boolean;
    program: any;
    refetchProgram: any;
    handleClose: () => void;
    setProgram: (program: any) => void;
}
declare const AddProgram: React.FC<IAddProgram>;
export default AddProgram;
//# sourceMappingURL=index.d.ts.map