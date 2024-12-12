import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
export interface ContextProps {
    context: WebPartContext;
}
export declare const ContextContext: React.Context<ContextProps>;
export declare const ContextProvider: ({ children, context }: {
    children: any;
    context: any;
}) => React.JSX.Element;
//# sourceMappingURL=ContextProvider.d.ts.map