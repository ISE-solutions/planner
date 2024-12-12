import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import '../styles.css';
export interface ITimeReportWebPartProps {
    description: string;
}
export default class TimeReportWebPart extends BaseClientSideWebPart<ITimeReportWebPartProps> {
    onInit(): Promise<void>;
    render(): void;
    protected onDispose(): void;
}
//# sourceMappingURL=TimeReportWebPart.d.ts.map