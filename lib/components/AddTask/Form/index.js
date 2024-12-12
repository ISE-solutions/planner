import 'react-quill/dist/quill.snow.css';
import { Box, Button, CircularProgress, IconButton, Typography, } from '@material-ui/core';
import * as _ from 'lodash';
import { Close } from '@material-ui/icons';
import { useFormik } from 'formik';
import * as React from 'react';
import * as yup from 'yup';
import { useConfirmation, useLoggedUser, useNotification } from '~/hooks';
import InfoForm from './InfoForm';
import { PREFIX } from '~/config/database';
import { Backdrop } from '~/components';
import { BoxCloseIcon } from '../styles';
import getKeyEnum from '~/utils/getKeyEnum';
import { PRIORITY_TASK, STATUS_TASK, TYPE_TASK } from '~/config/enums';
import { addOrUpdateTask } from '~/store/modules/task/actions';
import * as moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
const Form = ({ task, refetch, setTeam, handleClose }) => {
    const DEFAULT_VALUES = React.useMemo(() => {
        return {
            title: '',
            type: TYPE_TASK.PLANEJAMENTO,
            responsible: [],
            group: '',
            status: '',
            priority: '',
            completionForecast: null,
            concludedDay: null,
            startDay: null,
            program: null,
            team: null,
            activity: null,
            link: '',
            observation: '',
        };
    }, []);
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const [isDetail, setIsDetail] = React.useState(task);
    const [loading, setLoading] = React.useState(false);
    const [valuesSetted, setValuesSetted] = React.useState(false);
    const [pastValues, setPastValues] = React.useState(DEFAULT_VALUES);
    const { tag } = useSelector((state) => state);
    const { dictTag } = tag;
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const validationSchema = yup.object({
        title: yup.string().required('Campo Obrigatório'),
        status: yup.mixed().required('Campo Obrigatório'),
        priority: yup.mixed().required('Campo Obrigatório'),
        program: yup.mixed().required('Campo Obrigatório'),
        completionForecast: yup.mixed().required('Campo Obrigatório'),
    });
    const { currentUser } = useLoggedUser();
    const dispatch = useDispatch();
    React.useEffect(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (task && !valuesSetted && Object.keys(dictTag)) {
            const companyName = (_b = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_a = task === null || task === void 0 ? void 0 : task[`${PREFIX}Programa`]) === null || _a === void 0 ? void 0 : _a[`_${PREFIX}empresa_value`]]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`];
            const programName = (_d = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_c = task === null || task === void 0 ? void 0 : task[`${PREFIX}Programa`]) === null || _c === void 0 ? void 0 : _c[`_${PREFIX}nomeprograma_value`]]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`];
            const iniVal = {
                createdon: (task === null || task === void 0 ? void 0 : task.createdon) ? moment(task === null || task === void 0 ? void 0 : task.createdon) : null,
                title: task[`${PREFIX}nome`] || '',
                type: task[`${PREFIX}tipo`] || '',
                responsible: task[`${PREFIX}tarefas_responsaveis_ise_pessoa`].map((e) => (Object.assign(Object.assign({}, e), { value: e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoaid`], label: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomecompleto`] }))),
                group: task[`${PREFIX}Grupo`]
                    ? Object.assign(Object.assign({}, task[`${PREFIX}Grupo`]), { value: (_e = task[`${PREFIX}Grupo`]) === null || _e === void 0 ? void 0 : _e[`${PREFIX}etiquetaid`], label: (_f = task[`${PREFIX}Grupo`]) === null || _f === void 0 ? void 0 : _f[`${PREFIX}nome`] }) : null,
                program: Object.assign(Object.assign({}, task[`${PREFIX}Programa`]), { label: `${companyName} - ${programName}` }),
                team: task[`${PREFIX}Turma`],
                activity: task[`${PREFIX}Atividade`]
                    ? Object.assign(Object.assign({}, task[`${PREFIX}Atividade`]), { label: `${moment((_g = task === null || task === void 0 ? void 0 : task[`${PREFIX}Atividade`]) === null || _g === void 0 ? void 0 : _g[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY')} - ${(_h = task === null || task === void 0 ? void 0 : task[`${PREFIX}Atividade`]) === null || _h === void 0 ? void 0 : _h[`${PREFIX}nome`]}` }) : null,
                status: {
                    value: task.statuscode,
                    label: getKeyEnum(STATUS_TASK, task.statuscode),
                } || null,
                priority: {
                    value: task[`${PREFIX}prioridade`],
                    label: getKeyEnum(PRIORITY_TASK, task[`${PREFIX}prioridade`]),
                } || '',
                startDay: task[`${PREFIX}datadeinicio`]
                    ? moment(task[`${PREFIX}datadeinicio`])
                    : null,
                completionForecast: task[`${PREFIX}previsaodeconclusao`]
                    ? moment(task[`${PREFIX}previsaodeconclusao`])
                    : null,
                concludedDay: task[`${PREFIX}dataconclusao`]
                    ? moment(task[`${PREFIX}dataconclusao`])
                    : null,
                link: task[`${PREFIX}link`] || '',
                observation: task[`${PREFIX}observacao`] || '',
            };
            setInitialValues(iniVal);
            setPastValues(iniVal);
            setValuesSetted(true);
        }
    }, [task, dictTag]);
    const onClose = () => {
        if (!_.isEqualWith(pastValues, formik.values)) {
            confirmation.openConfirmation({
                title: 'Dados não alterados',
                description: 'O que deseja?',
                yesLabel: 'Salvar',
                noLabel: 'Sair sem Salvar',
                onConfirm: () => formik.handleSubmit(),
                onCancel: () => {
                    setInitialValues(DEFAULT_VALUES);
                    formik.resetForm();
                    handleClose();
                    setValuesSetted(false);
                },
            });
        }
        else {
            setInitialValues(DEFAULT_VALUES);
            formik.resetForm();
            handleClose();
            setValuesSetted(false);
        }
    };
    const handleSuccess = (newTeam) => {
        setTeam === null || setTeam === void 0 ? void 0 : setTeam(newTeam);
        setLoading(false);
        refetch === null || refetch === void 0 ? void 0 : refetch();
        setInitialValues(DEFAULT_VALUES);
        formik.resetForm();
        handleClose();
        notification.success({
            title: 'Sucesso',
            description: 'Cadastro realizado com sucesso',
        });
    };
    const handleError = (error) => {
        var _a, _b;
        setLoading(false);
        notification.error({
            title: 'Falha',
            description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
        });
    };
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            try {
                setLoading(true);
                const peopleToDelete = (_a = task === null || task === void 0 ? void 0 : task[`${PREFIX}tarefas_responsaveis_ise_pessoa`]) === null || _a === void 0 ? void 0 : _a.filter((e) => {
                    var _a;
                    return !((_a = values === null || values === void 0 ? void 0 : values.responsible) === null || _a === void 0 ? void 0 : _a.some((sp) => (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}pessoaid`]) === e[`${PREFIX}pessoaid`]));
                });
                const peopleToNotify = (_b = values === null || values === void 0 ? void 0 : values.responsible) === null || _b === void 0 ? void 0 : _b.filter((res) => task === null || task === void 0 ? void 0 : task[`${PREFIX}tarefas_responsaveis_ise_pessoa`].some((taRes) => (taRes === null || taRes === void 0 ? void 0 : taRes[`${PREFIX}pessoaid`]) !== (res === null || res === void 0 ? void 0 : res[`${PREFIX}pessoaid`])));
                let deleteTask = false;
                if (((_c = pastValues === null || pastValues === void 0 ? void 0 : pastValues.status) === null || _c === void 0 ? void 0 : _c.value) === STATUS_TASK.Concluído &&
                    ((_d = pastValues === null || pastValues === void 0 ? void 0 : pastValues.status) === null || _d === void 0 ? void 0 : _d.value) !== ((_e = values.status) === null || _e === void 0 ? void 0 : _e.value)) {
                    deleteTask = true;
                }
                dispatch(addOrUpdateTask(Object.assign(Object.assign({}, values), { peopleToDelete,
                    peopleToNotify,
                    deleteTask, priority: (_f = values === null || values === void 0 ? void 0 : values.priority) === null || _f === void 0 ? void 0 : _f.value, status: (_g = values === null || values === void 0 ? void 0 : values.status) === null || _g === void 0 ? void 0 : _g.value, startDay: (_h = values === null || values === void 0 ? void 0 : values.startDay) === null || _h === void 0 ? void 0 : _h.format(), completionForecast: (_j = values === null || values === void 0 ? void 0 : values.completionForecast) === null || _j === void 0 ? void 0 : _j.format(), concludedDay: (_k = values === null || values === void 0 ? void 0 : values.concludedDay) === null || _k === void 0 ? void 0 : _k.format(), programId: (_l = values === null || values === void 0 ? void 0 : values.program) === null || _l === void 0 ? void 0 : _l[`${PREFIX}programaid`], teamId: (_m = values === null || values === void 0 ? void 0 : values.team) === null || _m === void 0 ? void 0 : _m[`${PREFIX}turmaid`], activityId: (_o = values === null || values === void 0 ? void 0 : values.activity) === null || _o === void 0 ? void 0 : _o[`${PREFIX}atividadeid`], id: task === null || task === void 0 ? void 0 : task[`${PREFIX}tarefaid`] }), {
                    onSuccess: handleSuccess,
                    onError: handleError,
                }));
            }
            catch (error) {
                setLoading(false);
                console.error(error);
            }
        },
    });
    const canEdit = React.useMemo(() => {
        return ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) ||
            (task === null || task === void 0 ? void 0 : task[`${PREFIX}tarefas_responsaveis_ise_pessoa`].some((ta) => (ta === null || ta === void 0 ? void 0 : ta[`${PREFIX}pessoaid`]) === (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]))) ||
            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}Pessoa_Etiqueta_Etiqueta`].some((pe) => {
                var _a;
                return (pe === null || pe === void 0 ? void 0 : pe[`${PREFIX}etiquetaid`]) ===
                    ((_a = task === null || task === void 0 ? void 0 : task[`${PREFIX}Grupo`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]);
            })));
    }, [currentUser]);
    return (React.createElement(React.Fragment, null,
        React.createElement(BoxCloseIcon, null,
            React.createElement(IconButton, { onClick: onClose },
                React.createElement(Close, null))),
        React.createElement(Backdrop, { open: loading },
            React.createElement(CircularProgress, { color: 'inherit' })),
        React.createElement(Box, { display: 'flex', height: '100%', flexDirection: 'column', padding: '2rem', minWidth: '30rem' },
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', paddingRight: '2rem' },
                React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold' } }, (task === null || task === void 0 ? void 0 : task[`${PREFIX}tarefaid`])
                    ? 'Alterar tarefa'
                    : 'Cadastrar tarefa'),
                canEdit ? (React.createElement(Button, { variant: 'contained', color: 'primary', disabled: !isDetail, onClick: () => setIsDetail(false) }, "Editar")) : null),
            React.createElement(Box, { flex: '1 0 auto', overflow: 'auto', maxHeight: 'calc(100vh - 12rem)', maxWidth: '50rem' },
                React.createElement(InfoForm, { isDetail: isDetail, task: task, values: formik.values, errors: formik.errors, setFieldValue: formik.setFieldValue, handleChange: formik.handleChange })),
            React.createElement(Box, { width: '100%', marginTop: '1rem', display: 'flex', padding: '1rem', justifyContent: 'flex-end' },
                React.createElement(Box, { display: 'flex', justifyContent: 'flex-end', style: { gap: '1rem' } },
                    React.createElement(Button, { color: 'primary', onClick: onClose }, "Cancelar"),
                    React.createElement(Button, { variant: 'contained', color: 'primary', disabled: isDetail, onClick: () => !loading && formik.handleSubmit() }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar')))))));
};
export default Form;
//# sourceMappingURL=index.js.map