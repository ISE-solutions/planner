import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, } from '@material-ui/core';
import * as React from 'react';
const DayReport = ({ day, items }) => {
    var _a, _b;
    return (React.createElement(Box, { display: 'flex', flexDirection: 'column', marginTop: '2rem' },
        React.createElement(Typography, { style: { fontWeight: 'bold', fontSize: '1rem', paddingBottom: '10px' } },
            day,
            ((_a = items === null || items === void 0 ? void 0 : items[0]) === null || _a === void 0 ? void 0 : _a.module) ? ' - ' + ((_b = items === null || items === void 0 ? void 0 : items[0]) === null || _b === void 0 ? void 0 : _b.module) : ''),
        React.createElement(TableContainer, { style: { overflow: 'hidden' }, component: Paper },
            React.createElement(Table, { size: 'small' },
                React.createElement(TableHead, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableCell, { style: { fontWeight: 'bold', minWidth: '85px', width: '10%' } }, "Hor\u00E1rio"),
                        React.createElement(TableCell, { style: { fontWeight: 'bold', width: '20%' } }, "Atividade"),
                        React.createElement(TableCell, { style: { fontWeight: 'bold', width: '35%' } }, "Descri\u00E7\u00E3o"),
                        React.createElement(TableCell, { style: { fontWeight: 'bold', width: '20%' } }, "Respons\u00E1vel"),
                        React.createElement(TableCell, { style: { fontWeight: 'bold', width: '15%' } }, "Local"))),
                React.createElement(TableBody, null, items.map((row) => {
                    var _a;
                    return (React.createElement(TableRow, { key: row.time },
                        React.createElement(TableCell, null, row.time),
                        React.createElement(TableCell, null, row.name),
                        React.createElement(TableCell, null, (_a = row === null || row === void 0 ? void 0 : row.documents) === null || _a === void 0 ? void 0 :
                            _a.map((doc) => (React.createElement("p", { style: { fontWeight: 'bold' } },
                                doc,
                                " "))),
                            React.createElement("p", { style: { textDecoration: 'underline' } }, row.course),
                            React.createElement("p", null,
                                row.theme,
                                " "),
                            React.createElement("p", { style: { fontStyle: 'italic' } }, row.academicArea)),
                        React.createElement(TableCell, null, row.people),
                        React.createElement(TableCell, null, row.spaces)));
                }))))));
};
export default DayReport;
//# sourceMappingURL=index.js.map