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
const ReportScheduleTeacherPage = ({ context, }) => {
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
                name: 'Agenda de Professores',
                page: 'Agenda de Professores',
            },
        ] }, token ? (React.createElement(PowerBIEmbed, { embedConfig: {
            type: 'report',
            id: REPORTS.teacherSchedule,
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
                    console.log('ReportScheduleTeacher loaded');
                },
            ],
            [
                'rendered',
                () => {
                    console.log('ReportScheduleTeacher rendered');
                },
            ],
            [
                'error',
                (event) => {
                    console.log(event.detail);
                },
            ],
        ]), cssClassName: styles.wrapperReport, getEmbeddedComponent: (embeddedReportScheduleTeacher) => {
            // @ts-ignore
            window.report = embeddedReportScheduleTeacher;
        } })) : null));
};
export default ReportScheduleTeacherPage;
//# sourceMappingURL=ReportScheduleTeacherPage.js.map