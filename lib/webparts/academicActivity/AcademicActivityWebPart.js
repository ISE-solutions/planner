import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { PropertyPaneTextField, } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import AcademicActivity from './components/AcademicActivity';
import { setup as pnpSetup } from '@pnp/common';
import '../styles.css';
import '@pnp/common';
import '@pnp/logging';
export default class AcademicActivityWebPart extends BaseClientSideWebPart {
    onInit() {
        return super.onInit().then((_) => {
            pnpSetup({
                spfxContext: this.context,
            });
            this.render();
        });
    }
    render() {
        const element = React.createElement(AcademicActivity, {
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
    getPropertyPaneConfiguration() {
        return {
            pages: [
                {
                    header: {
                        description: 'Descrição',
                    },
                    groups: [
                        {
                            groupName: 'RHC Group',
                            groupFields: [
                                PropertyPaneTextField('description', {
                                    label: 'Descrição',
                                }),
                            ],
                        },
                    ],
                },
            ],
        };
    }
}
//# sourceMappingURL=AcademicActivityWebPart.js.map