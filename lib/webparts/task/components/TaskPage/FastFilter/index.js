import * as React from 'react';
import { Box } from '@material-ui/core';
import { StyledToggleButton, StyledToggleButtonGroup } from './styles';
import { useLoggedUser } from '~/hooks';
import { PREFIX } from '~/config/database';
import * as moment from 'moment';
import { STATUS_TASK } from '~/config/enums';
const FastFilter = ({ formik }) => {
    var _a, _b, _c, _d, _e, _f;
    const { currentUser } = useLoggedUser();
    const handleToggleResponsible = (event, nextType) => {
        if (nextType === 'todas') {
            formik.setFieldValue('responsible', []);
        }
        else {
            formik.setFieldValue('responsible', [currentUser]);
        }
        formik.handleSubmit();
    };
    const handleToggleDelayed = (event, nextType) => {
        if (nextType === 'todas') {
            formik.setFieldValue('endForecastConclusion', '');
            formik.setFieldValue('status', []);
        }
        else {
            formik.setFieldValue('status', [
                {
                    value: STATUS_TASK['Em Andamento'],
                    label: STATUS_TASK[STATUS_TASK['Em Andamento']],
                },
                {
                    value: STATUS_TASK['Não Iniciada'],
                    label: STATUS_TASK[STATUS_TASK['Não Iniciada']],
                },
            ]);
            formik.setFieldValue('endForecastConclusion', moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'));
        }
        formik.handleSubmit();
    };
    const handleTogglStatus = (event, nextType) => {
        if (nextType === 'todas') {
            formik.setFieldValue('status', []);
        }
        else if (nextType === 'active') {
            formik.setFieldValue('status', [
                {
                    value: STATUS_TASK['Em Andamento'],
                    label: STATUS_TASK[STATUS_TASK['Em Andamento']],
                },
                {
                    value: STATUS_TASK['Não Iniciada'],
                    label: STATUS_TASK[STATUS_TASK['Não Iniciada']],
                },
            ]);
        }
        else {
            formik.setFieldValue('status', [
                {
                    value: STATUS_TASK.Concluído,
                    label: STATUS_TASK[STATUS_TASK.Concluído],
                },
            ]);
        }
        formik.handleSubmit();
    };
    return (React.createElement(Box, { display: 'flex', style: { gap: '5px' } },
        React.createElement(StyledToggleButtonGroup, { exclusive: true, onChange: handleToggleResponsible, orientation: 'horizontal' },
            React.createElement(StyledToggleButton, { value: 'todas', selected: !((_b = (_a = formik === null || formik === void 0 ? void 0 : formik.values) === null || _a === void 0 ? void 0 : _a.responsible) === null || _b === void 0 ? void 0 : _b.length) }, "Todas"),
            React.createElement(StyledToggleButton, { value: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], selected: (_d = (_c = formik === null || formik === void 0 ? void 0 : formik.values) === null || _c === void 0 ? void 0 : _c.responsible) === null || _d === void 0 ? void 0 : _d.find((e) => (e === null || e === void 0 ? void 0 : e.value) === (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`])) }, "Minhas")),
        React.createElement(StyledToggleButtonGroup, { onChange: handleToggleDelayed, orientation: 'horizontal', exclusive: true },
            React.createElement(StyledToggleButton, { value: 'todas', selected: !((_e = formik === null || formik === void 0 ? void 0 : formik.values) === null || _e === void 0 ? void 0 : _e.endForecastConclusion) }, "Todas"),
            React.createElement(StyledToggleButton, { value: 'delayed', selected: !!((_f = formik === null || formik === void 0 ? void 0 : formik.values) === null || _f === void 0 ? void 0 : _f.endForecastConclusion) }, "Atrasadas")),
        React.createElement(StyledToggleButtonGroup, { onChange: handleTogglStatus, orientation: 'horizontal', exclusive: true },
            React.createElement(StyledToggleButton, { selected: !formik.values.status.length, value: 'todas' }, "Todas"),
            React.createElement(StyledToggleButton, { selected: formik.values.status.length === 2, value: 'active' }, "Ativas"),
            React.createElement(StyledToggleButton, { selected: formik.values.status.length === 1, value: 'concluded' }, "Conclu\u00EDdas"))));
};
export default FastFilter;
//# sourceMappingURL=index.js.map