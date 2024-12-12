import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import '../styles.css';
export interface IActivityModelWebPartProps {
    description: string;
}
export default class ActivityModelWebPart extends BaseClientSideWebPart<IActivityModelWebPartProps> {
    onInit(): Promise<void>;
    render(): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
}
//# sourceMappingURL=ActivityModelWebPart.d.ts.map