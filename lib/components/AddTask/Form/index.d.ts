import 'react-quill/dist/quill.snow.css';
import * as React from 'react';
interface IForm {
    task: any;
    refetch: () => void;
    handleClose: () => void;
    setTeam?: (item: any) => void;
}
declare const Form: React.FC<IForm>;
export default Form;
//# sourceMappingURL=index.d.ts.map