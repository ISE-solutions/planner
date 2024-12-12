import * as React from 'react';
interface ILoadActivity {
    open: boolean;
    currentActivity: any;
    onLoadActivity: (activity: any) => void;
    onClose: () => void;
}
declare const LoadActivity: React.FC<ILoadActivity>;
export default LoadActivity;
//# sourceMappingURL=index.d.ts.map