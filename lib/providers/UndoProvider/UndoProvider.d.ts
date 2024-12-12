import * as React from 'react';
export interface UndoActionProps {
    open: (description: string, onUndo: () => void) => void;
    close: () => void;
}
export interface ContextProps {
    undo: UndoActionProps;
}
export declare const UndoContext: React.Context<ContextProps>;
export declare const UndoProvider: ({ children }: {
    children: any;
}) => React.JSX.Element;
//# sourceMappingURL=UndoProvider.d.ts.map