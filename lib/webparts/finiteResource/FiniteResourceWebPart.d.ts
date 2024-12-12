import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import '../styles.css';
export interface IFiniteResourceWebPartProps {
    description: string;
}
export default class FiniteResourceWebPart extends BaseClientSideWebPart<IFiniteResourceWebPartProps> {
    onInit(): Promise<void>;
    render(): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=FiniteResourceWebPart.d.ts.map