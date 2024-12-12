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
import { useLoggedUser, useNotification } from '~/hooks';
import AccordionVertical from '~/components/AccordionVertical';
import ListModels from './components/ListModels';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import { FaSchool } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllActivities, getActivity, updateActivity, updateActivityAll, } from '~/store/modules/activity/actions';
import { EActivityTypeApplication, EGroups } from '~/config/enums';
import { ActivityForm, Backdrop } from '~/components';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { PREFIX } from '~/config/database';
import { fetchAllFiniteInfiniteResources } from '~/store/modules/finiteInfiniteResource/actions';
const ActivityModelPage = ({ context }) => {
    const [activityChoosed, setActivityChoosed] = React.useState();
    const [search, setSearch] = React.useState('');
    const [loadingSave, setLoadingSave] = React.useState(false);
    const [filter, setFilter] = React.useState({
        searchQuery: search,
        active: 'Ativo',
        typeApplication: EActivityTypeApplication.MODELO_REFERENCIA,
    });
    const { loading, activities } = useSelector((state) => state.activity);
    const { notification } = useNotification();
    const dispatch = useDispatch();
    const queryParameters = new URLSearchParams(window.location.search);
    const modelIdParam = queryParameters.get('modelid');
    const { currentUser } = useLoggedUser();
    const refetch = (ftr) => {
        dispatch(fetchAllActivities(ftr || filter));
    };
    React.useEffect(() => {
        if (modelIdParam) {
            getActivity(modelIdParam).then(({ value }) => setActivityChoosed(value[0]));
        }
    }, [modelIdParam]);
    React.useEffect(() => {
        refetch();
    }, [filter]);
    React.useEffect(() => {
        refetch();
        dispatch(fetchAllSpace({}));
        dispatch(fetchAllFiniteInfiniteResources({}));
    }, []);
    const myGroup = () => {
        if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) {
            return EGroups.PLANEJAMENTO;
        }
        if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isAdmission) {
            return EGroups.ADMISSOES;
        }
        return '';
    };
    const handleSuccess = () => {
        refetch();
        setLoadingSave(false);
        notification.success({
            title: 'Sucesso',
            description: 'Atualização realizada com sucesso',
        });
    };
    const handleError = (error) => {
        var _a, _b;
        setLoadingSave(false);
        notification.error({
            title: 'Falha',
            description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
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
        dispatch(updateActivityAll(Object.assign(Object.assign({}, item), { typeApplication: EActivityTypeApplication.MODELO_REFERENCIA, user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], group: myGroup(), spacesToDelete: spacesToDelete, equipmentsToDelete: equipmentsToDelete, finiteInfiniteResourceToDelete: finiteInfiniteResourceToDelete }), {
            onSuccess: () => {
                handleSuccess === null || handleSuccess === void 0 ? void 0 : handleSuccess();
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                refetch === null || refetch === void 0 ? void 0 : refetch();
            },
            onError: handleError,
        }));
    };
    const handleChangeActivity = (actv) => __awaiter(void 0, void 0, void 0, function* () {
        if (activityChoosed) {
            yield updateActivity(activityChoosed === null || activityChoosed === void 0 ? void 0 : activityChoosed[`${PREFIX}atividadeid`], {
                [`${PREFIX}Editanto@odata.bind`]: null,
                [`${PREFIX}datahoraeditanto`]: null,
            }, {
                onSuccess: () => null,
                onError: () => null,
            });
        }
        setActivityChoosed(actv);
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(Backdrop, { open: loadingSave },
            React.createElement(CircularProgress, { color: 'inherit' })),
        React.createElement(Page, { context: context, itemsBreadcrumbs: [
                { name: 'Modelos', page: 'Cronograma Modelo' },
                { name: 'Atividade', page: 'Modelo Atividades' },
            ] },
            React.createElement(AccordionVertical, { defaultExpanded: true, title: 'Modelos de Atividades', width: 260, expansibleColumn: React.createElement(ListModels, { loading: loading, currentUser: currentUser, models: activities, filter: filter, setFilter: setFilter, refetch: refetch, setSearch: setSearch, handleSaveActivity: handleSaveActivity, modelChoosed: activityChoosed, handleActivity: handleChangeActivity }) },
                React.createElement(Box, { display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }, activityChoosed ? (React.createElement(ActivityForm, { isModel: true, isModelReference: true, refetch: refetch, activity: activityChoosed, setActivity: setActivityChoosed, onSave: handleSaveActivity })) : (React.createElement(Box, { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                    React.createElement(FaSchool, { color: '#0063a5', size: '5rem' }),
                    React.createElement(Typography, { variant: 'h5', color: 'primary', style: { fontWeight: 'bold' } }, "Escolha um modelo"))))))));
};
export default ActivityModelPage;
//# sourceMappingURL=ActivityModelPage.js.map