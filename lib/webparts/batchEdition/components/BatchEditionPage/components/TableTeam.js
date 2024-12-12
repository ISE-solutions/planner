import * as React from 'react';
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Checkbox, } from '@material-ui/core';
import ContentEditable from 'react-contenteditable';
import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { TableEnvolvedPeople, TableFantasyName, TableParticipants, } from '../utils';
const TableTeam = ({ control, team, setValue, modalityOptions, temperatureOptions, functionOptions, persons, useOptions, useParticipantsOptions, }) => {
    const [open, setOpen] = React.useState(true);
    return (React.createElement(Box, { overflow: 'auto' },
        React.createElement(Table, { "aria-label": 'collapsible table', size: 'small' },
            React.createElement(TableHead, null,
                React.createElement(TableRow, null,
                    React.createElement(TableCell, null),
                    React.createElement(TableCell, null, "T\u00EDtulo"),
                    React.createElement(TableCell, null, "Sigla"),
                    React.createElement(TableCell, null, "Nome"),
                    React.createElement(TableCell, null, "C\u00F3digo da turma (Financeiro)"),
                    React.createElement(TableCell, null, "Nome da turma (Financeiro)"),
                    React.createElement(TableCell, null, "Link"),
                    React.createElement(TableCell, null, "Link backup"),
                    React.createElement(TableCell, null, "Ano de Conclus\u00E3o"),
                    React.createElement(TableCell, null, "Temperatura/Status"),
                    React.createElement(TableCell, null, "Modalidade"),
                    React.createElement(TableCell, null, "Permitir atividades concorrentes"))),
            React.createElement(TableBody, null, team === null || team === void 0 ? void 0 : team.map((row, i) => (React.createElement(React.Fragment, null,
                React.createElement(TableRow, null,
                    React.createElement(TableCell, null,
                        React.createElement(IconButton, { "aria-label": 'expand row', size: 'small', onClick: () => setOpen(!open) }, open ? React.createElement(KeyboardArrowUp, null) : React.createElement(KeyboardArrowDown, null))),
                    React.createElement(TableCell, { component: 'th', scope: 'row', style: { minWidth: '150px' } },
                        React.createElement(Controller, { control: control, name: `team.${i}.title`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                    React.createElement(TableCell, { component: 'th', scope: 'row', style: { minWidth: '150px' } },
                        React.createElement(Controller, { control: control, name: `team.${i}.sigla`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                    React.createElement(TableCell, { component: 'th', scope: 'row', style: { minWidth: '250px' } }, row.name),
                    React.createElement(TableCell, { component: 'th', scope: 'row', style: { minWidth: '200px' } },
                        React.createElement(Controller, { control: control, name: `team.${i}.teamCode`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                    React.createElement(TableCell, { component: 'th', scope: 'row', style: { minWidth: '250px' } },
                        React.createElement(Controller, { control: control, name: `team.${i}.teamName`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                    React.createElement(TableCell, { component: 'th', scope: 'row', style: { minWidth: '250px' } },
                        React.createElement(Controller, { control: control, name: `team.${i}.mask`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                    React.createElement(TableCell, { component: 'th', scope: 'row', style: { minWidth: '250px' } },
                        React.createElement(Controller, { control: control, name: `team.${i}.maskBackup`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                    React.createElement(TableCell, { component: 'th', scope: 'row', style: { minWidth: '100px' } },
                        React.createElement(Controller, { control: control, name: `team.${i}.yearConclusion`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                    React.createElement(TableCell, { component: 'th', scope: 'row', style: { minWidth: '250px' } },
                        React.createElement(Controller, { control: control, name: `team.${i}.temperature`, defaultValue: {}, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: temperatureOptions, onChange: (event, newValue) => setValue(`team.${i}.temperature`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'temperature', label: '' }))) })) })),
                    React.createElement(TableCell, { component: 'th', scope: 'row', style: { minWidth: '250px' } },
                        React.createElement(Controller, { control: control, name: `team.${i}.modality`, defaultValue: {}, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: modalityOptions, onChange: (event, newValue) => setValue(`team.${i}.modality`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'modality', label: '' }))) })) })),
                    React.createElement(TableCell, { component: 'th', scope: 'row', style: { minWidth: '100px' } },
                        React.createElement(Controller, { control: control, name: `team.${i}.concurrentActivity`, render: ({ field }) => (React.createElement(Checkbox, { color: 'primary', checked: field.value, value: field.value, onChange: field.onChange })) }))),
                React.createElement(TableRow, null,
                    React.createElement(TableCell, { style: { paddingBottom: 0, paddingTop: 0 }, colSpan: 12 },
                        React.createElement(Collapse, { in: open, timeout: 'auto', unmountOnExit: true },
                            React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '1rem' } },
                                React.createElement(Box, { display: 'flex', flexDirection: 'column', borderRadius: '10px', border: '1px solid #0063a5', padding: '10px', marginTop: '1rem', style: { gap: '1rem' } },
                                    React.createElement(TableEnvolvedPeople, { envolvedPeople: row === null || row === void 0 ? void 0 : row.people, functionOptions: functionOptions, persons: persons, baseKey: `team.${i}.people`, control: control, setValue: setValue }),
                                    React.createElement(TableFantasyName, { fantasyName: row === null || row === void 0 ? void 0 : row.names, useOptions: useOptions, baseKey: `team.${i}.names`, control: control, setValue: setValue }),
                                    React.createElement(TableParticipants, { participants: row === null || row === void 0 ? void 0 : row.participants, useOptions: useParticipantsOptions, baseKey: `team.${i}.participants`, control: control, setValue: setValue })))))))))))));
};
export default TableTeam;
//# sourceMappingURL=TableTeam.js.map