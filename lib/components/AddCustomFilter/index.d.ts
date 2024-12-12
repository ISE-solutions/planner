import * as React from 'react';
import { ETYPE_CUSTOM_FILTER } from '~/config/enums';
interface IAddCustomFilter {
    open: boolean;
    onClose: () => void;
    refetch: () => void;
    filter: any;
    filterSaved?: any;
    type: ETYPE_CUSTOM_FILTER;
}
declare const AddCustomFilter: React.FC<IAddCustomFilter>;
export default AddCustomFilter;
//# sourceMappingURL=index.d.ts.map