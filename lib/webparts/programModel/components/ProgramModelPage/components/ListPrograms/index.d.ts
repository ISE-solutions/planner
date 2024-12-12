import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
interface IListPrograms {
    programChoosed: any;
    currentUser: any;
    context: WebPartContext;
    handleProgram: (program: any) => any;
    setProgramChoosed: (program: any) => any;
}
declare const ListPrograms: React.FC<IListPrograms>;
export default ListPrograms;
//# sourceMappingURL=index.d.ts.map