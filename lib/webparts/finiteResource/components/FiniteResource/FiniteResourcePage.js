import * as React from 'react';
import Page from '~/components/Page';
import Table from '~/components/Table';
import CreateHeader from '~/components/CreateHeader';
import AddFiniteInfiniteResource from '../../../../components/AddFiniteInfiniteResource/index';
import ModalDetail from './../ModalDetail';
import ModalBulkEdit from './../ModalBulkEdit';
import ModalDesactive from './../ModalDesactive';
import { Button, Grid, IconButton, Tooltip } from '@material-ui/core';
import { Add, Delete, Edit, FilterList, Info, Visibility, VisibilityOff, } from '@material-ui/icons';
import { useConfirmation, useLoggedUser, useNotification } from '~/hooks';
import { PREFIX } from '~/config/database';
import { EFatherTag, TYPE_RESOURCE } from '~/config/enums';
import { DontHasPermition } from '~/components';
import { useDispatch, useSelector } from 'react-redux';
import { Utils as QbUtils } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import { activeFiniteInfiniteResource, deleteResource, fetchAllFiniteInfiniteResources, } from '~/store/modules/finiteInfiniteResource/actions';
import FilterDrawer from '~/components/FilterDrawer';
const FiniteResourcePage = ({ context, }) => {
    const [showActive, setShowActive] = React.useState('Ativo');
    const [form, setForm] = React.useState({ open: false });
    const [detail, setDetail] = React.useState({ open: false });
    const [bulkEdit, setBulkEdit] = React.useState({ open: false });
    const [desactive, setDesactive] = React.useState({ open: false });
    const [openFilter, setOpenFilter] = React.useState(false);
    const [listFiltered, setListFiltered] = React.useState([]);
    const dispatch = useDispatch();
    const { currentUser } = useLoggedUser();
    const { tag, finiteInfiniteResource } = useSelector((state) => state);
    const { allFiniteInfiniteResources } = finiteInfiniteResource;
    const { tagsActive: tags } = tag;
    const refTable = React.useRef();
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const tagOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.RECURSO_FINITOS);
    }), [tags]);
    const config = React.useMemo(() => (Object.assign(Object.assign({}, FILTER_CONFIG_DEFAULT), { fields: {
            name: {
                label: 'Nome',
                type: 'text',
            },
            [`${PREFIX}limitacao`]: {
                label: 'Limitação',
                type: 'number',
            },
            [`${PREFIX}quantidade`]: {
                label: 'Quantidade',
                type: 'number',
            },
            [`${PREFIX}Tipo`]: {
                label: 'Tipo',
                type: '!struct',
                subfields: {
                    [`${PREFIX}etiquetaid`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: tagOptions,
                        },
                    },
                },
            },
            [`${PREFIX}ativo`]: {
                label: 'Ativo',
                type: 'boolean',
            },
        } })), [tagOptions]);
    const [query, setQuery] = React.useState({
        // @ts-ignore
        tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config),
        config: config,
    });
    const columns = [
        {
            name: `${PREFIX}nome`,
            label: 'Nome',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}limitacao`,
            label: 'Limitação',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}quantidade`,
            label: 'Quantidade',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}Tipo.${PREFIX}nome`,
            label: 'Tipo',
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
        const newFiniteResource = allFiniteInfiniteResources === null || allFiniteInfiniteResources === void 0 ? void 0 : allFiniteInfiniteResources.map((resource) => {
            var _a;
            return (Object.assign(Object.assign({}, resource), { name: (_a = resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}nome`]) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase(), actions: (React.createElement(Grid, null,
                    React.createElement(Tooltip, { arrow: true, title: 'Detalhes' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleDetail(resource) },
                            React.createElement(Info, null))),
                    React.createElement(Tooltip, { arrow: true, title: 'Editar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleEdit(resource) },
                            React.createElement(Edit, null))),
                    (resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}ativo`]) ? (React.createElement(Tooltip, { arrow: true, title: 'Desativar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleDesactive(resource) },
                            React.createElement(VisibilityOff, null)))) : (React.createElement(Tooltip, { arrow: true, title: 'Ativar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleActive(resource) },
                            React.createElement(Visibility, null)))),
                    React.createElement(Tooltip, { arrow: true, title: 'Excluir' },
                        React.createElement(IconButton, { onClick: () => handleDelete(resource) },
                            React.createElement(Delete, null))))) }));
        });
        setListFiltered(newFiniteResource === null || newFiniteResource === void 0 ? void 0 : newFiniteResource.filter((e) => {
            return ((e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) &&
                (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.FINITO);
        }));
        return newFiniteResource;
    }, [allFiniteInfiniteResources, showActive]);
    React.useEffect(() => {
        refetch();
    }, []);
    const refetch = () => {
        dispatch(fetchAllFiniteInfiniteResources({
            searchQuery: '',
            typeResource: TYPE_RESOURCE.FINITO,
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
        setForm({
            open: true,
            item,
        });
    };
    const handleDesactive = (item) => {
        setDesactive({
            open: true,
            item,
        });
    };
    const handleDelete = (item) => {
        confirmation.openConfirmation({
            title: 'Deseja relmente excluir o Recurso Finito?',
            description: item === null || item === void 0 ? void 0 : item[`${PREFIX}nome`],
            onConfirm: () => dispatch(deleteResource({ id: item === null || item === void 0 ? void 0 : item[`${PREFIX}recursofinitoinfinitoid`] }, {
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
    const handleActive = (item) => {
        activeFiniteInfiniteResource(item, {
            onSuccess: handleSuccess,
            onError: handleError,
        });
    };
    const handleDetail = (item) => {
        setDetail({
            open: true,
            item,
        });
    };
    const setRowProps = (row) => {
        if (!row[4]) {
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
                { name: 'Recurso Infinito', page: 'Recurso Infinito' },
            ] },
            React.createElement(DontHasPermition, null)));
    }
    return (React.createElement(Page, { context: context, itemsBreadcrumbs: [
            { name: 'Planejamento', page: 'Pessoa' },
            { name: 'Recurso Finito', page: 'Recurso Finito' },
        ] },
        React.createElement(CreateHeader, { title: 'Recurso Finito', action: React.createElement(Button, { onClick: () => setForm({ open: true }), variant: 'contained', color: 'primary', startIcon: React.createElement(Add, null) }, "Adicionar Recurso Finito") }),
        React.createElement(FilterDrawer, { open: openFilter, queryQB: query, clearFilter: clearFilter, configQB: config, setQuery: setQuery, applyFilter: applyFilter, onClose: () => setOpenFilter(false) }),
        React.createElement(Table, { refTable: refTable, columns: columns, data: listFiltered, options: tableOptions }),
        React.createElement(ModalDetail, { open: detail.open, item: detail.item, onClose: () => setDetail({ open: false }) }),
        React.createElement(ModalBulkEdit, { open: bulkEdit.open, persons: bulkEdit.items, notification: notification, handleClose: () => {
                refetch();
                setDesactive({ open: false });
            } }),
        React.createElement(ModalDesactive, { open: desactive.open, resource: desactive.item, notification: notification, handleClose: () => {
                refetch();
                setDesactive({ open: false });
            } }),
        React.createElement(AddFiniteInfiniteResource, { typeResource: TYPE_RESOURCE.FINITO, open: form.open, resource: form.item, refetch: refetch, handleClose: () => setForm({ open: false }) })));
};
export default FiniteResourcePage;
//# sourceMappingURL=FiniteResourcePage.js.map