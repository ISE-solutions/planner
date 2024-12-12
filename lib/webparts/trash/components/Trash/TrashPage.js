import * as React from 'react';
import Page from '~/components/Page';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Filter from './Filter';
import { Box, Button, CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { ENTITIES } from './constants';
import { getTags, updateTag } from '~/store/modules/tag/actions';
import { COLUMNS_ENTITY, formatRows } from './util';
import { Table } from '~/components';
import { PREFIX } from '~/config/database';
import { useConfirmation, useNotification } from '~/hooks';
import { getPeople, updatePerson } from '~/store/modules/person/actions';
import { getSpaces, updateSpace } from '~/store/modules/space/actions';
import { getActivities, updateActivity, } from '~/store/modules/activity/actions';
import { EActivityTypeApplication, TYPE_ACTIVITY, TYPE_RESOURCE, } from '~/config/enums';
import { getFiniteInfiniteResources, updateResource, } from '~/store/modules/finiteInfiniteResource/actions';
import { getPrograms, updateProgram } from '~/store/modules/program/actions';
import { getTeams, updateTeam } from '~/store/modules/team/actions';
import { getSchedules, updateSchedule } from '~/store/modules/schedule/actions';
import { BackdropStyled } from '~/webparts/program/components/ProgramPage/components/DetailTeam/styles';
import { addOrUpdateByActivities } from '~/store/modules/resource/actions';
import { TypeBlockUpdated } from '~/config/constants';
const TYPE_ENTITY = {
    [ENTITIES.ACADEMIC_ACTIVITY]: TYPE_ACTIVITY.ACADEMICA,
    [ENTITIES.NON_ACADEMIC_ACTIVITY]: TYPE_ACTIVITY.NON_ACADEMICA,
    [ENTITIES.INTERNAL_ACTIVITY]: TYPE_ACTIVITY.INTERNAL,
};
const TYPE_APPLICATION_ENTITY = {
    [ENTITIES.ACADEMIC_ACTIVITY]: [EActivityTypeApplication.PLANEJAMENTO],
    [ENTITIES.NON_ACADEMIC_ACTIVITY]: [EActivityTypeApplication.PLANEJAMENTO],
    [ENTITIES.INTERNAL_ACTIVITY]: [EActivityTypeApplication.PLANEJAMENTO],
    [ENTITIES.ACTIVITY]: [EActivityTypeApplication.APLICACAO],
    [ENTITIES.ACTIVITY_MODEL]: [
        EActivityTypeApplication.MODELO,
        EActivityTypeApplication.MODELO_REFERENCIA,
    ],
};
const TrashPage = ({ context }) => {
    var _a, _b, _c, _d, _e, _f;
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [loadingRestore, setLoadingRestore] = React.useState(false);
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const { tag, environmentReference } = useSelector((state) => state);
    const { dictTag } = tag;
    const { references } = environmentReference;
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: { entity: null, startDeleted: null, endDeleted: null },
        validationSchema: yup.object({
            entity: yup.mixed().required('Campo Obrigatório'),
        }),
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        onSubmit: () => {
            refetch();
        },
    });
    React.useEffect(() => {
        setData([]);
    }, [(_a = formik === null || formik === void 0 ? void 0 : formik.values) === null || _a === void 0 ? void 0 : _a.entity]);
    const onFetchResult = (val) => {
        setData(val);
        setLoading(false);
    };
    const refetch = () => {
        var _a, _b;
        setLoading(true);
        const entity = (_b = (_a = formik.values) === null || _a === void 0 ? void 0 : _a.entity) === null || _b === void 0 ? void 0 : _b.value;
        switch (entity) {
            case ENTITIES.TAG:
                getTags({
                    deleted: true,
                    startDeleted: formik.values.startDeleted,
                    endDeleted: formik.values.endDeleted,
                }).then(onFetchResult);
                break;
            case ENTITIES.PERSON:
                getPeople({
                    deleted: true,
                    startDeleted: formik.values.startDeleted,
                    endDeleted: formik.values.endDeleted,
                }).then(onFetchResult);
                break;
            case ENTITIES.SPACE:
                getSpaces({
                    deleted: true,
                    startDeleted: formik.values.startDeleted,
                    endDeleted: formik.values.endDeleted,
                }).then(onFetchResult);
                break;
            case ENTITIES.FINITE_RESOURCES:
                getFiniteInfiniteResources({
                    deleted: true,
                    typeResource: TYPE_RESOURCE.FINITO,
                    startDeleted: formik.values.startDeleted,
                    endDeleted: formik.values.endDeleted,
                }).then(onFetchResult);
                break;
            case ENTITIES.INFINITE_RESOURCES:
                getFiniteInfiniteResources({
                    deleted: true,
                    typeResource: TYPE_RESOURCE.INFINITO,
                    startDeleted: formik.values.startDeleted,
                    endDeleted: formik.values.endDeleted,
                }).then(onFetchResult);
                break;
            case ENTITIES.ACADEMIC_ACTIVITY:
            case ENTITIES.NON_ACADEMIC_ACTIVITY:
            case ENTITIES.INTERNAL_ACTIVITY:
            case ENTITIES.ACTIVITY:
            case ENTITIES.ACTIVITY_MODEL:
                getActivities({
                    deleted: true,
                    typeActivity: TYPE_ENTITY[entity],
                    typesApplication: TYPE_APPLICATION_ENTITY[entity],
                    startDeleted: formik.values.startDeleted,
                    endDeleted: formik.values.endDeleted,
                }).then(onFetchResult);
                break;
            case ENTITIES.PROGRAM:
            case ENTITIES.PROGRAM_MODEL:
                getPrograms({
                    deleted: true,
                    model: entity === ENTITIES.PROGRAM_MODEL,
                    startDeleted: formik.values.startDeleted,
                    endDeleted: formik.values.endDeleted,
                }).then(onFetchResult);
                break;
            case ENTITIES.TEAM:
            case ENTITIES.TEAM_MODEL:
                getTeams({
                    deleted: true,
                    programDeleted: false,
                    model: entity === ENTITIES.TEAM_MODEL,
                    startDeleted: formik.values.startDeleted,
                    endDeleted: formik.values.endDeleted,
                }).then(onFetchResult);
                break;
            case ENTITIES.SCHEDULE:
            case ENTITIES.SCHEDULE_MODEL:
                getSchedules({
                    deleted: true,
                    teamDeleted: false,
                    model: entity === ENTITIES.SCHEDULE_MODEL,
                    startDeleted: formik.values.startDeleted,
                    endDeleted: formik.values.endDeleted,
                }).then(onFetchResult);
                break;
        }
    };
    const handleSuccess = () => {
        refetch();
        setLoadingRestore(false);
        notification.success({
            title: 'Sucesso',
            description: 'Restaurado com sucesso',
        });
    };
    const handleError = () => {
        setLoadingRestore(false);
        notification.error({
            title: 'Falha',
            description: 'Ocorreu um erro, tente novamente mais tarde',
        });
    };
    const handleRecovery = (item) => {
        var _a, _b;
        setLoadingRestore(true);
        switch ((_b = (_a = formik === null || formik === void 0 ? void 0 : formik.values) === null || _a === void 0 ? void 0 : _a.entity) === null || _b === void 0 ? void 0 : _b.value) {
            case ENTITIES.TAG:
                dispatch(updateTag(item === null || item === void 0 ? void 0 : item[`${PREFIX}etiquetaid`], {
                    [`${PREFIX}excluido`]: false,
                    [`${PREFIX}ativo`]: true,
                }, {
                    onSuccess: handleSuccess,
                    onError: handleError,
                }));
                // getTagByName(formik?.values?.entity?.label).then(({ value }) => {
                //   if (!value.length) {
                //   } else {
                //     setLoadingRestore(false);
                //     notification.error({
                //       title: 'Etiqueta já existente',
                //       description: 'A etiqueta a ser restaurada já se encontra ativa',
                //     });
                //   }
                // });
                break;
            case ENTITIES.SPACE:
                dispatch(updateSpace(item === null || item === void 0 ? void 0 : item[`${PREFIX}espacoid`], {
                    [`${PREFIX}excluido`]: false,
                    [`${PREFIX}ativo`]: true,
                }, {
                    onSuccess: handleSuccess,
                    onError: handleError,
                }));
                break;
            case ENTITIES.PERSON:
                dispatch(updatePerson(item === null || item === void 0 ? void 0 : item[`${PREFIX}pessoaid`], {
                    [`${PREFIX}excluido`]: false,
                    [`${PREFIX}ativo`]: true,
                }, {
                    onSuccess: handleSuccess,
                    onError: handleError,
                }));
                break;
            case ENTITIES.FINITE_RESOURCES:
            case ENTITIES.INFINITE_RESOURCES:
                dispatch(updateResource(item === null || item === void 0 ? void 0 : item[`${PREFIX}recursofinitoinfinitoid`], {
                    [`${PREFIX}excluido`]: false,
                    [`${PREFIX}ativo`]: true,
                }, {
                    onSuccess: handleSuccess,
                    onError: handleError,
                }));
                break;
            case ENTITIES.ACADEMIC_ACTIVITY:
            case ENTITIES.NON_ACADEMIC_ACTIVITY:
            case ENTITIES.INTERNAL_ACTIVITY:
                updateActivity(item === null || item === void 0 ? void 0 : item[`${PREFIX}atividadeid`], {
                    [`${PREFIX}excluido`]: false,
                    [`${PREFIX}ativo`]: true,
                }, {
                    onSuccess: handleSuccess,
                    onError: handleError,
                });
                break;
            case ENTITIES.ACTIVITY:
            case ENTITIES.ACTIVITY_MODEL:
                const sch = item === null || item === void 0 ? void 0 : item[`${PREFIX}CronogramadeDia_Atividade`][0];
                if (sch && (sch === null || sch === void 0 ? void 0 : sch[`${PREFIX}excluido`])) {
                    setLoadingRestore(false);
                    notification.error({
                        title: 'Dia de aula',
                        description: 'O dia de aula desta atividade não se encontra ativo!',
                    });
                    return;
                }
                updateActivity(item === null || item === void 0 ? void 0 : item[`${PREFIX}atividadeid`], {
                    [`${PREFIX}excluido`]: false,
                    [`${PREFIX}ativo`]: true,
                }, {
                    onSuccess: () => {
                        addOrUpdateByActivities([item], { references, dictTag }, { activityId: item === null || item === void 0 ? void 0 : item[`${PREFIX}atividadeid`] }, {
                            type: TypeBlockUpdated.Atividade,
                            id: item === null || item === void 0 ? void 0 : item[`${PREFIX}atividadeid`],
                        });
                        handleSuccess();
                    },
                    onError: handleError,
                });
                break;
            case ENTITIES.PROGRAM:
            case ENTITIES.PROGRAM_MODEL:
                updateProgram(item === null || item === void 0 ? void 0 : item[`${PREFIX}programaid`], {
                    [`${PREFIX}excluido`]: false,
                    [`${PREFIX}ativo`]: true,
                }, {
                    onSuccess: handleSuccess,
                    onError: handleError,
                });
                break;
            case ENTITIES.TEAM:
            case ENTITIES.TEAM_MODEL:
                const pr = item === null || item === void 0 ? void 0 : item[`${PREFIX}Programa`];
                if (pr && (pr === null || pr === void 0 ? void 0 : pr[`${PREFIX}excluido`])) {
                    setLoadingRestore(false);
                    notification.error({
                        title: 'Programa',
                        description: 'O programa desta turma não se encontra ativo!',
                    });
                    return;
                }
                updateTeam(item === null || item === void 0 ? void 0 : item[`${PREFIX}turmaid`], {
                    [`${PREFIX}excluido`]: false,
                    [`${PREFIX}ativo`]: true,
                }, {
                    onSuccess: handleSuccess,
                    onError: handleError,
                });
                break;
            case ENTITIES.SCHEDULE:
            case ENTITIES.SCHEDULE_MODEL:
                const te = item === null || item === void 0 ? void 0 : item[`${PREFIX}Turma`];
                if (te && (te === null || te === void 0 ? void 0 : te[`${PREFIX}excluido`])) {
                    setLoadingRestore(false);
                    notification.error({
                        title: 'Turma',
                        description: 'A turma deste dia de aula não se encontra ativa!',
                    });
                    return;
                }
                dispatch(updateSchedule(item === null || item === void 0 ? void 0 : item[`${PREFIX}cronogramadediaid`], {
                    [`${PREFIX}excluido`]: false,
                    [`${PREFIX}ativo`]: true,
                }, {
                    onSuccess: handleSuccess,
                    onError: handleError,
                }));
                break;
            default:
                return [];
        }
    };
    const handleConfirmRecovery = (item) => {
        confirmation.openConfirmation({
            title: 'Deseja relmente recuperar o item?',
            description: item === null || item === void 0 ? void 0 : item[`${PREFIX}nome`],
            onConfirm: () => handleRecovery(item),
        });
    };
    const rows = React.useMemo(() => formatRows(data, { handleRecovery: handleConfirmRecovery }) || [], [data, (_c = (_b = formik === null || formik === void 0 ? void 0 : formik.values) === null || _b === void 0 ? void 0 : _b.entity) === null || _c === void 0 ? void 0 : _c.value]);
    const tableOptions = {
        enableNestedDataAccess: '.',
        responsive: 'vertical',
        selectableRows: 'none',
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(BackdropStyled, { open: loadingRestore },
            React.createElement(CircularProgress, { color: 'inherit' })),
        React.createElement(Page, { context: context, blockOverflow: false, itemsBreadcrumbs: [
                { name: 'Planejamento', page: 'Pessoa' },
                { name: 'Lixeira', page: 'Lixeira' },
            ] },
            React.createElement(Filter, { formik: formik }),
            React.createElement(Box, { width: '100%', display: 'flex', marginTop: '1rem', marginBottom: '2rem', justifyContent: 'flex-end', style: { gap: '10px' } },
                React.createElement(Button, { onClick: () => formik.handleReset({}), color: 'primary' }, "Limpar"),
                React.createElement(Button, { onClick: () => formik.handleSubmit(), variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Pesquisar'))),
            ((_d = formik === null || formik === void 0 ? void 0 : formik.values) === null || _d === void 0 ? void 0 : _d.entity) ? (React.createElement(Table, { columns: (COLUMNS_ENTITY === null || COLUMNS_ENTITY === void 0 ? void 0 : COLUMNS_ENTITY[(_f = (_e = formik === null || formik === void 0 ? void 0 : formik.values) === null || _e === void 0 ? void 0 : _e.entity) === null || _f === void 0 ? void 0 : _f.value]) || [], data: rows, options: tableOptions })) : null)));
};
export default TrashPage;
//# sourceMappingURL=TrashPage.js.map