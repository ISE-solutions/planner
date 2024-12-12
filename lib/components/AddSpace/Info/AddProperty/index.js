import * as React from 'react';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography, } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { EFatherTag, ETypeTag } from '~/config/enums';
import { Autocomplete } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { addOrUpdatePerson, fetchAllPerson, } from '~/store/modules/person/actions';
import { useNotification } from '~/hooks';
const AddProperty = ({ open, onClose, onAddProperty, }) => {
    const [tagFilter, setTagFilter] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [itemSelected, setItemSelected] = React.useState(null);
    const dispatch = useDispatch();
    const { notification } = useNotification();
    const { person, tag } = useSelector((state) => state);
    const { tags, dictTag } = tag;
    const { personsActive: persons } = person;
    const property = tags.find((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === ETypeTag.PROPRIETARIO);
    const handleClose = () => {
        setTagFilter(null);
        setItemSelected(null);
        onClose();
    };
    const handleSuccess = () => {
        handleClose();
        setLoading(false);
        dispatch(fetchAllPerson({}));
        notification.success({
            title: 'Sucesso',
            description: person
                ? 'Atualizado com sucesso'
                : 'Cadastro realizado com sucesso',
        });
    };
    const handleError = (error) => {
        var _a, _b;
        setLoading(false);
        notification.error({
            title: 'Falha',
            description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
        });
    };
    const handleNext = () => {
        var _a, _b, _c, _d, _e, _f;
        if (!itemSelected || !Object.keys(itemSelected).length) {
            notification.error({
                title: 'Campo Pessoa',
                description: 'Selecione uma pessoa!',
            });
            return;
        }
        setLoading(true);
        const newPerson = {
            name: itemSelected[`${PREFIX}nome`] || '',
            lastName: itemSelected[`${PREFIX}sobrenome`] || '',
            favoriteName: itemSelected[`${PREFIX}nomepreferido`] || '',
            email: itemSelected[`${PREFIX}email`] || '',
            emailSecondary: itemSelected[`${PREFIX}emailsecundario`] || '',
            phone: itemSelected[`${PREFIX}celular`] || '',
            school: dictTag[itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`_${PREFIX}escolaorigem_value`]],
            areaChief: ((_a = person[`${PREFIX}Pessoa_AreaResponsavel`]) === null || _a === void 0 ? void 0 : _a.length)
                ? (_b = person[`${PREFIX}Pessoa_AreaResponsavel`]) === null || _b === void 0 ? void 0 : _b.map((e) => dictTag[e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]])
                : [],
            title: itemSelected[`${PREFIX}Titulo`]
                ? {
                    value: (_c = itemSelected[`${PREFIX}Titulo`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}categoriaetiquetaid`],
                    label: (_d = itemSelected[`${PREFIX}Titulo`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`],
                }
                : null,
            tag: ((_e = itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _e === void 0 ? void 0 : _e.length)
                ? (_f = [...itemSelected[`${PREFIX}Pessoa_Etiqueta_Etiqueta`], property]) === null || _f === void 0 ? void 0 : _f.map((e) => dictTag[e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]])
                : [property],
        };
        dispatch(addOrUpdatePerson(Object.assign(Object.assign({}, newPerson), { id: itemSelected[`${PREFIX}pessoaid`], previousTag: itemSelected[`${PREFIX}Pessoa_Etiqueta_Etiqueta`] }), {
            onSuccess: handleSuccess,
            onError: handleError,
        }));
    };
    const peopleFilterOptions = React.useMemo(() => tags.filter((tag) => {
        var _a;
        return !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
            ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO));
    }), []);
    const peopleOptions = React.useMemo(() => {
        if (tagFilter) {
            return persons === null || persons === void 0 ? void 0 : persons.filter((spc) => {
                var _a;
                return (_a = spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.some((tg) => 
                // @ts-ignore
                (tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}etiquetaid`]) === (tagFilter === null || tagFilter === void 0 ? void 0 : tagFilter[`${PREFIX}etiquetaid`]));
            });
        }
        return persons;
    }, [tagFilter]);
    return (React.createElement(Dialog, { open: open, fullWidth: true, maxWidth: 'md' },
        React.createElement(DialogTitle, null,
            "Vincular propriet\u00E1rio",
            React.createElement(IconButton, { "aria-label": 'close', onClick: handleClose, style: { position: 'absolute', right: 8, top: 8 } },
                React.createElement(Close, null))),
        React.createElement(DialogContent, null,
            React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '1rem' } },
                React.createElement(Box, { display: 'flex', flexDirection: 'column', borderRadius: '10px', border: '1px solid #0063a5', padding: '10px', style: { gap: '1rem' } },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '1rem' } },
                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Filtro")),
                    React.createElement(Autocomplete, { fullWidth: true, options: peopleFilterOptions, noOptionsText: 'Sem opções', value: tagFilter, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', onChange: (event, newValue) => setTagFilter(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Etiqueta' }))) })),
                React.createElement(Autocomplete, { fullWidth: true, options: peopleOptions || [], noOptionsText: 'Sem opções', value: itemSelected, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', onChange: (event, newValue) => setItemSelected(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Pessoa' }))) }))),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: onClose, color: 'primary' }, "Cancelar"),
            React.createElement(Button, { onClick: () => !loading && handleNext(), variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar')))));
};
export default AddProperty;
//# sourceMappingURL=index.js.map