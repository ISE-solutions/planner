import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import '../styles.css';
export interface IAdvancedSearchWebPartProps {
    description: string;
}
export default class AdvancedSearchWebPart extends BaseClientSideWebPart<IAdvancedSearchWebPartProps> {
    onInit(): Promise<void>;
    render(): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
}
//# sourceMappingURL=AdvancedSearchWebPart.d.ts.map