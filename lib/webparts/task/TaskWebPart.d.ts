import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import '../styles.css';
export interface ITaskWebPartProps {
    description: string;
}
export default class TaskWebPart extends BaseClientSideWebPart<ITaskWebPartProps> {
    onInit(): Promise<void>;
    render(): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
}
//# sourceMappingURL=TaskWebPart.d.ts.map