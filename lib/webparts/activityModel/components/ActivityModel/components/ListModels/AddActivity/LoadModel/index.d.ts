import * as React from 'react';
import { EActivityTypeApplication } from '~/config/enums';
interface ILoadModel {
    values: any;
    errors: any;
    typeLoad: EActivityTypeApplication;
    setFieldValue: any;
    handleNext: () => void;
}
declare const LoadModel: React.FC<ILoadModel>;
export default LoadModel;
//# sourceMappingURL=index.d.ts.map