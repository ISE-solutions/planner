import * as React from 'react';
interface ConfirmationParameters {
    title: React.ReactNode;
    description: React.ReactNode;
    yesLabel?: string;
    noLabel?: string;
    showCancel?: boolean;
    onConfirm: () => void;
    onCancel?: () => void;
}
export interface ConfirmationActionProps {
    openConfirmation: (confirmation: ConfirmationParameters) => void;
    closeConfirmation: () => void;
}
export interface ContextProps {
    confirmation: ConfirmationActionProps;
}
export declare const ConfirmationContext: React.Context<ContextProps>;
export declare const ConfirmationProvider: ({ children }: {
    children: any;
}) => React.JSX.Element;
export {};
//# sourceMappingURL=ConfirmationProvider.d.ts.map