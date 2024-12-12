import * as React from 'react';
import { TYPE_RESOURCE } from '~/config/enums';
interface IAddFiniteInfiniteResourceProps {
    open: boolean;
    resource?: any;
    handleClose: () => void;
    refetch?: () => void;
    typeResource: TYPE_RESOURCE;
}
declare const AddFiniteInfiniteResource: React.FC<IAddFiniteInfiniteResourceProps>;
export default AddFiniteInfiniteResource;
//# sourceMappingURL=index.d.ts.map