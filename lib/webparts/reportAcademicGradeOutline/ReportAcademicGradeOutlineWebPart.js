import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import ReportAcademicGradeOutline from './components/ReportAcademicGradeOutline';
import { setup as pnpSetup } from '@pnp/common';
import { sp } from '@pnp/sp/presets/all';
import '../styles.css';
export default class ReportWebPart extends BaseClientSideWebPart {
    onInit() {
        return super.onInit().then((_) => {
            pnpSetup({
                spfxContext: this.context,
            });
            sp.setup({
                sp: {
                    baseUrl: this.context.pageContext.site.absoluteUrl,
                },
            });
            this.render();
        });
    }
    render() {
        const element = React.createElement(ReportAcademicGradeOutline, {
            context: this.context,
        });
        ReactDom.render(element, this.domElement);
    }
    onDispose() {
        ReactDom.unmountComponentAtNode(this.domElement);
    }
}
//# sourceMappingURL=ReportAcademicGradeOutlineWebPart.js.map