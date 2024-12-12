import 'react-quill/dist/quill.snow.css';
import * as React from 'react';
interface IForm {
    isModel?: boolean;
    isDraft?: boolean;
    isLoadModel?: boolean;
    isProgramResponsible: boolean;
    program: any;
    dictTag: any;
    tagsOptions: any[];
    peopleOptions: any[];
    dictPeople: any;
    refetchProgram: any;
    handleClose: () => void;
    setProgram: (program: any) => void;
}
declare const Form: React.FC<IForm>;
export default Form;
//# sourceMappingURL=index.d.ts.map