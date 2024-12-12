import * as React from 'react';
interface FilterProps {
    open: boolean;
    formik: any;
    onClose: () => void;
    refetch: () => void;
    filterSelected: any;
    setFilterSelected: React.Dispatch<any>;
    onAddCustomFilter: () => void;
    onOvewriteFilter: () => void;
}
declare const Filter: React.FC<FilterProps>;
export default Filter;
//# sourceMappingURL=index.d.ts.map