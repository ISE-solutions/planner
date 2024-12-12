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
import * as yup from 'yup';
import Page from '~/components/Page';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import Filter from './Filter';
import { fetchAllActivities } from '~/store/modules/activity/actions';
import { EActivityTypeApplication, EDeliveryType, EFatherTag, } from '~/config/enums';
import { PREFIX } from '~/config/database';
import DayReport from './DayReport';
import ModalImg from './ModalImg';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Box, Button } from '@material-ui/core';
import { FaFilePdf } from 'react-icons/fa';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import PDFService from './PDFService';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { dateFormat } from './constants';
import { setValue } from '~/store/modules/common';
import { EActionType } from '~/store/modules/activity/types';
import { fetchImages } from '~/store/modules/app/actions';
import { Backdrop } from '~/components';
const TimeReportPage = ({ context }) => {
    const [openGeneratePdf, setOpenGeneratePdf] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [isSubmited, setIsSubmited] = React.useState(false);
    const [language, setLanguage] = React.useState({
        value: `${PREFIX}nome`,
        label: 'Português',
    });
    const dispatch = useDispatch();
    const { activity, tag, person, space } = useSelector((state) => state);
    const { loading: loadingActivity, activities } = activity;
    const { dictPeople } = person;
    const { dictTag } = tag;
    const { dictSpace } = space;
    React.useEffect(() => {
        dispatch(fetchAllSpace({}));
        dispatch(fetchImages());
    }, []);
    const validationSchema = yup.object({
        program: yup.mixed().required('Campo Obrigatório'),
        team: yup.mixed().required('Campo Obrigatório'),
    });
    const formik = useFormik({
        initialValues: {
            program: null,
            team: null,
            schedules: [],
            startDate: null,
            endDate: null,
        },
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        validationSchema: validationSchema,
        onSubmit: (values) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            setIsSubmited(true);
            if (values.schedules.length) {
                dispatch(fetchAllActivities({
                    active: 'Ativo',
                    orderBy: `${PREFIX}datahorainicio`,
                    order: 'asc',
                    startDate: values.startDate,
                    endDate: values.endDate,
                    schedulesId: values.schedules,
                    teamId: (_a = values.team) === null || _a === void 0 ? void 0 : _a[`${PREFIX}turmaid`],
                    programId: (_b = values.program) === null || _b === void 0 ? void 0 : _b[`${PREFIX}programaid`],
                    typeApplication: EActivityTypeApplication.APLICACAO,
                }));
            }
            else {
                dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, []));
            }
        }),
    });
    const activityName = (act, language) => {
        var _a;
        let name = act === null || act === void 0 ? void 0 : act[`${PREFIX}nome`];
        const fantasyName = (_a = act === null || act === void 0 ? void 0 : act[`${PREFIX}Atividade_NomeAtividade`]) === null || _a === void 0 ? void 0 : _a.find((e) => {
            const useTag = dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]];
            return (useTag === null || useTag === void 0 ? void 0 : useTag[`${PREFIX}nome`]) === EFatherTag.RELATORIO_HORARIO;
        });
        if (fantasyName && language && (fantasyName === null || fantasyName === void 0 ? void 0 : fantasyName[language === null || language === void 0 ? void 0 : language.value])) {
            name = fantasyName === null || fantasyName === void 0 ? void 0 : fantasyName[language === null || language === void 0 ? void 0 : language.value];
        }
        return name;
    };
    const academicAreaName = (act, language) => {
        var _a, _b, _c, _d;
        let name = (_a = act === null || act === void 0 ? void 0 : act[`${PREFIX}AreaAcademica`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`];
        const fantasyName = (_d = (_c = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_b = act === null || act === void 0 ? void 0 : act[`${PREFIX}AreaAcademica`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}etiquetaid`]]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}Etiqueta_NomeEtiqueta`]) === null || _d === void 0 ? void 0 : _d.find((e) => {
            const useTag = dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]];
            return (useTag === null || useTag === void 0 ? void 0 : useTag[`${PREFIX}nome`]) === EFatherTag.RELATORIO_HORARIO;
        });
        if (fantasyName && language && (fantasyName === null || fantasyName === void 0 ? void 0 : fantasyName[language === null || language === void 0 ? void 0 : language.value])) {
            name = fantasyName === null || fantasyName === void 0 ? void 0 : fantasyName[language === null || language === void 0 ? void 0 : language.value];
        }
        return name;
    };
    const moduleName = (module, language) => {
        var _a;
        if (!module)
            return '';
        let name = module === null || module === void 0 ? void 0 : module[`${PREFIX}nome`];
        const fantasyName = (_a = module === null || module === void 0 ? void 0 : module[`${PREFIX}Etiqueta_NomeEtiqueta`]) === null || _a === void 0 ? void 0 : _a.find((e) => {
            const useTag = dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]];
            return (useTag === null || useTag === void 0 ? void 0 : useTag[`${PREFIX}nome`]) === EFatherTag.RELATORIO_HORARIO;
        });
        if (fantasyName && language && (fantasyName === null || fantasyName === void 0 ? void 0 : fantasyName[language === null || language === void 0 ? void 0 : language.value])) {
            name = fantasyName === null || fantasyName === void 0 ? void 0 : fantasyName[language === null || language === void 0 ? void 0 : language.value];
        }
        return name;
    };
    const spaceName = (act, language) => {
        var _a, _b, _c;
        let spaces = act === null || act === void 0 ? void 0 : act[`${PREFIX}Atividade_Espaco`];
        return (_c = (_b = (_a = spaces === null || spaces === void 0 ? void 0 : spaces.map((sp) => {
            var _a;
            const fantasyName = (_a = dictSpace === null || dictSpace === void 0 ? void 0 : dictSpace[sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}espacoid`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}Espaco_NomeEspaco`].find((e) => {
                const useTag = dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]];
                return (useTag === null || useTag === void 0 ? void 0 : useTag[`${PREFIX}nome`]) === EFatherTag.RELATORIO_HORARIO;
            });
            if (fantasyName && language && (fantasyName === null || fantasyName === void 0 ? void 0 : fantasyName[language === null || language === void 0 ? void 0 : language.value])) {
                return fantasyName === null || fantasyName === void 0 ? void 0 : fantasyName[language === null || language === void 0 ? void 0 : language.value];
            }
            else {
                return sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}nome`];
            }
        })) === null || _a === void 0 ? void 0 : _a.filter((e) => !!(e === null || e === void 0 ? void 0 : e.trim()))) === null || _b === void 0 ? void 0 : _b.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))) === null || _c === void 0 ? void 0 : _c.join('; ');
    };
    const teamName = (language) => {
        var _a, _b, _c;
        let name = (_a = formik.values.team) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`];
        const fantasyName = (_c = (_b = formik.values.team) === null || _b === void 0 ? void 0 : _b[`${PREFIX}Turma_NomeTurma`]) === null || _c === void 0 ? void 0 : _c.find((e) => {
            const useTag = dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]];
            return (useTag === null || useTag === void 0 ? void 0 : useTag[`${PREFIX}nome`]) === EFatherTag.RELATORIO_HORARIO;
        });
        if (fantasyName && language && (fantasyName === null || fantasyName === void 0 ? void 0 : fantasyName[language === null || language === void 0 ? void 0 : language.value])) {
            name = fantasyName === null || fantasyName === void 0 ? void 0 : fantasyName[language === null || language === void 0 ? void 0 : language.value];
        }
        return name;
    };
    const programName = (language) => {
        var _a, _b, _c, _d;
        let name = (_b = (_a = formik.values.program) === null || _a === void 0 ? void 0 : _a[`${PREFIX}NomePrograma`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`];
        const fantasyName = (_d = (_c = formik.values.program) === null || _c === void 0 ? void 0 : _c[`${PREFIX}Programa_NomePrograma`]) === null || _d === void 0 ? void 0 : _d.find((e) => {
            const useTag = dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]];
            return (useTag === null || useTag === void 0 ? void 0 : useTag[`${PREFIX}nome`]) === EFatherTag.RELATORIO_HORARIO;
        });
        if (fantasyName && language && (fantasyName === null || fantasyName === void 0 ? void 0 : fantasyName[language === null || language === void 0 ? void 0 : language.value])) {
            name = fantasyName === null || fantasyName === void 0 ? void 0 : fantasyName[language === null || language === void 0 ? void 0 : language.value];
        }
        return name;
    };
    const handleGeneratePDF = ({ leftImg, rightImg, centerImg, language }) => {
        var _a, _b;
        setLoading(true);
        let items = (_a = activities
            .map((act) => {
            var _a, _b, _c, _d, _e, _f, _g;
            const schedule = (_a = act === null || act === void 0 ? void 0 : act[`${PREFIX}CronogramadeDia_Atividade`]) === null || _a === void 0 ? void 0 : _a[0];
            return {
                start: act === null || act === void 0 ? void 0 : act[`${PREFIX}inicio`],
                date: moment(act === null || act === void 0 ? void 0 : act[`${PREFIX}datahorainicio`]).format(dateFormat[language.value]),
                module: moduleName(dictTag[schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}modulo_value`]] || '', language),
                course: ((_b = dictTag[act === null || act === void 0 ? void 0 : act[`_${PREFIX}curso_value`]]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]) ||
                    '',
                timeStart: act === null || act === void 0 ? void 0 : act[`${PREFIX}inicio`],
                timeEnd: act === null || act === void 0 ? void 0 : act[`${PREFIX}fim`],
                name: activityName(act, language) || '',
                theme: (act === null || act === void 0 ? void 0 : act[`${PREFIX}temaaula`]) || '',
                people: (_e = (_d = (_c = act === null || act === void 0 ? void 0 : act[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _c === void 0 ? void 0 : _c.filter((ev) => ev === null || ev === void 0 ? void 0 : ev[`_${PREFIX}pessoa_value`])) === null || _d === void 0 ? void 0 : _d.map((envolv) => {
                    var _a;
                    const p = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[envolv === null || envolv === void 0 ? void 0 : envolv[`_${PREFIX}pessoa_value`]];
                    const isTeacher = (_a = p === null || p === void 0 ? void 0 : p[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.find((e) => {
                        var _a;
                        return (_a = e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase().includes(EFatherTag.PROFESSOR.toLocaleLowerCase());
                    });
                    const pref = isTeacher ? 'Prof. ' : '';
                    return `${pref}${(p === null || p === void 0 ? void 0 : p[`${PREFIX}nome`]) || ''} ${(p === null || p === void 0 ? void 0 : p[`${PREFIX}sobrenome`]) || ''}`;
                })) === null || _e === void 0 ? void 0 : _e.filter((e) => !!(e === null || e === void 0 ? void 0 : e.trim())).join('; '),
                documents: (_g = (_f = act === null || act === void 0 ? void 0 : act[`${PREFIX}Atividade_Documento`]) === null || _f === void 0 ? void 0 : _f.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`])) === null || _g === void 0 ? void 0 : _g.map((dc) => `${dc === null || dc === void 0 ? void 0 : dc[`${PREFIX}nome`]} (${EDeliveryType === null || EDeliveryType === void 0 ? void 0 : EDeliveryType[dc === null || dc === void 0 ? void 0 : dc[`${PREFIX}entrega`]]})`),
                academicArea: academicAreaName(act, language),
                spaces: spaceName(act, language),
            };
        })) === null || _a === void 0 ? void 0 : _a.sort((a, b) => `${moment(a === null || a === void 0 ? void 0 : a.start, 'HH:mm').unix()} ${moment(b === null || b === void 0 ? void 0 : b.start, 'HH:mm').unix()}`);
        const itemsGrouped = _.groupBy(items, (e) => e.date);
        let itemsReturn = [];
        (_b = Object.keys(itemsGrouped)) === null || _b === void 0 ? void 0 : _b.forEach((keyActv) => {
            itemsReturn.push({
                day: keyActv,
                items: itemsGrouped[keyActv],
            });
        });
        itemsReturn = itemsReturn === null || itemsReturn === void 0 ? void 0 : itemsReturn.sort((a, b) => moment(a === null || a === void 0 ? void 0 : a.day, 'DD/MM/YYYY').unix() -
            moment(b === null || b === void 0 ? void 0 : b.day, 'DD/MM/YYYY').unix());
        const pdfService = new PDFService(leftImg, rightImg, centerImg, itemsReturn, teamName(language), programName(language), language);
        pdfService.generatePDF().then(() => {
            setLoading(false);
        });
    };
    const activitiesRender = React.useMemo(() => {
        var _a, _b;
        let items = (_a = activities
            .map((act) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            const schedule = (_a = act === null || act === void 0 ? void 0 : act[`${PREFIX}CronogramadeDia_Atividade`]) === null || _a === void 0 ? void 0 : _a[0];
            return {
                start: act === null || act === void 0 ? void 0 : act[`${PREFIX}inicio`],
                date: moment(act === null || act === void 0 ? void 0 : act[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY'),
                module: ((_b = dictTag[schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}modulo_value`]]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]) ||
                    '',
                time: `${act === null || act === void 0 ? void 0 : act[`${PREFIX}inicio`]} - ${act === null || act === void 0 ? void 0 : act[`${PREFIX}fim`]}`,
                name: act === null || act === void 0 ? void 0 : act[`${PREFIX}nome`],
                theme: act === null || act === void 0 ? void 0 : act[`${PREFIX}temaaula`],
                course: ((_c = dictTag[act === null || act === void 0 ? void 0 : act[`_${PREFIX}curso_value`]]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}nome`]) ||
                    '',
                people: (_e = (_d = act === null || act === void 0 ? void 0 : act[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _d === void 0 ? void 0 : _d.map((envolv) => {
                    var _a;
                    const p = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[envolv === null || envolv === void 0 ? void 0 : envolv[`_${PREFIX}pessoa_value`]];
                    const isTeacher = (_a = p === null || p === void 0 ? void 0 : p[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.find((e) => {
                        var _a;
                        return (_a = e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase().includes(EFatherTag.PROFESSOR.toLocaleLowerCase());
                    });
                    const pref = isTeacher ? 'Prof. ' : '';
                    return `${pref}${(p === null || p === void 0 ? void 0 : p[`${PREFIX}nome`]) || ''} ${(p === null || p === void 0 ? void 0 : p[`${PREFIX}sobrenome`]) || ''}`;
                })) === null || _e === void 0 ? void 0 : _e.filter((e) => !!(e === null || e === void 0 ? void 0 : e.trim())).join('; '),
                documents: (_g = (_f = act === null || act === void 0 ? void 0 : act[`${PREFIX}Atividade_Documento`]) === null || _f === void 0 ? void 0 : _f.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`])) === null || _g === void 0 ? void 0 : _g.map((dc) => `${dc === null || dc === void 0 ? void 0 : dc[`${PREFIX}nome`]} (${EDeliveryType === null || EDeliveryType === void 0 ? void 0 : EDeliveryType[dc === null || dc === void 0 ? void 0 : dc[`${PREFIX}entrega`]]})`),
                academicArea: (_h = act === null || act === void 0 ? void 0 : act[`${PREFIX}AreaAcademica`]) === null || _h === void 0 ? void 0 : _h[`${PREFIX}nome`],
                spaces: (_m = (_l = (_k = (_j = act === null || act === void 0 ? void 0 : act[`${PREFIX}Atividade_Espaco`]) === null || _j === void 0 ? void 0 : _j.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}nome`])) === null || _k === void 0 ? void 0 : _k.filter((e) => !!(e === null || e === void 0 ? void 0 : e.trim()))) === null || _l === void 0 ? void 0 : _l.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))) === null || _m === void 0 ? void 0 : _m.join('; '),
            };
        })) === null || _a === void 0 ? void 0 : _a.sort((a, b) => moment(a === null || a === void 0 ? void 0 : a.start, 'HH:mm').unix() - moment(b === null || b === void 0 ? void 0 : b.start, 'HH:mm').unix());
        const itemsGrouped = _.groupBy(items, (e) => e.date);
        const itemsReturn = [];
        (_b = Object.keys(itemsGrouped)) === null || _b === void 0 ? void 0 : _b.forEach((keyActv) => {
            itemsReturn.push({
                day: keyActv,
                items: itemsGrouped[keyActv],
            });
        });
        return itemsReturn === null || itemsReturn === void 0 ? void 0 : itemsReturn.sort((a, b) => moment(a === null || a === void 0 ? void 0 : a.day, 'DD/MM/YYYY').unix() -
            moment(b === null || b === void 0 ? void 0 : b.day, 'DD/MM/YYYY').unix());
    }, [activities]);
    return (React.createElement(Page, { context: context, blockOverflow: false, maxHeight: 'calc(100vh - 11rem)', itemsBreadcrumbs: [
            { name: 'Relatórios', page: '' },
            { name: 'Relatórios de Horário', page: 'Relatórios de Horário' },
        ] },
        React.createElement(Backdrop, { open: loading },
            React.createElement(CircularProgress, { color: 'inherit' })),
        React.createElement(Filter, { formik: formik }),
        Object.keys(activitiesRender).length ? (React.createElement(Box, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
            React.createElement(Button, { color: 'primary', variant: 'contained', startIcon: React.createElement(FaFilePdf, null), onClick: () => setOpenGeneratePdf(true) }, "Gerar PDF"),
            React.createElement(Box, { width: '60%' },
                React.createElement(Typography, { variant: 'h6', style: { fontWeight: 'bold' } }, teamName(language))))) : null,
        loadingActivity ? (React.createElement(Box, { display: 'flex', alignItems: 'center', justifyContent: 'center' },
            React.createElement(CircularProgress, { color: 'primary' }))) : (activitiesRender === null || activitiesRender === void 0 ? void 0 : activitiesRender.length) ? (React.createElement(Box, { overflow: 'auto', maxHeight: 'calc(100vh - 23rem)' }, activitiesRender === null || activitiesRender === void 0 ? void 0 : activitiesRender.map((e) => (React.createElement(DayReport, { day: e === null || e === void 0 ? void 0 : e.day, items: e === null || e === void 0 ? void 0 : e.items }))))) : isSubmited ? (React.createElement(Box, { display: 'flex', justifyContent: 'center', alignItems: 'center' },
            React.createElement(Typography, { variant: 'body1' }, "N\u00E3o possui registros"))) : null,
        React.createElement(ModalImg, { open: openGeneratePdf, language: language, setLanguage: setLanguage, generatePDF: handleGeneratePDF, onClose: () => setOpenGeneratePdf(false) })));
};
export default TimeReportPage;
//# sourceMappingURL=TimeReportPage.js.map