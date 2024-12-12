import * as React from 'react';
import { Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { EFatherTag, PRIORITY_TASK, STATUS_TASK, TYPE_TASK, } from '~/config/enums';
import { PREFIX } from '~/config/database';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardDatePicker, KeyboardDateTimePicker, } from '@material-ui/pickers';
import { fetchAllPrograms } from '~/store/modules/program/actions';
import { fetchAllTeams } from '~/store/modules/team/actions';
import * as moment from 'moment';
const InfoForm = ({ isDetail, values, errors, task, setFieldValue, handleChange, }) => {
    const dispatch = useDispatch();
    const { tag, person, program, team } = useSelector((state) => state);
    const { dictTag, tags } = tag;
    const { persons } = person;
    const { loading: loadingProgram, programs } = program;
    const { loading: loadingTeam, teams } = team;
    React.useEffect(() => {
        if (!task || (task === null || task === void 0 ? void 0 : task[`${PREFIX}tipo`]) !== TYPE_TASK.PLANEJAMENTO) {
            dispatch(fetchAllPrograms({
                active: 'Ativo',
                model: false,
            }));
        }
    }, []);
    const handleChangeProgram = (newValue) => {
        setFieldValue('program', newValue);
        dispatch(fetchAllTeams({
            programId: newValue === null || newValue === void 0 ? void 0 : newValue[`${PREFIX}programaid`],
            active: 'Ativo',
            model: false,
        }));
    };
    const handleChangeStatus = (_e, newValue) => {
        setFieldValue(`status`, newValue);
        if (newValue.value === STATUS_TASK.Concluído) {
            setFieldValue('concludedDay', moment());
        }
    };
    const functionOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO);
    }), [tags]);
    const statusOptions = React.useMemo(() => Object.values(STATUS_TASK)
        .filter((e) => typeof e === 'string')
        .map((key) => ({
        value: STATUS_TASK[key],
        label: key,
    })), []);
    const priorityOptions = React.useMemo(() => Object.values(PRIORITY_TASK)
        .filter((e) => typeof e === 'string')
        .map((key) => ({
        value: PRIORITY_TASK[key],
        label: key,
    })), []);
    const activitiesOptions = React.useMemo(() => {
        var _a, _b;
        return (_b = (_a = values.team) === null || _a === void 0 ? void 0 : _a[`${PREFIX}ise_atividade_Turma_ise_turma`]) === null || _b === void 0 ? void 0 : _b.map((actv) => (Object.assign(Object.assign({}, actv), { label: `${moment(actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY')} - ${actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}nome`]}` })));
    }, [values.team]);
    return (React.createElement(Grid, { container: true, spacing: 3 },
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(TextField, { autoFocus: true, fullWidth: true, required: true, label: 'T\u00EDtulo', type: 'text', name: 'title', disabled: task &&
                    (isDetail || (task === null || task === void 0 ? void 0 : task[`${PREFIX}tipo`]) !== TYPE_TASK.PLANEJAMENTO), inputProps: { maxLength: 255 }, error: !!errors.title, helperText: errors.title, onChange: handleChange, value: values.title })),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(TextField, { fullWidth: true, disabled: true, label: 'Tipo', type: 'text', name: 'type', inputProps: { maxLength: 255 }, error: !!errors.type, helperText: errors.type, onChange: handleChange, value: values.type })),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Autocomplete, { multiple: true, options: persons || [], filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', disabled: isDetail, getOptionLabel: (option) => option === null || option === void 0 ? void 0 : option.label, onChange: (event, newValue) => {
                    setFieldValue(`responsible`, newValue);
                }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Pessoa(s) Respons\u00E1vel' }))), value: values === null || values === void 0 ? void 0 : values.responsible })),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Autocomplete, { options: functionOptions || [], filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', disabled: isDetail, getOptionLabel: (option) => option === null || option === void 0 ? void 0 : option.label, onChange: (event, newValue) => {
                    setFieldValue(`group`, newValue);
                }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Grupo Respons\u00E1vel' }))), value: values === null || values === void 0 ? void 0 : values.group })),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Autocomplete, { options: statusOptions, filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', disabled: isDetail, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', onChange: handleChangeStatus, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => (React.createElement(TextField, Object.assign({ required: true }, params, { fullWidth: true, label: 'Progresso' }))), value: values === null || values === void 0 ? void 0 : values.status })),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Autocomplete, { options: priorityOptions, filterSelectedOptions: true, disabled: isDetail, noOptionsText: 'Sem Op\u00E7\u00F5es', getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', onChange: (event, newValue) => {
                    setFieldValue(`priority`, newValue);
                }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => (React.createElement(TextField, Object.assign({ required: true }, params, { fullWidth: true, label: 'Prioridade' }))), value: values === null || values === void 0 ? void 0 : values.priority })),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Autocomplete, { loading: loadingProgram, options: programs, filterSelectedOptions: true, disabled: task &&
                    (isDetail || (task === null || task === void 0 ? void 0 : task[`${PREFIX}tipo`]) !== TYPE_TASK.PLANEJAMENTO), noOptionsText: 'Sem Op\u00E7\u00F5es', getOptionLabel: (option) => {
                    var _a, _b;
                    return ((option === null || option === void 0 ? void 0 : option[`${PREFIX}NomePrograma`])
                        ? `${((_a = option === null || option === void 0 ? void 0 : option[`${PREFIX}Empresa`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) || ''} - ${((_b = option === null || option === void 0 ? void 0 : option[`${PREFIX}NomePrograma`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]) || ''}`
                        : option === null || option === void 0 ? void 0 : option.label) || '';
                }, onChange: (event, newValue) => {
                    handleChangeProgram(newValue);
                }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => (React.createElement(TextField, Object.assign({ required: true }, params, { fullWidth: true, error: !!errors.program, helperText: errors.program, label: 'Programa' }))), value: values === null || values === void 0 ? void 0 : values.program })),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', loading: loadingTeam, options: teams, disabled: !(teams === null || teams === void 0 ? void 0 : teams.length), onChange: (event, newValue) => {
                    setFieldValue('team', newValue);
                }, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!errors.team, helperText: errors.team, label: 'Turma' }))), value: values.team })),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: activitiesOptions || [], disabled: !(teams === null || teams === void 0 ? void 0 : teams.length), onChange: (event, newValue) => {
                    setFieldValue('activity', newValue);
                }, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!errors.activity, helperText: errors.activity, label: 'Atividade' }))), value: values.activity })),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, fullWidth: true, disabled: isDetail, variant: 'inline', format: 'DD/MM/YYYY', label: 'Data de In\u00EDcio', value: values.startDay, error: !!errors.startDay, helperText: errors.startDay, onChange: (newValue) => {
                    setFieldValue(`startDay`, newValue);
                } })),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(KeyboardDateTimePicker, { autoOk: true, clearable: true, fullWidth: true, disabled: true, ampm: false, variant: 'inline', format: 'DD/MM/YYYY HH:mm', label: 'Data de Cria\u00E7\u00E3o', value: values.createdon || null, onChange: () => { } })),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, fullWidth: true, required: true, disabled: isDetail, variant: 'inline', format: 'DD/MM/YYYY', label: 'Previs\u00E3o de Conclus\u00E3o', error: !!errors.completionForecast, helperText: errors.completionForecast, value: values.completionForecast, onChange: (newValue) => {
                    setFieldValue(`completionForecast`, newValue);
                } })),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(KeyboardDateTimePicker, { autoOk: true, disabled: true, clearable: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY HH:mm', label: 'Data de Conclus\u00E3o', error: !!errors.concludedDay, helperText: errors.concludedDay, value: values.concludedDay, onChange: () => { } })),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(TextField, { fullWidth: true, label: 'Link para Conte\u00FAdo', type: 'text', name: 'link', disabled: isDetail, inputProps: { maxLength: 255 }, error: !!errors.link, helperText: errors.link, onChange: handleChange, value: values.link })),
        React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
            React.createElement(TextField, { fullWidth: true, multiline: true, minRows: 2, label: 'Anota\u00E7\u00F5es', type: 'text', name: 'observation', disabled: isDetail, inputProps: { maxLength: 2000 }, onChange: handleChange, value: values.observation }))));
};
export default InfoForm;
//# sourceMappingURL=index.js.map