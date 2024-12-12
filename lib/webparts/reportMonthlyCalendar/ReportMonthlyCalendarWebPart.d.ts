import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import '../styles.css';
export interface IReportWebPartProps {
    description: string;
}
export default class ReportWebPart extends BaseClientSideWebPart<IReportWebPartProps> {
    onInit(): Promise<void>;
    render(): void;
    protected onDispose(): void;
}
//# sourceMappingURL=ReportMonthlyCalendarWebPart.d.ts.map