import * as React from 'react';
import { GROUP_FILTER } from '../constants';
import type { Config, ImmutableTree } from '@react-awesome-query-builder/material';
interface FilterProps {
    formik: any;
    onClose: () => void;
    open: boolean;
    loading: boolean;
    group: GROUP_FILTER;
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
    setGroup: React.Dispatch<React.SetStateAction<GROUP_FILTER>>;
}
export declare enum InputTypes {
    AUTOCOMPLETE = 0,
    TEXT = 1,
    DATE = 2,
    DATETIME = 3,
    NUMBER = 4
}
declare const Filter: React.FC<FilterProps>;
export default Filter;
//# sourceMappingURL=index.d.ts.map