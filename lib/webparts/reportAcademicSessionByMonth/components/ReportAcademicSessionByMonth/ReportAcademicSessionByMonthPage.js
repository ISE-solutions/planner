var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import Page from '~/components/Page';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import styles from './report.module.scss';
import { REPORTS } from '~/config/constants';
const ReportAcademicSessionByMonthPage = ({ context }) => {
    const [token, setToken] = React.useState('');
    React.useEffect(() => {
        getToken();
    }, []);
    const getToken = () => __awaiter(void 0, void 0, void 0, function* () {
        const tokenProvider = yield context.aadTokenProviderFactory.getTokenProvider();
        const token = yield tokenProvider.getToken(`https://analysis.windows.net/powerbi/api`);
        setToken(token);
    });
    return (React.createElement(Page, { blockOverflow: false, context: context, itemsBreadcrumbs: [
            { name: 'Relatórios', page: '' },
            {
                name: 'Sessão Academica (Por Mês)',
                page: 'Sessão Academica (Por Mês)',
            },
        ] }, token ? (React.createElement(PowerBIEmbed, { embedConfig: {
            type: 'report',
            id: REPORTS.academicSessionByMonth,
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
        }, eventHandlers: new Map([
            [
                'loaded',
                () => {
                    console.log('ReportAcademicSessionByMonth loaded');
                },
            ],
            [
                'rendered',
                () => {
                    console.log('ReportAcademicSessionByMonth rendered');
                },
            ],
            [
                'error',
                (event) => {
                    console.log(event.detail);
                },
            ],
        ]), cssClassName: styles.wrapperReport, getEmbeddedComponent: (embeddedReportAcademicSessionByMonth) => {
            // @ts-ignore
            window.report = embeddedReportAcademicSessionByMonth;
        } })) : null));
};
export default ReportAcademicSessionByMonthPage;
//# sourceMappingURL=ReportAcademicSessionByMonthPage.js.map