import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import TeamModel from './components/TeamModel';
import { setup as pnpSetup } from '@pnp/common';
import { sp } from '@pnp/sp/presets/all';
import '../styles.css';

export interface ITeamModelWebPartProps {
  description: string;
}

export default class TeamModelWebPart extends BaseClientSideWebPart<ITeamModelWebPartProps> {
  public onInit(): Promise<void> {
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

  public render(): void {
    const element: React.ReactElement = React.createElement(TeamModel, {
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