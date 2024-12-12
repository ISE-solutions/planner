import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import '../styles.css';
export interface IProgramModelWebPartProps {
    description: string;
}
export default class ProgramModelWebPart extends BaseClientSideWebPart<IProgramModelWebPartProps> {
    onInit(): Promise<void>;
    render(): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
}
//# sourceMappingURL=ProgramModelWebPart.d.ts.map