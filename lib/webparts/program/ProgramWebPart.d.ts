import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import '../styles.css';
export interface IProgramWebPartProps {
    description: string;
}
export default class ProgramWebPart extends BaseClientSideWebPart<IProgramWebPartProps> {
    onInit(): Promise<void>;
    render(): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
}
//# sourceMappingURL=ProgramWebPart.d.ts.map