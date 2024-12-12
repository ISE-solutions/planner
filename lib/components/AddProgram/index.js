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
import { AddOutlined, ArrowBack, Close, FileCopyOutlined, } from '@material-ui/icons';
import { BoxCloseIcon, OptionCard, StyledCardActionArea } from './styles';
import Form from './Form';
import LoadModel from './LoadModel';
import { PREFIX } from '~/config/database';
import { useConfirmation, useLoggedUser, useNotification } from '~/hooks';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createModel } from '~/store/modules/model/actions';
import { TYPE_ORIGIN_MODEL, TYPE_REQUEST_MODEL } from '~/config/constants';
import ModalCreateModel from '~/components/ModalCreateModel';
import { getPrograms } from '~/store/modules/program/actions';
import * as moment from 'moment';
const OPTION_NEW = 'new';
const OPTION_LOAD = 'load';
const AddProgram = ({ open, group, context, isModel, isDraft, isProgramResponsible, program, refetchProgram, setProgram, handleClose, }) => {
    const [option, setOption] = React.useState('');
    const [openCreateModel, setOpenCreateModel] = React.useState(false);
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const { currentUser } = useLoggedUser();
    const dispatch = useDispatch();
    const { tag, person } = useSelector((state) => state);
    const { tags, dictTag } = tag;
    const { persons, dictPeople } = person;
    const onClose = () => {
        handleClose();
        setOption('');
        formik.resetForm();
    };
    React.useEffect(() => {
        formik.resetForm();
    }, []);
    const teamSchema = yup.object().shape({
        sigla: yup.string().required('Campo Obrigatório'),
        yearConclusion: yup
            .mixed()
            .required('Campo Obrigatório')
            .test({
            test: (value) => {
                return !value || (value >= 2000 && value <= 9999);
            },
            message: 'Informe um ano válido',
            name: 'ValidYear',
        })
            .test({
            test: (value) => {
                return !value || value >= moment().year();
            },
            message: `Informe um ano maior ou igual a ${moment().year()}`,
            name: 'ValidY',
        }),
    });
    const validationSchema = yup.object({
        model: yup.mixed().required('Campo Obrigatório'),
        nameProgram: yup.mixed().required('Campo Obrigatório'),
        startDate: yup.mixed().required('Campo Obrigatório'),
        items: yup.array().of(teamSchema),
    });
    const validationSchemaModel = yup.object({
        model: yup.mixed().required('Campo Obrigatório'),
    });
    const formik = useFormik({
        initialValues: {
            startDate: null,
            loadSpaces: true,
            loadPerson: true,
            nameProgram: null,
            model: null,
            items: [],
        },
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        validationSchema: isModel ? validationSchemaModel : validationSchema,
        onSubmit: (values) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            handleCloseOpenCreateModel();
            dispatch(createModel({
                Tipo: isModel
                    ? TYPE_REQUEST_MODEL.CRIACAO
                    : TYPE_REQUEST_MODEL.UTILIZACAO,
                Origem: TYPE_ORIGIN_MODEL.PROGRAMA,
                Nome: '',
                Turmas: (_a = values.items) === null || _a === void 0 ? void 0 : _a.map((te) => ({
                    Id: te.id,
                    Sigla: te.sigla,
                    AnoConclusao: te.yearConclusion,
                })),
                ManterEspacos: values.loadSpaces ? 'Sim' : 'Não',
                ManterPessoas: values.loadPerson ? 'Sim' : 'Não',
                IDOrigem: values.model[`${PREFIX}programaid`],
                IdPrograma: values.nameProgram[`${PREFIX}etiquetaid`],
                IDPessoa: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`],
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
    const handleSave = () => {
        var _a, _b, _c, _d;
        if (!isModel) {
            getPrograms({
                active: 'Ativo',
                model: false,
                nameProgram: (_a = formik.values.nameProgram) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`],
                typeProgram: (_b = formik.values.model) === null || _b === void 0 ? void 0 : _b[`_${PREFIX}tipoprograma_value`],
                institute: (_c = formik.values.model) === null || _c === void 0 ? void 0 : _c[`_${PREFIX}instituto_value`],
                company: (_d = formik.values.model) === null || _d === void 0 ? void 0 : _d[`_${PREFIX}empresa_value`],
            }).then((data) => {
                if (data.length) {
                    notification.error({
                        title: 'Programa existente',
                        description: 'Programa já cadastrado, verifique o nome',
                    });
                }
                else {
                    formik.handleSubmit();
                }
            });
        }
        else {
            formik.handleSubmit();
        }
    };
    const handleCloseOpenCreateModel = () => {
        setOpenCreateModel(false);
    };
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
    return (React.createElement(React.Fragment, null,
        React.createElement(ModalCreateModel, { values: formik.values, setFieldValue: formik.setFieldValue, open: openCreateModel, onSave: handleSave, onClose: handleCloseOpenCreateModel }),
        React.createElement(SwipeableDrawer, { anchor: 'right', open: open, onClose: onClose, onOpen: () => null, disableBackdropClick: true }, option === 'new' || !!program ? (React.createElement(Form, { program: program || formik.values.model, isModel: isModel, isDraft: isDraft, isProgramResponsible: isProgramResponsible, setProgram: setProgram, isLoadModel: !!formik.values.model, tagsOptions: tags, peopleOptions: persons, dictTag: dictTag, dictPeople: dictPeople, handleClose: onClose, refetchProgram: refetchProgram })) : (React.createElement(React.Fragment, null,
            React.createElement(BoxCloseIcon, null,
                React.createElement(IconButton, { onClick: onClose },
                    React.createElement(Close, null))),
            React.createElement(Box, null,
                React.createElement(Box, { marginTop: '8%' }, option === OPTION_LOAD ? (React.createElement(React.Fragment, null,
                    React.createElement(IconButton, { "aria-label": 'close', onClick: () => handleSetOption(''), style: { position: 'absolute', left: 8, top: 8 } },
                        React.createElement(ArrowBack, null)),
                    React.createElement(LoadModel, { context: context, isModel: isModel, values: formik.values, errors: formik.errors, setFieldValue: formik.setFieldValue, handleNext: handleCreate }))) : (React.createElement(React.Fragment, null,
                    React.createElement(Box, { display: 'flex', justifyContent: 'space-between', padding: '2rem' },
                        React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold' } }, "Escolha uma op\u00E7\u00E3o"),
                        React.createElement(BoxCloseIcon, null,
                            React.createElement(IconButton, { onClick: onClose },
                                React.createElement(Close, null)))),
                    renderOptions())))))))));
};
export default AddProgram;
//# sourceMappingURL=index.js.map