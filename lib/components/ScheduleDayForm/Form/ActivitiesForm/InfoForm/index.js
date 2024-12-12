import * as React from 'react';
import { Box, Checkbox, Dialog, DialogContent, DialogTitle, Grid, IconButton, TextField, Tooltip, Typography, } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { EFatherTag, TYPE_ACTIVITY } from '~/config/enums';
import { PREFIX } from '~/config/database';
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, Close, PlusOne, } from '@material-ui/icons';
import AddTag from '~/components/AddTag';
import AddSpace from '~/components/AddSpace';
import { useLoggedUser } from '~/hooks';
const InfoForm = ({ index, disabled, tagsOptions, spaceOptions, values, errors, setFieldValue, }) => {
    var _a;
    const [newTagModal, setNewTagModal] = React.useState({
        open: false,
        fatherTag: null,
    });
    const [newSpace, setNewSpace] = React.useState({
        open: false,
    });
    const [dialogConflict, setDialogConflict] = React.useState({
        open: false,
        msg: null,
    });
    const { currentUser } = useLoggedUser();
    const areaOptions = (_a = tagsOptions === null || tagsOptions === void 0 ? void 0 : tagsOptions.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.AREA_ACADEMICA);
    })) === null || _a === void 0 ? void 0 : _a.sort((a, b) => (a === null || a === void 0 ? void 0 : a[`${PREFIX}ordem`]) - (b === null || b === void 0 ? void 0 : b[`${PREFIX}ordem`]));
    const fatherTags = React.useMemo(() => tagsOptions === null || tagsOptions === void 0 ? void 0 : tagsOptions.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ehpai`]), [tagsOptions]);
    const handleNewTag = React.useCallback((type) => {
        const tag = tagsOptions.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === type);
        setNewTagModal({ open: true, fatherTag: tag });
    }, [tagsOptions]);
    const handleCloseNewTag = React.useCallback(() => setNewTagModal({ open: false, fatherTag: null }), []);
    return (React.createElement(React.Fragment, null,
        React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(TextField, { fullWidth: true, disabled: true, label: 'Nome', type: 'text', name: 'name', inputProps: { maxLength: 255 }, error: !!errors.name, helperText: errors.name, value: values === null || values === void 0 ? void 0 : values[`${PREFIX}nome`] })),
            (values === null || values === void 0 ? void 0 : values[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA && (React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(Box, { display: 'flex', alignItems: 'center' },
                    React.createElement(Autocomplete, { fullWidth: true, disabled: disabled, filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: areaOptions === null || areaOptions === void 0 ? void 0 : areaOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`]), onChange: (event, newValue) => {
                            setFieldValue(`activities[${index}].${PREFIX}AreaAcademica`, newValue);
                        }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}etiquetaid`]) ===
                            (value === null || value === void 0 ? void 0 : value[`${PREFIX}etiquetaid`]), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '\u00C1rea Acad\u00EAmica' }))), value: values === null || values === void 0 ? void 0 : values[`${PREFIX}AreaAcademica`] }),
                    React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                        React.createElement(IconButton, { disabled: disabled || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.AREA_ACADEMICA) },
                            React.createElement(PlusOne, null)))))),
            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(Box, { display: 'flex', alignItems: 'center' },
                    React.createElement(Autocomplete, { multiple: true, fullWidth: true, disabled: disabled, noOptionsText: 'Sem Op\u00E7\u00F5es', disableCloseOnSelect: true, blurOnSelect: false, options: spaceOptions, onChange: (event, newValue) => {
                            setFieldValue(`activities[${index}].spaces`, newValue);
                        }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}espacoid`]) === (value === null || value === void 0 ? void 0 : value[`${PREFIX}espacoid`]), renderOption: (option, { selected }) => (React.createElement(React.Fragment, null,
                            React.createElement(Checkbox, { icon: React.createElement(CheckBoxOutlineBlankIcon, { fontSize: 'small' }), checkedIcon: React.createElement(CheckBoxIcon, { color: 'secondary', fontSize: 'small' }), inputProps: {
                                    id: 'checkSpace'
                                }, style: { marginRight: 8 }, checked: selected }), option === null || option === void 0 ? void 0 :
                            option[`${PREFIX}nome`])), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Espa\u00E7o' }))), value: values === null || values === void 0 ? void 0 : values.spaces }),
                    React.createElement(Tooltip, { title: 'Adicionar Espa\u00E7o' },
                        React.createElement(IconButton, { disabled: disabled || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => setNewSpace({ open: true }) },
                            React.createElement(PlusOne, null))))),
            (values === null || values === void 0 ? void 0 : values[`${PREFIX}tipo`]) !== TYPE_ACTIVITY.ACADEMICA && (React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                React.createElement(TextField, { fullWidth: true, minRows: 2, label: 'Tema', type: 'text', name: 'theme', disabled: disabled, inputProps: { maxLength: 255 }, 
                    // @ts-ignore
                    error: !!(errors === null || errors === void 0 ? void 0 : errors.theme), 
                    // @ts-ignore
                    helperText: errors === null || errors === void 0 ? void 0 : errors.theme, onChange: (event) => setFieldValue(`activities[${index}].${PREFIX}temaaula`, event.target.value), value: values === null || values === void 0 ? void 0 : values[`${PREFIX}temaaula`] })))),
        React.createElement(AddTag, { open: newTagModal.open, fatherTags: fatherTags, fatherSelected: newTagModal.fatherTag, handleClose: handleCloseNewTag }),
        React.createElement(AddSpace, { open: newSpace.open, handleClose: () => setNewSpace({ open: false }) }),
        React.createElement(Dialog, { open: dialogConflict.open },
            React.createElement(DialogTitle, null,
                React.createElement(Typography, { variant: 'subtitle1', color: 'secondary', style: { maxWidth: '25rem', fontWeight: 'bold' } },
                    "Resursos com conflito",
                    React.createElement(IconButton, { "aria-label": 'close', onClick: () => setDialogConflict({
                            open: false,
                            msg: null,
                        }), style: { position: 'absolute', right: 8, top: 8 } },
                        React.createElement(Close, null)))),
            React.createElement(DialogContent, null, dialogConflict.msg))));
};
export default InfoForm;
//# sourceMappingURL=index.js.map