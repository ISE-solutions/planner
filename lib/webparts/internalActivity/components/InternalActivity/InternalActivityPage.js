import * as React from 'react';
import Page from '~/components/Page';
import Table from '~/components/Table';
import CreateHeader from '~/components/CreateHeader';
import ModalDetail from './../ModalDetail';
import ModalBulkEdit from './../ModalBulkEdit';
import ModalDesactive from './../ModalDesactive';
import { Button, Grid, IconButton, Tooltip } from '@material-ui/core';
import { Add, Delete, Edit, FilterList, Info, Visibility, VisibilityOff, } from '@material-ui/icons';
import { useNotification, useLoggedUser, useConfirmation } from '~/hooks';
import { PREFIX } from '~/config/database';
import { EActivityTypeApplication, TYPE_ACTIVITY } from '~/config/enums';
import { AddActivityPlanning, DontHasPermition } from '~/components';
import { activeActivity, deleteActivity, fetchAllActivities, } from '~/store/modules/activity/actions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { fetchAllFiniteInfiniteResources } from '~/store/modules/finiteInfiniteResource/actions';
import { Utils as QbUtils } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import FilterDrawer from '~/components/FilterDrawer';
const InternalActivityPage = ({ context, }) => {
    const { currentUser } = useLoggedUser();
    const [form, setForm] = React.useState({ open: false });
    const [detail, setDetail] = React.useState({ open: false });
    const [bulkEdit, setBulkEdit] = React.useState({ open: false });
    const [activitySelected, setActivitySelected] = React.useState(null);
    const [desactive, setDesactive] = React.useState({ open: false });
    const [openFilter, setOpenFilter] = React.useState(false);
    const [listFiltered, setListFiltered] = React.useState([]);
    const { activity } = useSelector((state) => state);
    const { activities } = activity;
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const refTable = React.useRef();
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(fetchAllSpace({}));
        dispatch(fetchAllFiniteInfiniteResources({}));
        refetch();
    }, []);
    const config = React.useMemo(() => (Object.assign(Object.assign({}, FILTER_CONFIG_DEFAULT), { fields: {
            name: {
                label: 'Nome da Atividade',
                type: 'text',
            },
            [`${PREFIX}ativo`]: {
                label: 'Ativo',
                type: 'boolean',
            },
        } })), []);
    const [query, setQuery] = React.useState({
        // @ts-ignore
        tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config),
        config: config,
    });
    const columns = [
        {
            name: `${PREFIX}nome`,
            label: 'Nome da Atividade',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}temaaula`,
            label: 'Tema',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}duracao`,
            label: 'Duração',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}ativo`,
            label: 'Status',
            options: {
                filter: false,
                display: false,
                viewColumns: false,
            },
        },
        {
            name: 'actions',
            label: 'Ações',
            options: {
                filter: false,
                sort: false,
                setCellHeaderProps: () => ({ align: 'center' }),
                setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
            },
        },
    ];
    const data = React.useMemo(() => {
        const newActivities = activities === null || activities === void 0 ? void 0 : activities.map((academicActivity) => {
            var _a;
            return (Object.assign(Object.assign({}, academicActivity), { name: (_a = academicActivity === null || academicActivity === void 0 ? void 0 : academicActivity[`${PREFIX}nome`]) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase(), actions: (React.createElement(Grid, null,
                    React.createElement(Tooltip, { arrow: true, title: 'Detalhes' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleDetail(academicActivity) },
                            React.createElement(Info, null))),
                    React.createElement(Tooltip, { arrow: true, title: 'Editar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleEdit(academicActivity) },
                            React.createElement(Edit, null))),
                    (academicActivity === null || academicActivity === void 0 ? void 0 : academicActivity[`${PREFIX}ativo`]) ? (React.createElement(Tooltip, { arrow: true, title: 'Desativar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleDesactive(academicActivity) },
                            React.createElement(VisibilityOff, null)))) : (React.createElement(Tooltip, { arrow: true, title: 'Ativar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleActive(academicActivity) },
                            React.createElement(Visibility, null)))),
                    React.createElement(Tooltip, { arrow: true, title: 'Excluir' },
                        React.createElement(IconButton, { onClick: () => handleDelete(academicActivity) },
                            React.createElement(Delete, null))))) }));
        });
        setListFiltered(newActivities === null || newActivities === void 0 ? void 0 : newActivities.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]));
        return newActivities;
    }, [activities]);
    const refetch = () => {
        dispatch(fetchAllActivities({
            searchQuery: '',
            typeActivity: TYPE_ACTIVITY.INTERNAL,
            typeApplication: EActivityTypeApplication.PLANEJAMENTO,
        }));
    };
    const handleSuccess = () => {
        refetch();
        notification.success({
            title: 'Sucesso',
            description: 'Ativado com sucesso',
        });
    };
    const handleError = (error) => {
        var _a, _b;
        notification.error({
            title: 'Falha',
            description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
        });
    };
    const handleEdit = (item) => {
        setActivitySelected(item);
        setForm({
            open: true,
        });
    };
    const handleDesactive = (item) => {
        setDesactive({
            open: true,
            item,
        });
    };
    const handleActive = (item) => {
        activeActivity(item, { onSuccess: handleSuccess, onError: handleError });
    };
    const handleDetail = (item) => {
        setDetail({
            open: true,
            item,
        });
    };
    const handleDelete = (item) => {
        confirmation.openConfirmation({
            title: 'Deseja relmente excluir a Atividade?',
            description: item === null || item === void 0 ? void 0 : item[`${PREFIX}nome`],
            onConfirm: () => dispatch(deleteActivity({ id: item === null || item === void 0 ? void 0 : item[`${PREFIX}atividadeid`] }, {
                onSuccess: () => {
                    refetch();
                    notification.success({
                        title: 'Sucesso',
                        description: 'Excluído com sucesso',
                    });
                },
                onError: handleError,
            })),
        });
    };
    const setRowProps = (row) => {
        if (!row[3]) {
            return {
                style: { background: '#f09b95' },
            };
        }
    };
    const customToolbar = () => (React.createElement(Tooltip, { disableFocusListener: true, arrow: true, title: 'Filtro' },
        React.createElement(IconButton, { onClick: () => setOpenFilter(true) },
            React.createElement(FilterList, null))));
    const clearFilter = () => {
        setQuery(Object.assign(Object.assign({}, query), { tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config) }));
    };
    const applyFilter = () => {
        const logic = QbUtils.jsonLogicFormat(query.tree, config).logic;
        if (logic) {
            const filteredData = data.filter((item) => jsonLogic.apply(logic, item));
            setListFiltered(filteredData);
        }
        else {
            setListFiltered(data);
        }
        setOpenFilter(false);
    };
    const tableOptions = {
        enableNestedDataAccess: '.',
        tableBodyHeight: 'calc(100vh - 470px)',
        selectableRows: 'none',
        download: false,
        print: false,
        filter: false,
        setRowProps,
        customToolbar,
    };
    if (!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning)) {
        return (React.createElement(Page, { context: context, itemsBreadcrumbs: [
                { name: 'Planejamento', page: 'Pessoa' },
                { name: 'Atividade Interna', page: 'Atividade Interna' },
            ] },
            React.createElement(DontHasPermition, null)));
    }
    return (React.createElement(Page, { context: context, itemsBreadcrumbs: [
            { name: 'Planejamento', page: 'Pessoa' },
            { name: 'Atividade Interna', page: 'Atividade Interna' },
        ] },
        React.createElement(CreateHeader, { title: 'Atividade Interna', action: React.createElement(Button, { onClick: () => setForm({ open: true }), variant: 'contained', color: 'primary', startIcon: React.createElement(Add, null) }, "Adicionar Atividade Interna") }),
        React.createElement(FilterDrawer, { open: openFilter, queryQB: query, clearFilter: clearFilter, configQB: config, setQuery: setQuery, applyFilter: applyFilter, onClose: () => setOpenFilter(false) }),
        React.createElement(Table, { refTable: refTable, columns: columns, data: listFiltered, options: tableOptions }),
        React.createElement(ModalDetail, { open: detail.open, item: detail.item, onClose: () => setDetail({ open: false }) }),
        React.createElement(ModalBulkEdit, { open: bulkEdit.open, academicActivities: bulkEdit.items, notification: notification, handleClose: () => setBulkEdit({ open: false }) }),
        React.createElement(ModalDesactive, { open: desactive.open, academicActivity: desactive.item, notification: notification, handleClose: () => {
                refetch();
                setDesactive({ open: false });
            } }),
        React.createElement(AddActivityPlanning, { open: form.open, activityType: TYPE_ACTIVITY.INTERNAL, activity: activitySelected, handleEdit: (it) => setActivitySelected(it), refetch: refetch, handleClose: () => {
                setForm({ open: false });
                setActivitySelected(null);
            } })));
};
export default InternalActivityPage;
//# sourceMappingURL=InternalActivityPage.js.map