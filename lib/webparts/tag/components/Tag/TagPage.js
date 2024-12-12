import * as React from 'react';
import Page from '~/components/Page';
import Table from '~/components/Table';
import CreateHeader from '~/components/CreateHeader';
import ModalDetail from './../ModalDetail';
import ModalBulkEdit from './../ModalBulkEdit';
import ModalDesactive from './../ModalDesactive';
import { Button, Grid, IconButton, Tooltip } from '@material-ui/core';
import { Add, Delete, Edit, FilterList, Info, Visibility, VisibilityOff, } from '@material-ui/icons';
import { useNotification, useConfirmation, useLoggedUser } from '~/hooks';
import { PREFIX } from '~/config/database';
import { AddTag, DontHasPermition } from '~/components';
import { useDispatch, useSelector } from 'react-redux';
import { activeTag, deleteTag, fetchAllTags, } from '~/store/modules/tag/actions';
import { Utils as QbUtils } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import FilterDrawer from '~/components/FilterDrawer';
const TagPage = ({ context }) => {
    const [form, setForm] = React.useState({ open: false });
    const [detail, setDetail] = React.useState({ open: false });
    const [bulkEdit, setBulkEdit] = React.useState({ open: false });
    const [desactive, setDesactive] = React.useState({ open: false });
    const [openFilter, setOpenFilter] = React.useState(false);
    const [listFiltered, setListFiltered] = React.useState([]);
    const dispatch = useDispatch();
    const { tags } = useSelector((state) => state.tag);
    const refTable = React.useRef();
    const { currentUser } = useLoggedUser();
    const fatherTags = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ehpai`]), [tags]);
    const config = React.useMemo(() => (Object.assign(Object.assign({}, FILTER_CONFIG_DEFAULT), { fields: {
            name: {
                label: 'Nome',
                type: 'text',
            },
            description: {
                label: 'Descrição',
                type: 'text',
            },
            [`${PREFIX}Etiqueta_Pai`]: {
                label: 'Etiqueta(s) Pai',
                type: '!group',
                subfields: {
                    [`${PREFIX}etiquetaid`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: fatherTags,
                        },
                    },
                },
            },
            [`${PREFIX}ativo`]: {
                label: 'Ativo',
                type: 'boolean',
            },
        } })), [fatherTags]);
    const [query, setQuery] = React.useState({
        // @ts-ignore
        tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config),
        config: config,
    });
    React.useEffect(() => {
        refetch();
    }, []);
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const columns = [
        {
            name: `${PREFIX}nome`,
            label: 'Nome (PT)',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}nomeen`,
            label: 'Nome (EN)',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}nomees`,
            label: 'Nome (ES)',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}descricao`,
            label: 'Descrição',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `fatherTags`,
            label: 'Etiqueta(s) Pai',
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: `${PREFIX}ehpai`,
            label: 'É Etiqueta pai',
            options: {
                filter: false,
                sort: false,
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
        const newTags = tags === null || tags === void 0 ? void 0 : tags.map((tag) => {
            var _a, _b;
            return (Object.assign(Object.assign({}, tag), { name: (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase(), description: (_b = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}descricao`]) === null || _b === void 0 ? void 0 : _b.toLocaleUpperCase(), [`${PREFIX}ehpai`]: (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ehpai`]) ? 'Sim' : 'Não', fatherTags: tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`].map((tag) => tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]).join(', '), actions: (React.createElement(Grid, null,
                    React.createElement(Tooltip, { arrow: true, title: 'Detalhes' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleDetail(tag) },
                            React.createElement(Info, null))),
                    React.createElement(Tooltip, { arrow: true, title: 'Editar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleEdit(tag) },
                            React.createElement(Edit, null))),
                    (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) && !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ehpai`]) ? (React.createElement(Tooltip, { arrow: true, title: 'Desativar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleDesactive(tag) },
                            React.createElement(VisibilityOff, null)))) : !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ehpai`]) ? (React.createElement(Tooltip, { arrow: true, title: 'Ativar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleActive(tag) },
                            React.createElement(Visibility, null)))) : null,
                    !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ehpai`]) && (React.createElement(Tooltip, { arrow: true, title: 'Excluir' },
                        React.createElement(IconButton, { onClick: () => handleDelete(tag) },
                            React.createElement(Delete, null)))))) }));
        });
        setListFiltered(newTags === null || newTags === void 0 ? void 0 : newTags.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`]));
        return newTags;
    }, [tags]);
    const refetch = () => {
        dispatch(fetchAllTags({
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
    const handleSuccessDelete = () => {
        refetch();
        notification.success({
            title: 'Sucesso',
            description: 'Excluído com sucesso',
        });
    };
    const handleError = (error) => {
        var _a, _b;
        refetch();
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
            title: 'Deseja relmente excluir a tag?',
            description: item === null || item === void 0 ? void 0 : item[`${PREFIX}nome`],
            onConfirm: () => dispatch(deleteTag({ id: item === null || item === void 0 ? void 0 : item[`${PREFIX}etiquetaid`] }, { onSuccess: handleSuccessDelete, onError: handleError })),
        });
    };
    const handleActive = (item) => {
        dispatch(activeTag(item, { onSuccess: handleSuccess, onError: handleError }));
    };
    const handleDetail = (item) => {
        setDetail({
            open: true,
            item,
        });
    };
    const setRowProps = (row) => {
        if (!row[6]) {
            return {
                style: { background: '#f09b95' },
            };
        }
        if (row[5] === 'Sim') {
            return {
                style: { background: '#ededed' },
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
        console.log(logic);
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
                { name: 'Etiqueta', page: 'Etiqueta' },
            ] },
            React.createElement(DontHasPermition, null)));
    }
    return (React.createElement(Page, { context: context, itemsBreadcrumbs: [
            { name: 'Planejamento', page: 'Pessoa' },
            { name: 'Etiqueta', page: 'Etiqueta' },
        ] },
        React.createElement(CreateHeader, { title: 'Etiqueta', action: React.createElement(Button, { onClick: () => setForm({ open: true }), variant: 'contained', color: 'primary', startIcon: React.createElement(Add, null) }, "Adicionar Etiqueta") }),
        React.createElement(Table, { refTable: refTable, columns: columns, data: listFiltered, options: tableOptions }),
        React.createElement(FilterDrawer, { open: openFilter, queryQB: query, clearFilter: clearFilter, configQB: config, setQuery: setQuery, applyFilter: applyFilter, onClose: () => setOpenFilter(false) }),
        React.createElement(ModalDetail, { open: detail.open, item: detail.item, onClose: () => setDetail({ open: false }) }),
        React.createElement(ModalBulkEdit, { open: bulkEdit.open, tags: bulkEdit.items, notification: notification, handleClose: () => setBulkEdit({ open: false }) }),
        React.createElement(ModalDesactive, { open: desactive.open, tag: desactive.item, notification: notification, handleClose: () => {
                refetch();
                setDesactive({ open: false });
            } }),
        React.createElement(AddTag, { open: form.open, tag: form.item, fatherTags: fatherTags, handleEdit: handleEdit, handleClose: () => setForm({ open: false }) })));
};
export default TagPage;
//# sourceMappingURL=TagPage.js.map