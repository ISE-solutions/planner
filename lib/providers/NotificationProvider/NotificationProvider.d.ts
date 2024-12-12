import * as React from 'react';
interface NotificationParameters {
    title: string;
    description: string;
}
export interface NotificationActionProps {
    error: (notification: NotificationParameters) => void;
    info: (notification: NotificationParameters) => void;
    success: (notification: NotificationParameters) => void;
}
export interface ContextProps {
    notification: NotificationActionProps;
}
export declare const NotificationContext: React.Context<ContextProps>;
export declare const NotificationProvider: ({ children }: {
    children: any;
}) => React.JSX.Element;
export {};
//# sourceMappingURL=NotificationProvider.d.ts.map