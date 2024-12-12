import * as React from 'react';
import type { Config, ImmutableTree } from '@react-awesome-query-builder/material';
interface IFIlterProps {
    open: boolean;
    onClose: () => void;
    applyFilter: () => void;
    configQB: Config;
    clearFilter: () => void;
    queryQB: {
        tree: ImmutableTree;
        config: Config;
    };
    setQuery: React.Dispatch<React.SetStateAction<{
        tree: ImmutableTree;
        config: Config;
    }>>;
}
declare const FilterDrawer: React.FC<IFIlterProps>;
export default FilterDrawer;
//# sourceMappingURL=index.d.ts.map