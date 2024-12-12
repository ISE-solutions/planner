import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import '../styles.css';
export interface IActivityGroupModelWebPartProps {
    description: string;
}
export default class ActivityGroupModelWebPart extends BaseClientSideWebPart<IActivityGroupModelWebPartProps> {
    onInit(): Promise<void>;
    render(): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=ActivityGroupModelWebPart.d.ts.map