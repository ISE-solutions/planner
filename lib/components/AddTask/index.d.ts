import * as React from 'react';
interface IAddTeam {
    open: boolean;
    task: any;
    refetch: () => void;
    setTeam?: (item: any) => void;
    handleClose: () => void;
}
declare const AddTeam: React.FC<IAddTeam>;
export default AddTeam;
//# sourceMappingURL=index.d.ts.map