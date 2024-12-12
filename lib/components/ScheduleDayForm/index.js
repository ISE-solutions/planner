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
import { Box, IconButton, SwipeableDrawer, Typography, } from '@material-ui/core';
import * as yup from 'yup';
import { AddOutlined, Close, FileCopyOutlined } from '@material-ui/icons';
import { BoxCloseIcon, OptionCard, StyledCardActionArea } from './styles';
import Form from './Form';
import LoadModel from './LoadModel';
import { useActivity, useConfirmation, useLoggedUser, useNotification, } from '~/hooks';
import { PREFIX } from '~/config/database';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { createModel } from '~/store/modules/model/actions';
import { TYPE_ORIGIN_MODEL, TYPE_REQUEST_MODEL } from '~/config/constants';
import { getSchedules } from '~/store/modules/schedule/actions';
import ModalCreateModel from '../ModalCreateModel';
const OPTION_NEW = 'new';
const OPTION_LOAD = 'load';
const ScheduleDayForm = ({ visible, teamId, program, team, isDraft, titleRequired = true, isGroup, isProgramResponsible, isProgramDirector, isHeadOfService, programId, isModel, isScheduleModel, schedule, context, handleClose, setSchedule, }) => {
    const [option, setOption] = React.useState('');
    const [openCreateModel, setOpenCreateModel] = React.useState(false);
    const [scheduleModel, setScheduleModel] = React.useState(null);
    const [{ getActivity }] = useActivity({}, {
        manual: true,
    });
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const { currentUser } = useLoggedUser();
    const dispatch = useDispatch();
    const { tag, space, person } = useSelector((state) => state);
    const { tags, dictTag } = tag;
    const { spaces, dictSpace } = space;
    const { persons, dictPeople } = person;
    React.useEffect(() => {
        formik.resetForm();
    }, []);
    const handleSetOption = (opt) => {
        setOption(opt);
        formik.resetForm();
    };
    const renderOptions = () => (React.createElement(React.Fragment, null,
        React.createElement(Box, { padding: '2rem', minWidth: '30rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', style: { gap: '1rem' } },
            React.createElement(OptionCard, { elevation: 3 },
                React.createElement(StyledCardActionArea, { onClick: () => handleSetOption(OPTION_NEW) },
                    React.createElement(AddOutlined, { color: 'primary', style: { fontSize: '3rem' } }),
                    React.createElement(Typography, { color: 'primary', variant: 'body1' }, "Criar"))),
            React.createElement(OptionCard, { elevation: 3 },
                React.createElement(StyledCardActionArea, { onClick: () => handleSetOption(OPTION_LOAD) },
                    React.createElement(FileCopyOutlined, { color: 'primary', style: { fontSize: '3rem' } }),
                    React.createElement(Typography, { color: 'primary', variant: 'body1' }, "Usar modelo"))))));
    const onClose = (isRefetch) => {
        handleClose(isRefetch);
        setOption('');
        setScheduleModel(null);
    };
    const handleModel = (model) => {
        let newModel = Object.assign({}, model);
        setScheduleModel(newModel);
    };
    const validationSchema = yup.object({
        model: yup.mixed().required('Campo Obrigatório'),
        startDate: yup.mixed().required('Campo Obrigatório'),
    });
    const validationSchemaModel = yup.object({
        model: yup.mixed().required('Campo Obrigatório'),
    });
    const formik = useFormik({
        initialValues: {
            startDate: null,
            model: null,
            loadSpaces: true,
            loadPerson: true,
        },
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        validationSchema: isModel ? validationSchemaModel : validationSchema,
        onSubmit: (values) => __awaiter(void 0, void 0, void 0, function* () {
            handleCloseOpenCreateModel();
            if (!isModel) {
                const schedulesRequest = yield getSchedules({
                    date: values.startDate.format('YYYY-MM-DD'),
                    active: 'Ativo',
                    teamId: teamId,
                    model: isModel,
                    filterTeam: true,
                });
                if (schedulesRequest.length) {
                    notification.error({
                        title: 'Data já sendo utilizada',
                        description: 'O dia informado já possui cadastro, verifique!',
                    });
                    return;
                }
            }
            dispatch(createModel({
                Tipo: isModel
                    ? TYPE_REQUEST_MODEL.CRIACAO
                    : TYPE_REQUEST_MODEL.UTILIZACAO,
                Origem: TYPE_ORIGIN_MODEL.CRONOGRAMA,
                Nome: '',
                ManterEspacos: values.loadSpaces ? 'Sim' : 'Não',
                ManterPessoas: values.loadPerson ? 'Sim' : 'Não',
                IDOrigem: values.model[`${PREFIX}cronogramadediaid`],
                IDPessoa: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`],
                IDPai: teamId,
                DataInicial: isModel ? '' : values.startDate.format('YYYY-MM-DD'),
            }, {
                onSuccess: () => {
                    handleClose();
                    confirmation.openConfirmation({
                        title: 'Criação de modelo',
                        yesLabel: 'Fechar',
                        showCancel: false,
                        description: isModel
                            ? 'Olá, a sua solicitação para criação de um modelo foi iniciada. A mesma poderá demorar alguns minutos. Assim que a criação for concluída você será notificado!'
                            : 'Olá, a sua solicitação para aplicar um modelo foi iniciada. A mesma poderá demorar alguns minutos. Assim que o modelo for aplicado você será notificado!',
                        onConfirm: () => null,
                    });
                },
                onError: (error) => {
                    var _a, _b;
                    notification.error({
                        title: 'Falha',
                        description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                    });
                },
            }));
        }),
    });
    const handleCreate = () => {
        formik.validateForm().then((errors) => {
            if (!Object.keys(errors).length) {
                setOpenCreateModel(true);
            }
        });
    };
    const handleCloseOpenCreateModel = () => {
        setOpenCreateModel(false);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(ModalCreateModel, { values: formik.values, setFieldValue: formik.setFieldValue, open: openCreateModel, onSave: formik.handleSubmit, onClose: handleCloseOpenCreateModel }),
        React.createElement(SwipeableDrawer, { anchor: 'right', open: visible, onClose: () => onClose(), onOpen: () => null, disableBackdropClick: true }, option === OPTION_NEW || !!schedule ? (React.createElement(Form, { context: context, isModel: isModel, isDraft: isDraft, program: program, team: team, isGroup: isGroup, isProgramResponsible: isProgramResponsible, isProgramDirector: isProgramDirector, isHeadOfService: isHeadOfService, getActivity: getActivity, setSchedule: setSchedule, setScheduleModel: setScheduleModel, isScheduleModel: isScheduleModel, isLoadModel: !!scheduleModel, schedule: schedule || scheduleModel, teamId: teamId, programId: programId, titleRequired: titleRequired, tagsOptions: tags, peopleOptions: persons, dictTag: dictTag, dictPeople: dictPeople, dictSpace: dictSpace, spaceOptions: spaces, handleClose: onClose })) : (React.createElement(Box, null,
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', padding: '2rem' },
                React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold' } }, "Escolha uma op\u00E7\u00E3o"),
                React.createElement(BoxCloseIcon, null,
                    React.createElement(IconButton, { onClick: () => onClose() },
                        React.createElement(Close, null)))),
            React.createElement(Box, { marginTop: '20%' },
                renderOptions(),
                option === OPTION_LOAD && (React.createElement(LoadModel, { isModel: isModel, isGroup: isGroup, values: formik.values, errors: formik.errors, setFieldValue: formik.setFieldValue, handleNext: handleCreate }))))))));
};
export default ScheduleDayForm;
//# sourceMappingURL=index.js.map