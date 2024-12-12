import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Page from '~/components/Page';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import styles from './report.module.scss';

interface IReportPage {
  context: WebPartContext;
}

const ReportPage: React.FC<IReportPage> = ({ context }) => {
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
      itemsBreadcrumbs={[{ name: 'Relatórios', page: '' }]}
    >
      {token ? (
        <PowerBIEmbed
          embedConfig={{
            type: 'report', // Supported types: report, dashboard, tile, visual and qna
            id: '78447611-9fc7-4eb7-a340-e8758fcebe23',
            embedUrl:
              'https://app.powerbi.com/reportEmbed?reportId=d5d09408-d7ab-4115-9e42-732f87381aeb&groupId=6a0b2bf7-b466-4320-800c-cfbb6b511cff',
            accessToken: token,
            tokenType: models.TokenType.Aad,
            settings: {
              panes: {
                filters: {
                  expanded: false,
                  visible: false,
                },
              },
              background: models.BackgroundType.Transparent,
            },
          }}
          eventHandlers={
            new Map([
              [
                'loaded',
                () => {
                  console.log('Report loaded');
                },
              ],
              [
                'rendered',
                () => {
                  console.log('Report rendered');
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
          getEmbeddedComponent={(embeddedReport) => {
            // @ts-ignore
            window.report = embeddedReport as any;
          }}
        />
      ) : null}
    </Page>
  );
};

export default ReportPage;
