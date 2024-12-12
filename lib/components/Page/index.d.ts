import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import '@react-awesome-query-builder/material/css/styles.css';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
interface ItemBreadcrumbs {
    name: string;
    page: string;
}
interface IPageProps {
    noPadding?: boolean;
    blockOverflow?: boolean;
    children: React.ReactNode;
    itemsBreadcrumbs?: ItemBreadcrumbs[];
    context: WebPartContext;
    maxHeight?: string | number;
}
declare const Page: React.FC<IPageProps>;
export default Page;
//# sourceMappingURL=index.d.ts.map