import * as React from 'react';
import { Box, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { PREFIX } from '~/config/database';
const Info = ({ tag, fatherTags, formik }) => {
    const fatherTagsOptions = React.useMemo(() => {
        var _a;
        return (_a = fatherTags === null || fatherTags === void 0 ? void 0 : fatherTags.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) === null || _a === void 0 ? void 0 : _a.sort((a, b) => a === null || a === void 0 ? void 0 : a[`${PREFIX}nome`].localeCompare(b === null || b === void 0 ? void 0 : b[`${PREFIX}nome`], 'pt-BR'));
    }, [fatherTags]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', minHeight: '19rem', flexGrow: 1 },
            React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                    React.createElement(TextField, { required: true, autoFocus: true, fullWidth: true, label: 'Nome', type: 'text', name: 'name', disabled: tag && (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ehpai`]), inputProps: { maxLength: 255 }, error: !!formik.errors.name, helperText: formik.errors.name, onChange: formik.handleChange, value: formik.values.name })),
                React.createElement(Grid, { item: true, sm: 12, md: 8, lg: 8 },
                    React.createElement(Autocomplete, { multiple: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: fatherTagsOptions, onChange: (event, newValue) => {
                            formik.setFieldValue('fatherTag', newValue);
                        }, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!formik.errors.fatherTag, helperText: formik.errors.fatherTag, label: 'Etiqueta(s) pai' }))), value: formik.values.fatherTag })),
                React.createElement(Grid, { item: true, sm: 12, md: 4, lg: 4 },
                    React.createElement(TextField, { fullWidth: true, label: 'Ordem', type: 'number', name: 'order', error: !!formik.errors.order, helperText: formik.errors.order, onChange: formik.handleChange, value: formik.values.order })),
                React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                    React.createElement(TextField, { fullWidth: true, multiline: true, minRows: 2, label: 'Descri\u00E7\u00E3o', type: 'text', name: 'description', inputProps: { maxLength: 255 }, error: !!formik.errors.description, helperText: formik.errors.description, onChange: formik.handleChange, value: formik.values.description }))))));
};
export default Info;
//# sourceMappingURL=index.js.map