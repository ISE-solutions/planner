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
import { AddSpace, DontHasPermition } from '~/components';
import { useDispatch, useSelector } from 'react-redux';
import { activeSpace, deleteSpace, fetchAllSpace, } from '~/store/modules/space/actions';
import { Utils as QbUtils } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import { EFatherTag, ETypeTag } from '~/config/enums';
import FilterDrawer from '~/components/FilterDrawer';
const SpacePage = ({ context }) => {
    const { currentUser } = useLoggedUser();
    const dispatch = useDispatch();
    const [form, setForm] = React.useState({ open: false });
    const [detail, setDetail] = React.useState({ open: false });
    const [bulkEdit, setBulkEdit] = React.useState({ open: false });
    const [desactive, setDesactive] = React.useState({ open: false });
    const [openFilter, setOpenFilter] = React.useState(false);
    const [listFiltered, setListFiltered] = React.useState([]);
    const { tag, person } = useSelector((state) => state);
    const { tags } = tag;
    const { personsActive } = person;
    const ownerOptions = React.useMemo(() => personsActive === null || personsActive === void 0 ? void 0 : personsActive.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.some((tag) => (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) == ETypeTag.PROPRIETARIO);
    }), [personsActive]);
    const typeSpaceOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TIPO_ESPACO)) &&
            !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]);
    }), [tags]);
    const config = React.useMemo(() => (Object.assign(Object.assign({}, FILTER_CONFIG_DEFAULT), { fields: {
            name: {
                label: 'Nome',
                type: 'text',
            },
            [`${PREFIX}Proprietario`]: {
                label: 'Proprietário',
                type: '!struct',
                subfields: {
                    [`${PREFIX}pessoaid`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: ownerOptions,
                        },
                    },
                },
            },
            [`${PREFIX}Espaco_Etiqueta_Etiqueta`]: {
                label: 'Etiqueta (s)',
                type: '!group',
                subfields: {
                    [`${PREFIX}etiquetaid`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: typeSpaceOptions,
                        },
                    },
                },
            },
            [`${PREFIX}Espaco_CapacidadeEspaco`]: {
                label: 'Capacidade',
                type: '!group',
                subfields: {
                    [`${PREFIX}quantidade`]: {
                        label: 'Quantidade',
                        type: 'number',
                    },
                },
            },
            [`${PREFIX}ativo`]: {
                label: 'Ativo',
                type: 'boolean',
            },
        } })), [ownerOptions, typeSpaceOptions]);
    const [query, setQuery] = React.useState({
        // @ts-ignore
        tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config),
        config: config,
    });
    React.useEffect(() => {
        refetch();
    }, []);
    const { spaces } = useSelector((state) => state.space);
    const refTable = React.useRef();
    const { confirmation } = useConfirmation();
    const { notification } = useNotification();
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
            name: `${PREFIX}email`,
            label: 'E-mail',
            options: {
                filter: true,
                sort: true,
                setCellProps: () => ({ style: { minWidth: '9rem' } }),
            },
        },
        {
            name: `${PREFIX}Proprietario.${PREFIX}nomecompleto`,
            label: 'Proprietário',
            options: {
                filter: true,
                sort: true,
                setCellProps: () => ({ style: { minWidth: '9rem' } }),
            },
        },
        {
            name: 'tags',
            label: 'Etiqueta(s)',
            options: {
                filter: true,
                sort: true,
                setCellProps: () => ({ style: { minWidth: '9rem' } }),
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
        const newSpaces = spaces === null || spaces === void 0 ? void 0 : spaces.map((space) => {
            var _a, _b, _c;
            return (Object.assign(Object.assign({}, space), { name: (_a = space === null || space === void 0 ? void 0 : space[`${PREFIX}nome`]) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase(), tags: (_c = (_b = space === null || space === void 0 ? void 0 : space[`${PREFIX}Espaco_Etiqueta_Etiqueta`]) === null || _b === void 0 ? void 0 : _b.map((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`])) === null || _c === void 0 ? void 0 : _c.join(', '), actions: (React.createElement(Grid, null,
                    React.createElement(Tooltip, { arrow: true, title: 'Detalhes' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleDetail(space) },
                            React.createElement(Info, null))),
                    React.createElement(Tooltip, { arrow: true, title: 'Editar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleEdit(space) },
                            React.createElement(Edit, null))),
                    (space === null || space === void 0 ? void 0 : space[`${PREFIX}ativo`]) ? (React.createElement(Tooltip, { arrow: true, title: 'Desativar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleDesactive(space) },
                            React.createElement(VisibilityOff, null)))) : (React.createElement(Tooltip, { arrow: true, title: 'Ativar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleActive(space) },
                            React.createElement(Visibility, null)))),
                    React.createElement(Tooltip, { arrow: true, title: 'Excluir' },
                        React.createElement(IconButton, { onClick: () => handleDelete(space) },
                            React.createElement(Delete, null))))) }));
        });
        setListFiltered(newSpaces === null || newSpaces === void 0 ? void 0 : newSpaces.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`]));
        return newSpaces;
    }, [spaces]);
    const refetch = () => {
        dispatch(fetchAllSpace({
            searchQuery: '',
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
    const handleActive = (item) => {
        dispatch(activeSpace(item, { onSuccess: handleSuccess, onError: handleError }));
    };
    const handleDelete = (item) => {
        confirmation.openConfirmation({
            title: 'Deseja relmente excluir o espaço?',
            description: item === null || item === void 0 ? void 0 : item[`${PREFIX}nome`],
            onConfirm: () => dispatch(deleteSpace({ id: item === null || item === void 0 ? void 0 : item[`${PREFIX}espacoid`] }, {
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
    const handleDetail = (item) => {
        setDetail({
            open: true,
            item,
        });
    };
    const customToolbarSelect = (selectedRows) => {
        const itemsSelected = [];
        selectedRows.data.forEach((row) => {
            itemsSelected.push(spaces[row.index]);
        });
        return (React.createElement("div", null,
            React.createElement(Tooltip, { arrow: true, title: 'Editar Selectionado(s)' },
                React.createElement(IconButton, { onClick: () => setBulkEdit({ open: true, items: itemsSelected }) },
                    React.createElement(Edit, null)))));
    };
    const setRowProps = (row) => {
        if (!row[4]) {
            return {
                style: { background: '#f09b95' },
            };
        }
    };
    const customToolbar = () => (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { disableFocusListener: true, arrow: true, title: 'Filtro' },
            React.createElement(IconButton, { onClick: () => setOpenFilter(true) },
                React.createElement(FilterList, null)))));
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
        customToolbarSelect,
    };
    if (!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning)) {
        return (React.createElement(Page, { context: context, itemsBreadcrumbs: [
                { name: 'Planejamento', page: 'Pessoa' },
                { name: 'Espaço', page: 'Espaco' },
            ] },
            React.createElement(DontHasPermition, null)));
    }
    return (React.createElement(Page, { context: context, itemsBreadcrumbs: [
            { name: 'Planejamento', page: 'Pessoa' },
            { name: 'Espaço', page: 'Espaco' },
        ] },
        React.createElement(CreateHeader, { title: 'Espa\u00E7o', action: React.createElement(Button, { onClick: () => setForm({ open: true }), variant: 'contained', color: 'primary', startIcon: React.createElement(Add, null) }, "Adicionar Espa\u00E7o") }),
        React.createElement(Table, { refTable: refTable, columns: columns, data: listFiltered, options: tableOptions }),
        React.createElement(FilterDrawer, { open: openFilter, queryQB: query, clearFilter: clearFilter, configQB: config, setQuery: setQuery, applyFilter: applyFilter, onClose: () => setOpenFilter(false) }),
        React.createElement(ModalDetail, { open: detail.open, item: detail.item, onClose: () => setDetail({ open: false }) }),
        React.createElement(ModalBulkEdit, { open: bulkEdit.open, spaces: bulkEdit.items, notification: notification, handleClose: () => setBulkEdit({ open: false }) }),
        React.createElement(ModalDesactive, { open: desactive.open, space: desactive.item, notification: notification, handleClose: () => {
                refetch();
                setDesactive({ open: false });
            } }),
        React.createElement(AddSpace, { open: form.open, space: form.item, handleEdit: handleEdit, handleClose: () => setForm({ open: false }) })));
};
export default SpacePage;
//# sourceMappingURL=SpacePage.js.map