import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import ReportAcademicSessionByMonth from './components/ReportAcademicSessionByMonth';
import { setup as pnpSetup } from '@pnp/common';
import { sp } from '@pnp/sp/presets/all';
import '../styles.css';

export interface IReportWebPartProps {
  description: string;
}

export default class ReportWebPart extends BaseClientSideWebPart<IReportWebPartProps> {
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
    const element: React.ReactElement = React.createElement(ReportAcademicSessionByMonth, {
      context: this.context,
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}
