import * as React from 'react';
import { Box, Grid, IconButton, TextField, Tooltip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Anexos from '~/components/Anexos';
import { PREFIX } from '~/config/database';
import { EFatherTag, ETypeTag } from '~/config/enums';
import { useSelector } from 'react-redux';
import { PlusOne } from '@material-ui/icons';
import { AddTag } from '~/components';
import AddProperty from './AddProperty';
import { useLoggedUser } from '~/hooks';
const Info = ({ formik, refAnexo }) => {
    const [openAddProperty, setOpenAddProperty] = React.useState(false);
    const [newTagModal, setNewTagModal] = React.useState({
        open: false,
        fatherTag: null,
    });
    const { currentUser } = useLoggedUser();
    const { tag, person } = useSelector((state) => state);
    const { tags } = tag;
    const { personsActive, loading } = person;
    const ownerOptions = React.useMemo(() => personsActive === null || personsActive === void 0 ? void 0 : personsActive.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.some((tag) => (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) == ETypeTag.PROPRIETARIO);
    }), [personsActive]);
    const fatherTags = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ehpai`]), [tags]);
    const handleCloseNewTag = React.useCallback(() => setNewTagModal({ open: false, fatherTag: null }), []);
    const handleNewTag = React.useCallback((type) => {
        const tag = tags.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === type);
        setNewTagModal({ open: true, fatherTag: tag });
    }, [tags]);
    const typeSpaceOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TIPO_ESPACO)) &&
            !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]);
    }), [tags]);
    return (React.createElement(React.Fragment, null,
        React.createElement(AddProperty, { open: openAddProperty, onAddProperty: (e) => console.log(e), onClose: () => setOpenAddProperty(false) }),
        React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', minHeight: '19rem', flexGrow: 1 },
            React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                    React.createElement(TextField, { required: true, autoFocus: true, fullWidth: true, label: 'Nome', type: 'text', name: 'name', inputProps: { maxLength: 255 }, error: !!formik.errors.name, helperText: formik.errors.name, onChange: formik.handleChange, value: formik.values.name })),
                React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                    React.createElement(TextField, { fullWidth: true, label: 'E-mail', type: 'email', name: 'email', inputProps: { maxLength: 255 }, error: !!formik.errors.email, helperText: formik.errors.email, onChange: formik.handleChange, value: formik.values.email })),
                React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                    React.createElement(Box, { display: 'flex', alignItems: 'center' },
                        React.createElement(Autocomplete, { fullWidth: true, multiple: true, filterSelectedOptions: true, options: typeSpaceOptions, noOptionsText: 'Sem Op\u00E7\u00F5es', onChange: (event, newValue) => {
                                formik.setFieldValue('tags', newValue);
                            }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({ required: true }, params, { fullWidth: true, error: !!formik.errors.tags, helperText: formik.errors.tags, label: 'Etiqueta(s)' }))), value: formik.values.tags }),
                        React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                            React.createElement(IconButton, { disabled: !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.TIPO_ESPACO) },
                                React.createElement(PlusOne, null))))),
                React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                    React.createElement(Box, { display: 'flex', alignItems: 'center' },
                        React.createElement(Autocomplete, { fullWidth: true, loading: loading, filterSelectedOptions: true, options: ownerOptions === null || ownerOptions === void 0 ? void 0 : ownerOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`]), onChange: (event, newValue) => {
                                formik.setFieldValue('owner', newValue);
                            }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), noOptionsText: 'Sem Op\u00E7\u00F5es', getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!formik.errors.owner, helperText: formik.errors.owner, label: 'Propriet\u00E1rio' }))), value: formik.values.owner }),
                        React.createElement(Tooltip, { title: 'Adicionar Propriet\u00E1rio' },
                            React.createElement(IconButton, { disabled: !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => setOpenAddProperty(true) },
                                React.createElement(PlusOne, null)))))),
            React.createElement(Box, { marginTop: '1rem' },
                React.createElement(Anexos, { ref: refAnexo, anexos: formik.values.anexos }))),
        React.createElement(AddTag, { open: newTagModal.open, fatherTags: fatherTags, fatherSelected: newTagModal.fatherTag, handleClose: handleCloseNewTag })));
};
export default Info;
//# sourceMappingURL=index.js.map