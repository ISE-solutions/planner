import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import TimeReport from './components/TimeReport';
import { setup as pnpSetup } from '@pnp/common';
import { sp } from '@pnp/sp/presets/all';
import '../styles.css';

export interface ITimeReportWebPartProps {
  description: string;
}

export default class TimeReportWebPart extends BaseClientSideWebPart<ITimeReportWebPartProps> {
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
    const element: React.ReactElement = React.createElement(TimeReport, {
      context: this.context,
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}
