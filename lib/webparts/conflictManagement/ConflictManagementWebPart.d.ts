import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import '../styles.css';
export interface IConflictManagementWebPartProps {
    description: string;
}
export default class ConflictManagementWebPart extends BaseClientSideWebPart<IConflictManagementWebPartProps> {
    onInit(): Promise<void>;
    render(): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
}
//# sourceMappingURL=ConflictManagementWebPart.d.ts.map