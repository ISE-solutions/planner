import 'jspdf-autotable';
export default class PDFService {
    private leftImg;
    private rightImg;
    private centerImg;
    private items;
    private teamName;
    private programName;
    private language;
    constructor(leftImg: any, rightImg: any, centerImg: any, items: any, teamName: any, programName: any, language: any);
    minifyHTML(template: string): string;
    generatePDF(): Promise<void>;
}
//# sourceMappingURL=PDFService.d.ts.map