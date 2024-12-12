import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import '../styles.css';
import '@pnp/common';
import '@pnp/logging';
export interface IAcademicActivityWebPartProps {
    description: string;
}
export default class AcademicActivityWebPart extends BaseClientSideWebPart<IAcademicActivityWebPartProps> {
    onInit(): Promise<void>;
    render(): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=AcademicActivityWebPart.d.ts.map