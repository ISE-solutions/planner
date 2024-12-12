import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
interface ILoadModel {
    context: WebPartContext;
    isModel?: boolean;
    values: any;
    errors: any;
    setFieldValue: any;
    handleNext: () => void;
}
declare const LoadModel: React.FC<ILoadModel>;
export default LoadModel;
//# sourceMappingURL=index.d.ts.map