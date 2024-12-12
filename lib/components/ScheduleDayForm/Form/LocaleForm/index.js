import * as React from 'react';
import { v4 } from 'uuid';
import { Box, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Add, Remove } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
const LocaleForm = ({ isDetail, values, spaceOptions, handleChange, errors, setValues, setFieldValue, }) => {
    var _a, _b;
    const handleAddPeople = () => {
        let locale = values.locale || [];
        locale.push({
            keyId: v4(),
            space: null,
            observation: '',
        });
        setValues(Object.assign(Object.assign({}, values), { locale }));
    };
    const handleRemovePeople = (keyId) => {
        let locale = values.locale || [];
        locale = locale === null || locale === void 0 ? void 0 : locale.map((e) => e.keyId === keyId ? Object.assign(Object.assign({}, e), { deleted: true }) : e);
        setValues(Object.assign(Object.assign({}, values), { locale }));
    };
    const listLocale = (_a = values === null || values === void 0 ? void 0 : values.locale) === null || _a === void 0 ? void 0 : _a.filter((e) => !e.deleted);
    return (React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', flexGrow: 1 }, (_b = values === null || values === void 0 ? void 0 : values.locale) === null || _b === void 0 ? void 0 : _b.map((item, index) => {
        if (item.deleted)
            return;
        return (React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
            React.createElement(Grid, { item: true, sm: 12, md: 5, lg: 5 },
                React.createElement(Autocomplete, { options: (spaceOptions === null || spaceOptions === void 0 ? void 0 : spaceOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], disabled: isDetail, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, getOptionLabel: (option) => option === null || option === void 0 ? void 0 : option.label, value: item.space, onChange: (event, newValue) => {
                        setFieldValue(`locale[${index}].space`, newValue);
                    }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => {
                        var _a, _b, _c, _d;
                        return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Espa\u00E7o', 
                            // @ts-ignore
                            error: !!((_b = (_a = errors === null || errors === void 0 ? void 0 : errors.locale) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.space), 
                            // @ts-ignore
                            helperText: (_d = (_c = errors === null || errors === void 0 ? void 0 : errors.locale) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.space })));
                    } })),
            React.createElement(Grid, { item: true, sm: 12, md: 5, lg: 5 },
                React.createElement(TextField, { fullWidth: true, label: 'Observa\u00E7\u00E3o', type: 'text', name: `locale[${index}].observation`, disabled: isDetail, inputProps: { maxLength: 200 }, error: !!errors.linkBackup, helperText: errors.linkBackup, onChange: handleChange, value: item.observation })),
            React.createElement(Grid, { item: true, lg: 1, md: 1, sm: 1, xs: 1, style: {
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: 25,
                }, justify: 'center' },
                index === 0 && !isDetail && (React.createElement(Add, { onClick: handleAddPeople, style: { color: '#333', cursor: 'pointer' } })),
                ((index !== 0 && !isDetail) || listLocale.length > 1) &&
                    !isDetail && (React.createElement(Remove, { onClick: () => handleRemovePeople(item.keyId), style: { color: '#333', cursor: 'pointer' } })))));
    })));
};
export default LocaleForm;
//# sourceMappingURL=index.js.map