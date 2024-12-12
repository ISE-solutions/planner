import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import TeamPage from './components/ConflictManagement';
import { setup as pnpSetup } from '@pnp/common';
import { sp } from '@pnp/sp/presets/all';
import '../styles.css';
export default class ConflictManagementWebPart extends BaseClientSideWebPart {
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
        const element = React.createElement(TeamPage, {
            context: this.context,
        });
        ReactDom.render(element, this.domElement);
    }
    onDispose() {
        ReactDom.unmountComponentAtNode(this.domElement);
    }
    get dataVersion() {
        return Version.parse('1.0');
    }
}
//# sourceMappingURL=ConflictManagementWebPart.js.map