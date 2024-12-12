import * as React from 'react';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, IconButton, TextField, Tooltip, } from '@material-ui/core';
import { PREFIX } from '~/config/database';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { fetchAllPrograms } from '~/store/modules/program/actions';
import { fetchAllTeams } from '~/store/modules/team/actions';
import { Autocomplete } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';
import { Today } from '@material-ui/icons';
import { getSchedules } from '~/store/modules/schedule/actions';
import * as moment from 'moment';
import * as _ from 'lodash';
const Filter = ({ formik }) => {
    const [schedules, setSchedules] = React.useState([]);
    const [openChooseSchedules, setOpenChooseSchedules] = React.useState(false);
    const dispatch = useDispatch();
    const { program, team } = useSelector((state) => state);
    const { loading: loadingProgram, programs } = program;
    const { loading: loadingTeam, teams } = team;
    React.useEffect(() => {
        dispatch(fetchAllPrograms({
            active: 'Ativo',
            model: false,
        }));
    }, []);
    const handleChangeProgram = (newValue) => {
        formik.setFieldValue('program', newValue);
        formik.setFieldValue('team', null);
        dispatch(fetchAllTeams({
            programId: newValue === null || newValue === void 0 ? void 0 : newValue[`${PREFIX}programaid`],
            active: 'Ativo',
            model: false,
        }));
    };
    const handleChangeTeam = (newValue) => {
        formik.setFieldValue('team', newValue);
        getSchedules({
            teamId: newValue === null || newValue === void 0 ? void 0 : newValue[`${PREFIX}turmaid`],
            active: 'Ativo',
            orderBy: `${PREFIX}data`,
            order: 'asc',
        }).then((data) => {
            const newSchedules = data.map((e) => (Object.assign(Object.assign({}, e), { day: moment.utc(e === null || e === void 0 ? void 0 : e[`${PREFIX}data`]).format('DD/MM/YYYY'), selected: true })));
            setSchedules(newSchedules);
            formik.setFieldValue('schedules', newSchedules === null || newSchedules === void 0 ? void 0 : newSchedules.map((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}cronogramadediaid`]));
        });
    };
    const handleCheckSchedule = (i) => {
        const newSchedules = _.cloneDeep(schedules);
        newSchedules[i].selected = !newSchedules[i].selected;
        setSchedules(newSchedules);
    };
    const handleSelectAll = (selected) => {
        let newSchedules = _.cloneDeep(schedules);
        newSchedules = newSchedules.map((e) => (Object.assign(Object.assign({}, e), { selected })));
        setSchedules(newSchedules);
    };
    const handleApply = () => {
        var _a;
        formik.setFieldValue('schedules', (_a = schedules === null || schedules === void 0 ? void 0 : schedules.filter((e) => e === null || e === void 0 ? void 0 : e.selected)) === null || _a === void 0 ? void 0 : _a.map((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}cronogramadediaid`]));
        setOpenChooseSchedules(false);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '1rem' } },
            React.createElement(Grid, { container: true, spacing: 3 },
                React.createElement(Grid, { item: true, lg: 6, md: 6 },
                    React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', loading: loadingProgram, options: programs, onChange: (event, newValue) => {
                            handleChangeProgram(newValue);
                        }, getOptionLabel: (option) => {
                            var _a, _b;
                            return `${(option === null || option === void 0 ? void 0 : option[`${PREFIX}Empresa`])
                                ? ((_a = option === null || option === void 0 ? void 0 : option[`${PREFIX}Empresa`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) + ' - '
                                : ''}${((_b = option === null || option === void 0 ? void 0 : option[`${PREFIX}NomePrograma`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]) || ''}`;
                        }, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!formik.errors.program, helperText: formik.errors.program, label: 'Programa' }))), value: formik.values.program })),
                React.createElement(Grid, { item: true, lg: 5, md: 5 },
                    React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', loading: loadingTeam, options: teams, disabled: !(teams === null || teams === void 0 ? void 0 : teams.length), onChange: (event, newValue) => handleChangeTeam(newValue), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!formik.errors.team, helperText: formik.errors.team, label: 'Turma' }))), value: formik.values.team })),
                React.createElement(Grid, { item: true, lg: 1, md: 1 },
                    React.createElement(Tooltip, { title: 'Dias de aula' },
                        React.createElement(IconButton, { disabled: !schedules.length, onClick: () => setOpenChooseSchedules(true) },
                            React.createElement(Today, null)))),
                React.createElement(Grid, { item: true, lg: 3, md: 4 },
                    React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', label: 'Data de In\u00EDcio', error: !!formik.errors.startDate, 
                        // @ts-ignore
                        helperText: formik.errors.startDate, value: formik.values.startDate, onChange: (value) => {
                            formik.setFieldValue('startDate', value);
                            if (!formik.values.endDate) {
                                formik.setFieldValue('endDate', value);
                            }
                        } })),
                React.createElement(Grid, { item: true, lg: 3, md: 4 },
                    React.createElement(KeyboardDatePicker, { autoOk: true, fullWidth: true, clearable: true, variant: 'inline', format: 'DD/MM/YYYY', label: 'Data de Fim', error: !!formik.errors.endDate, 
                        // @ts-ignore
                        helperText: formik.errors.endDate, value: formik.values.endDate, onChange: (value) => {
                            formik.setFieldValue('endDate', value);
                        } }))),
            React.createElement(Box, { width: '100%', display: 'flex', justifyContent: 'flex-end' },
                React.createElement(Button, { variant: 'contained', color: 'primary', onClick: () => formik.handleSubmit() }, "Pesquisar"))),
        React.createElement(Dialog, { fullWidth: true, maxWidth: 'sm', open: openChooseSchedules, onClose: () => setOpenChooseSchedules(false) },
            React.createElement(DialogTitle, null, "Dias de aula"),
            React.createElement(DialogContent, null,
                React.createElement(Box, { width: '100%', display: 'flex', style: { gap: '10px' } },
                    React.createElement(Button, { onClick: () => handleSelectAll(true) }, "Marcar todos"),
                    React.createElement(Button, { onClick: () => handleSelectAll(false) }, "Desmarcar todos")),
                React.createElement(Box, null,
                    React.createElement(FormControl, { component: 'fieldset' },
                        React.createElement(FormGroup, null, schedules === null || schedules === void 0 ? void 0 : schedules.map((actv, i) => (React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: actv.selected, onChange: () => handleCheckSchedule(i), name: actv.day, color: 'primary' }), label: actv.day }))))))),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: () => setOpenChooseSchedules(false) }, "Cancelar"),
                React.createElement(Button, { onClick: handleApply, variant: 'contained', color: 'primary' }, "Aplicar")))));
};
export default Filter;
//# sourceMappingURL=index.js.map