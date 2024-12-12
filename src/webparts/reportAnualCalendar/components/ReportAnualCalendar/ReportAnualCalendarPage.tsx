import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Page from '~/components/Page';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import styles from './report.module.scss';
import { REPORTS } from '~/config/constants';

interface IReportAnualCalendarPage {
  context: WebPartContext;
}

const ReportAnualCalendarPage: React.FC<IReportAnualCalendarPage> = ({
  context,
}) => {
  const [token, setToken] = React.useState('');

  React.useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const tokenProvider =
      await context.aadTokenProviderFactory.getTokenProvider();
    const token = await tokenProvider.getToken(
      `https://analysis.windows.net/powerbi/api`
    );

    setToken(token);
  };

  return (
    <Page
      blockOverflow={false}
      context={context}
      itemsBreadcrumbs={[
        { name: 'Relatórios', page: '' },
        {
          name: 'Calendário Anual',
          page: 'Calendário Anual',
        },
      ]}
    >
      {token ? (
        <PowerBIEmbed
          embedConfig={{
            type: 'report', // Supported types: report, dashboard, tile, visual and qna
            id: REPORTS.anualCalendar,
            embedUrl: 'https://app.powerbi.com/reportEmbed',
            accessToken: token,
            tokenType: models.TokenType.Aad,
            settings: {
              panes: {
                filters: {
                  expanded: false,
                  visible: false,
                },
              },
              navContentPaneEnabled: false,
              background: models.BackgroundType.Transparent,
            },
          }}
          eventHandlers={
            new Map([
              [
                'loaded',
                () => {
                  console.log('ReportAnualCalendar loaded');
                },
              ],
              [
                'rendered',
                () => {
                  console.log('ReportAnualCalendar rendered');
                },
              ],
              [
                'error',
                (event) => {
                  console.log(event.detail);
                },
              ],
            ])
          }
          cssClassName={styles.wrapperReport}
          getEmbeddedComponent={(embeddedReportAnualCalendar) => {
            // @ts-ignore
            window.report = embeddedReportAnualCalendar as any;
          }}
        />
      ) : null}
    </Page>
  );
};

export default ReportAnualCalendarPage;
