import * as React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { Box, Grid, TextField } from '@material-ui/core';
import { ENTITIES } from '../constants';
import { KeyboardDatePicker } from '@material-ui/pickers';
const entities = [
    {
        value: ENTITIES.TAG,
        label: 'Etiqueta',
    },
    {
        value: ENTITIES.PERSON,
        label: 'Pessoa',
    },
    {
        value: ENTITIES.SPACE,
        label: 'Espaço',
    },
    {
        value: ENTITIES.FINITE_RESOURCES,
        label: 'Recurso Finito',
    },
    {
        value: ENTITIES.INFINITE_RESOURCES,
        label: 'Recurso Infinito',
    },
    {
        value: ENTITIES.ACADEMIC_ACTIVITY,
        label: 'Atividade Acadêmica',
    },
    {
        value: ENTITIES.NON_ACADEMIC_ACTIVITY,
        label: 'Atividade não Acadêmica',
    },
    {
        value: ENTITIES.INTERNAL_ACTIVITY,
        label: 'Atividade Interna',
    },
    {
        value: ENTITIES.PROGRAM,
        label: 'Programa',
    },
    {
        value: ENTITIES.PROGRAM_MODEL,
        label: 'Programa (Modelo)',
    },
    {
        value: ENTITIES.TEAM,
        label: 'Turma',
    },
    {
        value: ENTITIES.TEAM_MODEL,
        label: 'Turma (Modelo)',
    },
    {
        value: ENTITIES.SCHEDULE,
        label: 'Dia de aula',
    },
    {
        value: ENTITIES.SCHEDULE_MODEL,
        label: 'Dia de aula (Modelo)',
    },
    {
        value: ENTITIES.ACTIVITY,
        label: 'Atividade',
    },
    {
        value: ENTITIES.ACTIVITY_MODEL,
        label: 'Atividade (Modelo)',
    },
];
const Filter = ({ formik }) => {
    var _a, _b, _c, _d, _e;
    return (React.createElement(Box, null,
        React.createElement(Grid, { container: true, spacing: 3 },
            React.createElement(Grid, { item: true, sm: 12, md: 4, lg: 4 },
                React.createElement(Autocomplete, { options: entities, getOptionLabel: (option) => option === null || option === void 0 ? void 0 : option.label, onChange: (event, newValue) => {
                        formik.setFieldValue(`entity`, newValue);
                    }, noOptionsText: 'Sem Op\u00E7\u00F5es', renderInput: (params) => {
                        var _a, _b;
                        return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Entidade', 
                            // @ts-ignore
                            error: !!((_a = formik.errors) === null || _a === void 0 ? void 0 : _a.entity), 
                            // @ts-ignore
                            helperText: (_b = formik.errors) === null || _b === void 0 ? void 0 : _b.entity })));
                    }, value: (_a = formik.values) === null || _a === void 0 ? void 0 : _a.entity })),
            React.createElement(Grid, { item: true, sm: 12, md: 4, lg: 4 },
                React.createElement(KeyboardDatePicker, { clearable: true, autoOk: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', label: 'In\u00EDcio de exclus\u00E3o', error: !!((_b = formik.errors) === null || _b === void 0 ? void 0 : _b.startDeleted), helperText: (_c = formik.errors) === null || _c === void 0 ? void 0 : _c.startDeleted, value: formik.values.startDeleted, onChange: (value) => formik.setFieldValue(`startDeleted`, value) })),
            React.createElement(Grid, { item: true, sm: 12, md: 4, lg: 4 },
                React.createElement(KeyboardDatePicker, { clearable: true, autoOk: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', label: 'Fim de exclus\u00E3o', error: !!((_d = formik.errors) === null || _d === void 0 ? void 0 : _d.endDeleted), helperText: (_e = formik.errors) === null || _e === void 0 ? void 0 : _e.endDeleted, value: formik.values.endDeleted, onChange: (value) => formik.setFieldValue(`endDeleted`, value) })))));
};
export default Filter;
//# sourceMappingURL=index.js.map