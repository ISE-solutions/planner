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
import * as _ from 'lodash';
import * as yup from 'yup';
import { AddOutlined, Close, FileCopyOutlined } from '@material-ui/icons';
import { BoxCloseIcon, OptionCard, StyledCardActionArea } from './styles';
import LoadModel from './LoadModel';
import { PREFIX } from '~/config/database';
import { useLoggedUser } from '~/hooks';
import { useFormik } from 'formik';
import * as moment from 'moment';
import formatActivityModel from '~/utils/formatActivityModel';
import { useSelector } from 'react-redux';
import { ActivityForm } from '~/components';
import { EActivityTypeApplication, EGroups } from '~/config/enums';
const OPTION_FORM = 'form';
const OPTION_LOAD_ACTIVITY = 'load_activity';
const OPTION_LOAD_MODEL = 'load_model';
const AddActivity = ({ open, handleSaveActivity, handleClose, }) => {
    const [option, setOption] = React.useState('');
    const { currentUser } = useLoggedUser();
    const { tag, space, person } = useSelector((state) => state);
    const { dictTag } = tag;
    const { dictSpace } = space;
    const { dictPeople } = person;
    const onClose = () => {
        handleClose();
        setOption('');
        formik.resetForm();
    };
    const validationSchema = yup.object({
        model: yup.mixed().required('Campo Obrigatório'),
    });
    const myGroup = () => {
        if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) {
            return EGroups.PLANEJAMENTO;
        }
        if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isAdmission) {
            return EGroups.ADMISSOES;
        }
        return '';
    };
    const formik = useFormik({
        initialValues: {
            startDate: null,
            model: null,
        },
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        validationSchema: validationSchema,
        onSubmit: (values) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            let actv = _.cloneDeep(values.model);
            (_a = actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_NomeAtividade`]) === null || _a === void 0 ? void 0 : _a.map((item) => {
                delete item[`${PREFIX}nomeatividadeid`];
                return item;
            });
            (_b = actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _b === void 0 ? void 0 : _b.map((item) => {
                delete item[`${PREFIX}pessoasenvolvidasatividadeid`];
                return item;
            });
            (_c = actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_Documento`]) === null || _c === void 0 ? void 0 : _c.map((item) => {
                delete item[`${PREFIX}documentosatividadeid`];
                return item;
            });
            delete actv[`${PREFIX}atividadeid`];
            let model = Object.assign(Object.assign({}, actv), { [`${PREFIX}atividadeid`]: null, [`${PREFIX}tipoaplicacao`]: EActivityTypeApplication.MODELO_REFERENCIA, user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], group: myGroup() });
            formik.setFieldValue('model', model);
            setOption(OPTION_FORM);
        }),
    });
    const renderOptions = () => (React.createElement(React.Fragment, null,
        React.createElement(Box, { padding: '2rem', minWidth: '30rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', style: { gap: '1rem' } },
            React.createElement(OptionCard, { elevation: 3 },
                React.createElement(StyledCardActionArea, { onClick: () => setOption(OPTION_LOAD_ACTIVITY) },
                    React.createElement(AddOutlined, { color: 'primary', style: { fontSize: '3rem' } }),
                    React.createElement(Typography, { color: 'primary', variant: 'body1' }, "Criar"))),
            React.createElement(OptionCard, { elevation: 3 },
                React.createElement(StyledCardActionArea, { onClick: () => setOption(OPTION_LOAD_MODEL) },
                    React.createElement(FileCopyOutlined, { color: 'primary', style: { fontSize: '3rem' } }),
                    React.createElement(Typography, { color: 'primary', variant: 'body1' }, "Usar modelo"))))));
    const handleSave = (actv) => {
        handleSaveActivity(Object.assign({ title: actv.title }, formatActivityModel(actv, moment('2006-01-01', 'YYYY-MM-DD'), {
            isModel: true,
            dictPeople: dictPeople,
            dictSpace: dictSpace,
            dictTag: dictTag,
        })), onClose);
    };
    return (React.createElement(SwipeableDrawer, { anchor: 'right', open: open, onClose: onClose, onOpen: () => null, disableBackdropClick: true }, option === OPTION_FORM ? (React.createElement(ActivityForm, { isModel: true, isDrawer: true, isModelReference: true, handleClose: onClose, activity: formik.values.model, onSave: handleSave })) : (React.createElement(React.Fragment, null,
        React.createElement(BoxCloseIcon, null,
            React.createElement(IconButton, { onClick: onClose },
                React.createElement(Close, null))),
        React.createElement(Box, null,
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', padding: '2rem' },
                React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold' } }, "Escolha uma op\u00E7\u00E3o"),
                React.createElement(BoxCloseIcon, null,
                    React.createElement(IconButton, { onClick: onClose },
                        React.createElement(Close, null)))),
            React.createElement(Box, { marginTop: '20%' },
                renderOptions(),
                (option === OPTION_LOAD_ACTIVITY ||
                    option === OPTION_LOAD_MODEL) && (React.createElement(LoadModel, { values: formik.values, errors: formik.errors, typeLoad: 
                    // @ts-ignore
                    option === OPTION_LOAD_ACTIVITY
                        ? EActivityTypeApplication.PLANEJAMENTO
                        : EActivityTypeApplication.MODELO_REFERENCIA, setFieldValue: formik.setFieldValue, handleNext: formik.handleSubmit }))))))));
};
export default AddActivity;
//# sourceMappingURL=index.js.map