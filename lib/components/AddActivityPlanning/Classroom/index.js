import * as React from 'react';
import { Box, Grid, IconButton, TextField, Tooltip } from '@material-ui/core';
import { PlusOne } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
import AddTag from '~/components/AddTag';
const Classroom = ({ formik }) => {
    var _a, _b, _c, _d;
    const [newTagModal, setNewTagModal] = React.useState({
        open: false,
        fatherTag: null,
    });
    const { tag } = useSelector((state) => state);
    const { tags } = tag;
    const courseOptions = tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.COURSE);
    });
    const fatherTags = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ehpai`]), [tags]);
    const handleNewTag = React.useCallback((type) => {
        const tag = tags.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === type);
        setNewTagModal({ open: true, fatherTag: tag });
    }, [tags]);
    const handleCloseNewTag = React.useCallback(() => setNewTagModal({ open: false, fatherTag: null }), []);
    return (React.createElement(React.Fragment, null,
        React.createElement(AddTag, { open: newTagModal.open, fatherTags: fatherTags, fatherSelected: newTagModal.fatherTag, handleClose: handleCloseNewTag }),
        React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', minHeight: '19rem', flexGrow: 1 },
            React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                    React.createElement(TextField, { disabled: true, autoFocus: true, fullWidth: true, minRows: 2, label: 'Tema', type: 'text', name: 'theme', inputProps: { maxLength: 255 }, 
                        // @ts-ignore
                        error: !!((_a = formik === null || formik === void 0 ? void 0 : formik.errors) === null || _a === void 0 ? void 0 : _a.theme), 
                        // @ts-ignore
                        helperText: (_b = formik === null || formik === void 0 ? void 0 : formik.errors) === null || _b === void 0 ? void 0 : _b.theme, onChange: formik.handleChange, value: formik.values.theme })),
                React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                    React.createElement(TextField, { fullWidth: true, multiline: true, minRows: 2, inputProps: { maxLength: 2000 }, label: 'Descri\u00E7\u00E3o/Objetivo da sess\u00E3o', type: 'text', name: 'description', onChange: formik.handleChange, value: formik.values.description, 
                        // @ts-ignore
                        error: !!((_c = formik === null || formik === void 0 ? void 0 : formik.errors) === null || _c === void 0 ? void 0 : _c.description), 
                        // @ts-ignore
                        helperText: (_d = formik === null || formik === void 0 ? void 0 : formik.errors) === null || _d === void 0 ? void 0 : _d.description })),
                React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                    React.createElement(Box, { display: 'flex', alignItems: 'center' },
                        React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: courseOptions, onChange: (event, newValue) => {
                                formik.setFieldValue('course', newValue);
                            }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!formik.errors.course, helperText: formik.errors.course, label: 'Curso' }))), value: formik.values.course }),
                        React.createElement(Tooltip, { title: 'Adicionar Curso' },
                            React.createElement(IconButton, { onClick: () => handleNewTag(EFatherTag.COURSE) },
                                React.createElement(PlusOne, null)))))))));
};
export default Classroom;
//# sourceMappingURL=index.js.map