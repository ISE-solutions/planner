import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
interface IAppProps {
    context: WebPartContext;
    children: React.ReactNode;
}
declare const App: React.FC<IAppProps>;
export default App;
//# sourceMappingURL=index.d.ts.map