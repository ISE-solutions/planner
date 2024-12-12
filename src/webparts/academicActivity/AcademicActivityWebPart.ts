import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import AcademicActivity from './components/AcademicActivity';
import { setup as pnpSetup } from '@pnp/common';
import '../styles.css';
import '@pnp/common';
import '@pnp/logging';

export interface IAcademicActivityWebPartProps {
  description: string;
}

export default class AcademicActivityWebPart extends BaseClientSideWebPart<IAcademicActivityWebPartProps> {
  public onInit(): Promise<void> {
    return super.onInit().then((_) => {
      pnpSetup({
        spfxContext: this.context,
      });

      this.render();
    });
  }

  public render(): void {
    const element: React.ReactElement = React.createElement(AcademicActivity, {
      context: this.context,
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
