import * as React from 'react';
export interface UserProps {
    currentUser: any;
    persons: any[];
    tags: any[];
}
export declare const UserContext: React.Context<UserProps>;
export declare const UserProvider: ({ children, context }: {
    children: any;
    context: any;
}) => React.JSX.Element;
//# sourceMappingURL=UserProvider.d.ts.map