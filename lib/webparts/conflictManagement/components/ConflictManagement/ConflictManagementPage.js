import * as React from 'react';
import * as yup from 'yup';
import { AccordionVerticalRight, ActivityForm, Backdrop, Page, } from '~/components';
import AccordionVertical from '~/components/AccordionVertical';
import Timeline from './../Timeline';
import Filter from './../Filter';
import { useFormik } from 'formik';
import * as moment from 'moment';
import { useNotification, useResource } from '~/hooks';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import { PREFIX } from '~/config/database';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { getActivity, updateActivityAll, } from '~/store/modules/activity/actions';
import { TitleInfo } from './styles';
const ConflictManagement = ({ context }) => {
    const validationSchema = yup.object({
        startDate: yup.mixed().required('Campo Obrigatório'),
        endDate: yup.mixed().required('Campo Obrigatório'),
    });
    const [groups, setGroups] = React.useState([]);
    const [searchClicked, setSearchClicked] = React.useState(false);
    const [loadingActivity, setLoadingActivity] = React.useState(false);
    const [loadingSave, setLoadingSave] = React.useState(false);
    const [openEditArea, setOpenEditArea] = React.useState(false);
    const [activity, setActivity] = React.useState(null);
    const dispatch = useDispatch();
    const { notification } = useNotification();
    const { space, person, tag } = useSelector((state) => state);
    const { tags, dictTag } = tag;
    const { spaces } = space;
    const { persons } = person;
    React.useEffect(() => {
        dispatch(fetchAllSpace({ active: 'Ativo' }));
    }, []);
    const spacesGroup = React.useMemo(() => {
        var _a;
        return (_a = spaces === null || spaces === void 0 ? void 0 : spaces.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) === null || _a === void 0 ? void 0 : _a.map((space) => (Object.assign(Object.assign({}, space), { id: space === null || space === void 0 ? void 0 : space[`${PREFIX}espacoid`], name: space === null || space === void 0 ? void 0 : space[`${PREFIX}nome`], title: space === null || space === void 0 ? void 0 : space[`${PREFIX}nome`] })));
    }, [spaces]);
    const personsGroup = React.useMemo(() => {
        var _a;
        return (_a = persons === null || persons === void 0 ? void 0 : persons.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) === null || _a === void 0 ? void 0 : _a.map((per) => (Object.assign(Object.assign({}, per), { id: per === null || per === void 0 ? void 0 : per[`${PREFIX}pessoaid`], name: per === null || per === void 0 ? void 0 : per[`${PREFIX}nomecompleto`], title: per === null || per === void 0 ? void 0 : per[`${PREFIX}nomecompleto`] })));
    }, [persons]);
    const formik = useFormik({
        initialValues: {
            startDate: moment().startOf('month').utc(),
            endDate: moment().endOf('day').utc(),
            typeResource: 'Pessoa',
            tagsFilter: [],
            people: [],
            spaces: [],
            availability: '',
        },
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (!searchClicked) {
                setSearchClicked(true);
            }
            if (values.typeResource === 'Pessoa') {
                if (values.people.length) {
                    setGroups(values.people);
                }
                else {
                    setGroups(personsGroup);
                }
            }
            if (values.typeResource === 'Espaço') {
                if (values.spaces.length) {
                    setGroups(values.spaces);
                }
                else {
                    setGroups(spacesGroup);
                }
            }
            refetch();
        },
    });
    const [{ resources, loading, refetch }] = useResource({
        startDate: formik.values.startDate,
        endDate: formik.values.endDate,
    });
    const handleActivity = (activityId) => {
        setLoadingActivity(true);
        setOpenEditArea(!openEditArea);
        getActivity(activityId).then((actv) => {
            var _a;
            setLoadingActivity(false);
            setActivity((_a = actv === null || actv === void 0 ? void 0 : actv.value) === null || _a === void 0 ? void 0 : _a[0]);
        });
    };
    const handleSaveActivity = (item, onSuccess) => {
        var _a, _b, _c;
        setLoadingSave(true);
        const spacesToDelete = (_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_Espaco`]) === null || _a === void 0 ? void 0 : _a.filter((e) => { var _a; return !((_a = item.spaces) === null || _a === void 0 ? void 0 : _a.some((sp) => sp.value === e[`${PREFIX}espacoid`])); });
        const equipmentsToDelete = (_b = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_Equipamentos`]) === null || _b === void 0 ? void 0 : _b.filter((e) => { var _a; return !((_a = item.equipments) === null || _a === void 0 ? void 0 : _a.some((sp) => sp.value === e[`${PREFIX}etiquetaid`])); });
        const finiteInfiniteResourceToDelete = (_c = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_RecursoFinitoInfinito`]) === null || _c === void 0 ? void 0 : _c.filter((e) => {
            var _a, _b;
            return !((_a = item.finiteResource) === null || _a === void 0 ? void 0 : _a.some((sp) => (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}recursofinitoinfinitoid`]) ===
                e[`${PREFIX}recursofinitoinfinitoid`])) &&
                !((_b = item.infiniteResource) === null || _b === void 0 ? void 0 : _b.some((sp) => (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}recursofinitoinfinitoid`]) ===
                    e[`${PREFIX}recursofinitoinfinitoid`]));
        });
        dispatch(updateActivityAll(Object.assign(Object.assign({}, item), { spacesToDelete: spacesToDelete, equipmentsToDelete: equipmentsToDelete, finiteInfiniteResourceToDelete: finiteInfiniteResourceToDelete }), {
            onSuccess: () => {
                refetch();
                setLoadingSave(false);
                notification.success({
                    title: 'Sucesso',
                    description: 'Atualização realizada com sucesso',
                });
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            },
            onError: (error) => {
                var _a, _b;
                setLoadingSave(false);
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        }));
    };
    const headActivityInfo = () => {
        var _a, _b, _c, _d;
        return (React.createElement(Box, { paddingLeft: '.5rem', style: { gap: '10px' } },
            React.createElement(Box, { display: 'flex' },
                React.createElement(TitleInfo, null, "Programa: "),
                React.createElement(Typography, null, (_b = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Programa`]) === null || _a === void 0 ? void 0 : _a[`_${PREFIX}nomeprograma_value`]]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`])),
            React.createElement(Box, { display: 'flex' },
                React.createElement(TitleInfo, null, "Turma: "),
                React.createElement(Typography, null, (_c = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Turma`]) === null || _c === void 0 ? void 0 :
                    _c[`${PREFIX}sigla`],
                    " -",
                    ' ', (_d = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Turma`]) === null || _d === void 0 ? void 0 :
                    _d[`${PREFIX}nome`])),
            React.createElement(Box, { display: 'flex' },
                React.createElement(TitleInfo, null, "Data: "),
                React.createElement(Typography, null, moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY')))));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Backdrop, { open: loadingSave },
            React.createElement(CircularProgress, { color: 'inherit' })),
        React.createElement(Page, { blockOverflow: false, context: context, itemsBreadcrumbs: [
                { name: 'Gestão de Conflitos', page: 'Gestão de Conflitos' },
            ] },
            React.createElement(AccordionVertical, { defaultExpanded: true, title: 'Filtro', width: 300, widthClosed: '40px', expansibleColumn: React.createElement(Filter, { tags: tags, loading: false, values: formik.values, errors: formik.errors, persons: personsGroup, spaces: spacesGroup, setFieldValue: formik.setFieldValue, handleFilter: formik.handleSubmit }) }, searchClicked ? (React.createElement(AccordionVerticalRight, { title: 'Atividade', width: 580, defaultExpanded: openEditArea, expansibleColumn: React.createElement(React.Fragment, null, loadingActivity ? (React.createElement(Box, { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                    React.createElement(CircularProgress, { color: 'primary' }))) : (React.createElement(ActivityForm, { noPadding: true, forceUpdate: true, headerInfo: headActivityInfo(), maxHeight: '70%', activity: activity, onSave: handleSaveActivity }))) },
                React.createElement(Box, { marginRight: '1rem' },
                    React.createElement(Timeline, { groups: groups, resources: resources, loading: loading, refetch: refetch, handleActivity: handleActivity, typeResource: formik.values.typeResource, filter: formik.values, setFieldValue: formik.setFieldValue, handleFilter: formik.handleSubmit })))) : null))));
};
export default ConflictManagement;
//# sourceMappingURL=ConflictManagementPage.js.map